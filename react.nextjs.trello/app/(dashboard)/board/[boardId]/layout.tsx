import { LayoutParam } from "@/model/LayoutParam";
import { select } from "@/services/board.action";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { BoardNavbar } from "./_components/board.navbar";

export async function generateMetadata({ params }: LayoutParam<{ boardId: string }>) {
    const { orgId } = auth();
    if (!orgId) {
        return {
            title: "Board"
        }
    }
    const board = await select({ id: params?.boardId, orgId });
    return {
        title: board?.title || "Board"
    }
}

export default async function ({ children, params }: LayoutParam<{ boardId: string }>) {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/auth/org")
    }

    const board = await select({ id: params?.boardId, orgId });

    if (!board) {
        notFound();
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar data={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    );
}