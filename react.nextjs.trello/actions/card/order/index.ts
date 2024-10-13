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

    let { items, boardId } = data;
    let cards;

    try {
        const transaction = items.map(card => db.card.update({
            where: { id: card.id, list: { board: { orgId } } },
            data: { order: card.order, listId: card.listId }
        }))
        cards = await db.$transaction(transaction);
    }
    catch (error) {
        return { error: "Failed to reorder." };
    }
    revalidatePath("/board/" + boardId);
    return { data: cards };
}

export const orderCard = createAction(CardValidator, handler);
