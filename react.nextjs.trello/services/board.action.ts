"use server";
/**
 * Check the topic: Next.js: Server-side form validation
 */
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const boardValidator = z.object({
    title: z.string()
});

export async function create(formData: FormData) {

    const { title } = boardValidator.parse({
        title: formData?.get("title") as string
    });

    await db.board.create({
        data: {
            title
        }
    });

    revalidatePath("/organization/org_2n0yRQkYxJOsPwwtNLmGtmqtHa3");
}

export async function list() {
    return await db.board.findMany();
}

export async function remove(id: string) {
    return await db.board.delete({ where: { id } });
}

