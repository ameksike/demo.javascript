"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { BoardValidator } from "./schema";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<OutputType> => {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        return {
            error: "Unauthorized"
        }
    }
    let { id } = data;
    let board;
    try {
        board = await db.board.delete({
            where: { id, orgId }
        });
    }
    catch (error) {
        return { error: "Failed to delete." };
    }
    revalidatePath("/organization/" + orgId);
    redirect("/organization/" + orgId);
}

export const deleteBoard = createAction(BoardValidator, handler);
