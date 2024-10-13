"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { ListValidator } from "./schema";
import { db } from "@/lib/db";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    let { items, boardId } = data;
    let lists;

    try {
        const transaction = items.map(list => db.list.update({
            where: { id: list.id, board: { orgId } },
            data: { order: list.order }
        }))

        const board = await db.board.findUnique({ where: { id: boardId, orgId } });
        if (!board) {
            return {
                error: "Board not found"
            }
        }
        lists = await db.$transaction(transaction);
        
    }
    catch (error) {
        return { error: "Failed to reorder." };
    }
    revalidatePath("/board/" + boardId);
    return { data: lists };
}

export const orderList = createAction(ListValidator, handler);
