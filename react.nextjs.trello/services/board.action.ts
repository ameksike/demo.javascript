"use server";
/**
 * Check the topic: Next.js: Server-side form validation
 */
import { db } from "@/lib/db";
import { ImageMeta } from "@/model/image.data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z as validator } from "zod";

export type State = {
    errors?: {
        title?: string[];
    },
    message?: string | null
}

const boardValidator = validator.object({
    title: validator.string().min(3, {
        message: "Minimun length of 3 letters is required"
    }),
    image: validator.string({
        required_error: "Image is required",
        invalid_type_error: "Image is required"
    })
});

export async function createSafe(prevState: State, formData: FormData) {
    const validateFields = boardValidator.safeParse({
        title: formData?.get("title") as string,
        image: formData?.get("image") as string
    });
    if (!validateFields.success) {
        return {
            errors: validateFields.error.flatten().fieldErrors,
            message: "Missing fields."
        }
    }
    const orgId = "org_2n0yRQkYxJOsPwwtNLmGtmqtHa3";
    const { title, image } = validateFields.data;
    let imgObj = null;
    try {
        imgObj = (image ? JSON.parse(image) : {}) as ImageMeta;
    }
    catch (error) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }
    try {
        await db.board.create({
            data: {
                orgId,
                title,
                ...imgObj
            }
        });
        return prevState;
    }
    catch (error) {
        return {
            message: "Database error"
        }
    }
    finally {
        revalidatePath("/organization/" + orgId);
        redirect("/organization/" + orgId);
    }
}

export async function create(formData: FormData) {
    try {
        const orgId = "org_2n0yRQkYxJOsPwwtNLmGtmqtHa3";
        const { title, image } = boardValidator.parse({
            title: formData?.get("title") as string,
            image: formData?.get("image") as string
        });
        let imgObj = null;
        try {
            imgObj = (image ? JSON.parse(image) : {}) as ImageMeta;
        }
        catch (error) {
            return {
                error: "Missing fields. Failed to create board."
            }
        }
        await db.board.create({
            data: {
                orgId,
                title,
                ...imgObj
            }
        });
    }
    catch (error) {
    }
    revalidatePath("/organization/org_2n0yRQkYxJOsPwwtNLmGtmqtHa3");
}

export async function list({ orgId }: { orgId?: string }) {
    return await orgId ? db.board.findMany({ where: { orgId }, orderBy: { createdAt: "desc" } }) : db.board.findMany();
}

export async function remove(id: string) {
    return await db.board.delete({ where: { id } });
}

