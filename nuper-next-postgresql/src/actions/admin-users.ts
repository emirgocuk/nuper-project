'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error("Delete user error:", error);
        return { error: "Kullanıcı silinemedi." };
    }
}
