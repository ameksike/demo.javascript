import { Board } from "@prisma/client";
import { BoardTitleFrom } from "./board.title.form";

interface BoardNavbarProps {
    data: Board;
}

export async function BoardNavbar({ data }: BoardNavbarProps) {

    return (
        <div
            className="w-full h-14 z-[40] bg-black/15 fixed top-14 flex items-center px-6 gap-x-4 text-white"
        >
            <BoardTitleFrom data={data} />
        </div>
    )
}