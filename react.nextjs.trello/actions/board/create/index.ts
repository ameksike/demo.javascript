"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { BoardValidator } from "./schema";
import { db } from "@/lib/db";

interface ImageProps {
    imageId: string;
    imageThumbUrl: string;
    imageFullUrl: string;
    imageUserName: string;
    imageLinkHTML: string;
}

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }
    let { title, image } = data;
    let imgObj = null;

    try {
        imgObj = (image ? JSON.parse(image) : {}) as ImageProps;
    }
    catch (error) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }

    let board;
    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                ...imgObj
            }
        });
    }
    catch (error) {
        return { error: "Failed to create." };
    }
    revalidatePath("/board/" + board.id);
    return { data: board };
}

export const createBoard = createAction(BoardValidator, handler);
