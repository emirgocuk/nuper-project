"use server";

import { prisma } from "@/lib/db";
import { fetchRSSFeed } from "@/lib/rssParser";
import { analyzeTrendViability } from "@/lib/openrouter";
import { revalidatePath } from "next/cache";

const DEFAULT_SOURCES = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
  { name: "Wired", url: "https://www.wired.com/feed/rss" },
  { name: "VentureBeat", url: "https://venturebeat.com/feed/" }
];

/**
 * Server Action: Manually triggers RSS fetching and AI analysis
 */
export async function triggerFetchTrends() {
  try {
    let sources = await prisma.trendSource.findMany({ where: { active: true } });
    if (sources.length === 0) {
      await prisma.trendSource.createMany({
        data: DEFAULT_SOURCES,
        skipDuplicates: true
      });
      sources = await prisma.trendSource.findMany({ where: { active: true } });
    }

    let newlyFetchedCount = 0;

    for (const source of sources) {
      const feedItems = await fetchRSSFeed(source.url);
      const latestItems = feedItems.slice(0, 3); // Limit to latest 3 per source in manual trigger to prevent timeouts

      for (const item of latestItems) {
        const exists = await prisma.trendFeed.findUnique({
          where: { link: item.link }
        });

        if (!exists) {
          let aiAnalysis = { summary: "", feasibility: "", score: 50 };
          
          if (process.env.OPENROUTER_API_KEY) {
            aiAnalysis = await analyzeTrendViability(item.title, item.contentSnippet);
          } else {
            aiAnalysis = {
              summary: item.contentSnippet.substring(0, 150) + "...",
              feasibility: "OpenRouter API anahtarı girilmediği için AI analizi yapılamadı.",
              score: 50
            };
          }

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
    }

    revalidatePath("/admin/trends");
    return { success: true, count: newlyFetchedCount };
  } catch (error: any) {
    console.error("Manual fetch trends failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Promotes an RSS trend item to a local project/idea
 */
export async function importTrendToProject(trendId: string) {
  try {
    const trend = await prisma.trendFeed.findUnique({
      where: { id: trendId }
    });

    if (!trend) {
      return { success: false, error: "Trend bulunamadı." };
    }

    if (trend.isImported) {
      return { success: false, error: "Bu trend zaten ithal edildi." };
    }

    // Create the Project/Idea inside the DB
    await prisma.project.create({
      data: {
        title: `İthal: ${trend.title}`,
        description: trend.aiSummary || trend.content?.substring(0, 500),
        status: "IDEA",
        visibility: "PRIVATE", // Saved as a private concept first
        aiDifficultyScore: trend.aiScore,
        aiFeasibilityReport: trend.aiFeasibility,
        aiBudgetEstimate: "Hesaplanacak",
        aiTimeEstimate: "Hesaplanacak"
      }
    });

    // Update status in TrendFeed
    await prisma.trendFeed.update({
      where: { id: trendId },
      data: { isImported: true }
    });

    revalidatePath("/admin/trends");
    return { success: true };
  } catch (error: any) {
    console.error("Import trend failed:", error);
    return { success: false, error: error.message };
  }
}
