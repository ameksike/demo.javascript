"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { CardValidator } from "./schema";
import { db } from "@/lib/db";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }

    let { title, boardId, listId } = data;
    let card;

    try {
        const list = await db.list.findUnique({
            where: { id: listId, boardId, board: { orgId } },
            select: { order: true }
        });

        if (!list) {
            return { error: "List not found" };
        }

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true }
        });

        card = await db.card.create({
            data: { title, listId, order: lastCard ? lastCard.order + 1 : 1 }
        });
    }
    catch (error) {
        return { error: "Failed to create." };
    }
    revalidatePath("/board/" + boardId);
    return { data: card };
}

export const createCard = createAction(CardValidator, handler);
