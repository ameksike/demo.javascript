"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { BoardValidator } from "./schema";
import { db } from "@/lib/db";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId } = auth();
    if (!userId) {
        return {
            error: "Unauthorized"
        }
    }
    const { title } = data;
    let board;
    try {
        board = await db.board.create({
            data: {
                title
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
