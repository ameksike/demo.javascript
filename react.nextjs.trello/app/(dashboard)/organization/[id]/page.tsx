
import { list } from "@/services/board.action";
import { FormBasic } from "../_components/form";
import { FormClient } from "../_components/form.client";
import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "../_components/board.list";

export default async function ({ params: { id } }: { params: { id: string } }) {
    // const boards = await list();
    return (
        <div className="w-full mb-20 ">
            <Info />
            <Separator className="my-4" />
            <div className="px-2 md:px-4">
                <BoardList />
            </div>
            {/*
            <FormBasic />
            <div className="space-y-2">
                {boards.map((board) => (
                    <div key={board.title}>
                        Borad name: {board.title}
                    </div>
                ))}
            </div> 
            */}
        </div>
    )
};