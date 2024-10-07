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
    let { title, id, boardId } = data;
    let list;
    try {
        list = await db.list.update({
            where: { id, boardId, board: { orgId } },
            data: { title }
        });
    }
    catch (error) {
        return { error: "Failed to update." };
    }
    revalidatePath("/board/" + boardId);
    return { data: list };
}

export const updateList = createAction(ListValidator, handler);
