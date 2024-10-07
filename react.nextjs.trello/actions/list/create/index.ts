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

    let { title, boardId } = data;
    let list;

    try {
        const board = await db.board.findUnique({ where: { id: boardId, orgId } });
        if (!board) {
            return {
                error: "Board not found"
            }
        }

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true }
        });

        list = await db.list.create({
            data: { title, boardId, order: lastList ? lastList.order + 1 : 1 }
        });
    }
    catch (error) {
        return { error: "Failed to create." };
    }
    revalidatePath("/board/" + boardId);
    return { data: list };
}

export const createList = createAction(ListValidator, handler);
