'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const cardImage = formData.get('cardImage') as string;
    const published = formData.get('published') === 'on';

    try {
        await prisma.event.create({
            // @ts-ignore - Prisma types might be stale
            data: {
                title,
                slug,
                description,
                // Prisma Client runtime seems to expect String for Json field in this environment.
                content: content || "{}",
                date,
                cardImage,
                isFeatured: formData.get('isFeatured') === 'on',
                // published: true, // Auto-publish via schema
            }
        });
    } catch (error: any) {
        console.error("Failed to create event detailed:", error);
        throw new Error(error.message || "Failed to create event");
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    redirect('/admin/events');
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({
            where: { id }
        });
        revalidatePath('/admin/events');
        revalidatePath('/events');
    } catch (error) {
        console.error("Failed to delete event:", error);
        throw new Error("Failed to delete event");
    }
}

export async function updateEvent(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const cardImage = formData.get('cardImage') as string;
    const isFeatured = formData.get('isFeatured') === 'on';

    try {
        await prisma.event.update({
            // @ts-ignore - Prisma types might be stale
            where: { id },
            data: {
                title,
                slug,
                description,
                content: content || "{}",
                date,
                cardImage,
                isFeatured,
            }
        });
    } catch (error: any) {
        console.error("Failed to update event:", error);
        throw new Error(error.message || "Failed to update event");
    }

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath('/');
    redirect('/admin/events');
}

export async function toggleEventFeatured(id: string, currentStatus: boolean) {
    try {
        await prisma.event.update({
            // @ts-ignore - Prisma types might be stale
            where: { id },
            data: {
                isFeatured: !currentStatus
            }
        });
        revalidatePath('/admin/events');
        revalidatePath('/');
    } catch (error) {
        console.error("Failed to toggle featured:", error);
        throw new Error("Failed to toggle featured status");
    }
}
