import { LayoutParam } from "@/model/LayoutParam";
import { list as getList } from "@/services/list.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "./_components/list.container";

export default async function ({ params }: LayoutParam<{ boardId: string }>) {
    const { orgId } = auth();

    if (!orgId) {
        return redirect("/auth/org");
    }

    const lists = await getList({
        where: {
            boardId: params?.boardId,
            board: { orgId }
        },
        include: {
            cards: {
                orderBy: { order: "asc" }
            }
        },
        order: { order: "asc" }
    });

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={params?.boardId!}
                data={lists}
            />
        </div>
    );
}