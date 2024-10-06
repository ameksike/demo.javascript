"use server";
/**
 * Check the topic: Next.js: Server-side form validation
 */
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
    errors?: {
        title?: string[];
    },
    message?: string | null
}

const boardValidator = z.object({
    title: z.string().min(3, {
        message: "Minimun length of 3 letters is required"
    })
});

export async function createSafe(prevState: State, formData: FormData) {
    const validateFields = boardValidator.safeParse({
        title: formData?.get("title") as string
    });
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing fields."
        }
    }
    const { title } = validateFields.data;
    try {
        await db.board.create({
            data: {
                title
            }
        });
        return prevState;
    }
    catch (error) {
        return {
            message: "Database error"
        }
    }
    revalidatePath("/organization/org_2n0yRQkYxJOsPwwtNLmGtmqtHa3");
    redirect("/organization/org_2n0yRQkYxJOsPwwtNLmGtmqtHa3");
}

export async function create(formData: FormData) {
    try {
        const { title } = boardValidator.parse({
            title: formData?.get("title") as string
        });

        await db.board.create({
            data: {
                title
            }
        });
    }
    catch (error) {
    }
    revalidatePath("/organization/org_2n0yRQkYxJOsPwwtNLmGtmqtHa3");
}

export async function list() {
    return await db.board.findMany();
}

export async function remove(id: string) {
    return await db.board.delete({ where: { id } });
}

