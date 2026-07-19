import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchRSSFeed } from "@/lib/rssParser";
import { analyzeTrendViability } from "@/lib/openrouter";

export const dynamic = "force-dynamic";

// Default RSS feeds to seed if none exist
const DEFAULT_SOURCES = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "Wired", url: "https://www.wired.com/feed/rss" },
  { name: "VentureBeat", url: "https://venturebeat.com/feed/" }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const authHeader = request.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  const isAuthorized = cronSecret && (
    token === cronSecret || 
    authHeader === `Bearer ${cronSecret}`
  );

  if (!isAuthorized) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // 1. Seed default sources if empty
    let sources = await prisma.trendSource.findMany({ where: { active: true } });
    if (sources.length === 0) {
      await prisma.trendSource.createMany({
        data: DEFAULT_SOURCES,
        skipDuplicates: true
      });
      sources = await prisma.trendSource.findMany({ where: { active: true } });
    }

    let newlyFetchedCount = 0;
    const errors: string[] = [];

    // 2. Fetch and store new RSS items (instantly, without AI)
    for (const source of sources) {
      try {
        const feedItems = await fetchRSSFeed(source.url);
        
        // Take latest 5 items from the feed
        const latestItems = feedItems.slice(0, 5);

        for (const item of latestItems) {
          // Check if already in database
          const exists = await prisma.trendFeed.findUnique({
            where: { link: item.link }
          });

          if (!exists) {
            // Save item immediately as PENDING analysis (aiScore: 0, aiSummary: null)
            await prisma.trendFeed.create({
              data: {
                sourceId: source.id,
                title: item.title,
                link: item.link,
                content: item.contentSnippet,
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                aiScore: 0, // 0 signifies pending/unprocessed
                aiSummary: null,
                aiFeasibility: null,
                isImported: false
              }
            });

            newlyFetchedCount++;
          }
        }
      } catch (srcError: any) {
        console.error(`Failed to process source ${source.name}:`, srcError);
        errors.push(`${source.name}: ${srcError.message}`);
      }
    }

    // 3. Batch AI Analysis: Fetch top 2 unprocessed items (aiScore = 0)
    const unprocessedItems = await prisma.trendFeed.findMany({
      where: {
        aiScore: 0,
        aiSummary: null
      },
      orderBy: { createdAt: "asc" }, // Process oldest first
      take: 2 // Process maximum 2 items per run to stay well within 10-second timeout limit
    });

    let analyzedCount = 0;

    for (const item of unprocessedItems) {
      try {
        let aiAnalysis = { summary: "", feasibility: "", score: 50 };
        
        if (process.env.OPENROUTER_API_KEY) {
          aiAnalysis = await analyzeTrendViability(item.title, item.content || "");
        } else {
          aiAnalysis = {
            summary: item.content ? item.content.substring(0, 150) + "..." : "İçerik yok.",
            feasibility: "OpenRouter API anahtarı girilmediği için otomatik AI analizi yapılamadı.",
            score: 50
          };
        }

        // Update the item with AI analysis results
        await prisma.trendFeed.update({
          where: { id: item.id },
          data: {
            aiScore: aiAnalysis.score || 50,
            aiSummary: aiAnalysis.summary,
            aiFeasibility: aiAnalysis.feasibility
          }
        });

        analyzedCount++;
      } catch (aiError: any) {
        console.error(`Failed to analyze item ${item.title}:`, aiError);
        errors.push(`AI Analysis - ${item.title}: ${aiError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      newFeedsFetched: newlyFetchedCount,
      aiAnalyzedInThisRun: analyzedCount,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Fetch trends cron failed:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
