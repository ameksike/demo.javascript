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
    let { id, boardId, ...values } = data;
    let card;
    try {
        card = await db.card.update({
            where: { id, list: { board: { orgId } } },
            data: { ...values }
        });
    }
    catch (error) {
        return { error: "Failed to update." };
    }
    revalidatePath("/board/" + boardId);
    return { data: card };
}

export const updateCard = createAction(CardValidator, handler);
