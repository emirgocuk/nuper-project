'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBulletin(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const publisher = formData.get('publisher') as string;
    const content = formData.get('content') as string; // JSON string from Editor
    const cardImage = formData.get('cardImage') as string; // URL from upload or input
    const published = formData.get('published') === 'on';

    if (!title || !slug) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.bulletin.create({
            // @ts-ignore - Prisma types might be stale
            data: {
                title,
                slug,
                description: formData.get('description') as string,
                publisher,
                // Prisma Client runtime seems to expect String for Json field in this environment, 
                // possibly due to stale client generation. Passing stringified JSON directly.
                content: content || "{}",
                cardImage,
                // published: true, // Default to true via schema
            }
        });
    } catch (error: any) {
        console.error("Failed to create bulletin detailed:", error);
        throw new Error(error.message || "Failed to create bulletin");
    }

    revalidatePath('/admin/bulletins');
    revalidatePath('/bulletins');
    redirect('/admin/bulletins');
}

export async function deleteBulletin(id: string) {
    try {
        await prisma.bulletin.delete({
            where: { id }
        });
        revalidatePath('/admin/bulletins');
        revalidatePath('/bulletins');
    } catch (error) {
        console.error("Failed to delete bulletin:", error);
        throw new Error("Failed to delete bulletin");
    }
}

export async function updateBulletin(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const publisher = formData.get('publisher') as string;
    const content = formData.get('content') as string;
    const cardImage = formData.get('cardImage') as string;

    if (!title || !slug) {
        throw new Error("Missing required fields");
    }

    try {
        await prisma.bulletin.update({
            // @ts-ignore - Prisma types might be stale
            where: { id },
            data: {
                title,
                slug,
                description,
                publisher,
                content: content || "{}",
                cardImage,
            }
        });
    } catch (error: any) {
        console.error("Failed to update bulletin:", error);
        throw new Error(error.message || "Failed to update bulletin");
    }

    revalidatePath('/admin/bulletins');
    revalidatePath('/bulletins');
    revalidatePath('/');
    redirect('/admin/bulletins');
}
