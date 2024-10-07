"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { BoardUpdateValidator as BoardValidator } from "./schema";
import { db } from "@/lib/db";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }
    let { title, id } = data;
    let board;
    try {
        board = await db.board.update({
            where: { id, orgId },
            data: { title }
        });
    }
    catch (error) {
        return { error: "Failed to update." };
    }
    revalidatePath("/board/" + id);
    return { data: board };
}

export const updateBoard = createAction(BoardValidator, handler);
