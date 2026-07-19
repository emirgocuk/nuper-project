import { prisma } from "@/lib/db";
import DiscoveriesClient from "./DiscoveriesClient";

export const dynamic = "force-dynamic";

export default async function AdminDiscoveriesPage() {
  // Fetch all pending discoveries from the database
  const discoveries = await prisma.discoveredSource.findMany({
    where: {
      status: "PENDING"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return <DiscoveriesClient initialDiscoveries={discoveries} />;
}
