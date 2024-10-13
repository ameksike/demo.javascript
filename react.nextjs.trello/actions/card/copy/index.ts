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
    let { id, boardId } = data;
    let card;
    try {
        const cardToCopy = await db.card.findUnique({
            where: { id, list: { board: { orgId } } }
        });
        if (!cardToCopy) {
            return { error: "Card not found" };
        }
        const lastCard = await db.card.findFirst({
            where: { listId: cardToCopy.listId },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        card = await db.card.create({
            data: {
                listId: cardToCopy.listId,
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: lastCard ? lastCard.order + 1 : 1
            }
        })
    }
    catch (error) {
        return { error: "Failed to copy." };
    }
    revalidatePath("/board/" + boardId);
    return { data: card };
}

export const copyCard = createAction(CardValidator, handler);
