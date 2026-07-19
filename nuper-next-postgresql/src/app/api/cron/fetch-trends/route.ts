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

    // 2. Fetch and analyze feeds
    for (const source of sources) {
      try {
        const feedItems = await fetchRSSFeed(source.url);
        
        // Only process the latest 5 items per source to save API costs & prevent timeout limits
        const latestItems = feedItems.slice(0, 5);

        for (const item of latestItems) {
          // Check if already fetched
          const exists = await prisma.trendFeed.findUnique({
            where: { link: item.link }
          });

          if (!exists) {
            let aiAnalysis = { summary: "", feasibility: "", score: 50 };
            
            // Check if OpenRouter API is configured before calling AI
            if (process.env.OPENROUTER_API_KEY) {
              aiAnalysis = await analyzeTrendViability(item.title, item.contentSnippet);
            } else {
              aiAnalysis = {
                summary: item.contentSnippet.substring(0, 150) + "...",
                feasibility: "OpenRouter API anahtarı girilmediği için AI analizi yapılamadı.",
                score: 50
              };
            }

            // Save feed item
            await prisma.trendFeed.create({
              data: {
                sourceId: source.id,
                title: item.title,
                link: item.link,
                content: item.contentSnippet,
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                aiScore: aiAnalysis.score,
                aiSummary: aiAnalysis.summary,
                aiFeasibility: aiAnalysis.feasibility,
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

    return NextResponse.json({
      success: true,
      newFeedsFetched: newlyFetchedCount,
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
