import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        const skip = (page - 1) * pageSize;

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    published: true,
                    isFeatured: true,
                },
            }),
            prisma.event.count(),
        ]);

        return NextResponse.json({ events, total });
    } catch (error) {
        console.error("Failed to fetch events", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
