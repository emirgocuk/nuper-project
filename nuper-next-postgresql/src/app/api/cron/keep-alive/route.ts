import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    const isAuthorized = cronSecret && (
        token === cronSecret || 
        authHeader === `Bearer ${cronSecret}`
    );

    // Verify token to prevent unauthorized spam
    if (!isAuthorized) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Run a simple query to ping PostgreSQL on Supabase
        const projectCount = await prisma.project.count();
        return NextResponse.json({
            success: true,
            message: "Supabase successfully pinged, keep-alive active.",
            timestamp: new Date().toISOString(),
            data: { projectCount }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Database ping failed.",
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
