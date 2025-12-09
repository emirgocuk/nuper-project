import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error("Failed to fetch event:", error);
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
}
