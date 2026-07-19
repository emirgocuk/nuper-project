import { prisma } from "@/lib/db";
import TrendsClient from "./TrendsClient";

export const dynamic = "force-dynamic";

export default async function AdminTrendsPage() {
  // Fetch latest trend feeds from the database
  const trends = await prisma.trendFeed.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      source: {
        select: {
          name: true
        }
      }
    }
  });

  return <TrendsClient initialTrends={trends} />;
}
