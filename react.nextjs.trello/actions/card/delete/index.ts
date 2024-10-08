"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { CardValidator } from "./schema";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }
    let { id, boardId } = data;
    let list;
    try {
        list = await db.list.delete({
            where: { id, boardId, board: { orgId } }
        });
    }
    catch (error) {
        return { error: "Failed to delete." };
    }
    revalidatePath("/board/" + boardId);
    return { data: list };
}

export const deleteCard = createAction(CardValidator, handler);
