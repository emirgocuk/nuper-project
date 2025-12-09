import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const bulletin = await prisma.bulletin.findUnique({
            where: { id }
        });

        if (!bulletin) {
            return NextResponse.json({ error: "Bulletin not found" }, { status: 404 });
        }

        return NextResponse.json(bulletin);
    } catch (error) {
        console.error("Failed to fetch bulletin:", error);
        return NextResponse.json({ error: "Failed to fetch bulletin" }, { status: 500 });
    }
}
