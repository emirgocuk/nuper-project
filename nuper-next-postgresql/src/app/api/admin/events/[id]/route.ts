import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.event.delete({
            where: { id },
        });

        revalidatePath("/admin/events");
        revalidatePath("/events");
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete event", error);
        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        );
    }
}
