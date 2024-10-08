"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, OutputType } from "./types";
import { revalidatePath } from "next/cache";
import { createAction } from "@/lib/action";
import { ListValidator } from "./schema";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { title } from "process";

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
        const listToCopy = await db.list.findUnique({
            where: { id, boardId, board: { orgId } },
            include: { cards: true }
        });
        if (!listToCopy) {
            return { error: "List not found" };
        }
        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true }
        })
        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: lastList ? lastList.order + 1 : 1,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order
                        }))
                    }
                }
            },
            include: {
                cards: true
            }
        })
    }
    catch (error) {
        return { error: "Failed to copy." };
    }
    revalidatePath("/board/" + boardId);
    return { data: list };
}

export const copyList = createAction(ListValidator, handler);
