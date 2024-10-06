
import { list } from "@/services/board.action";
import { FormBasic } from "../_components/form";
import { FormClient } from "../_components/form.client";

export default async function ({ params: { id } }: { params: { id: string } }) {
    const boards = await list();
    return (
        <div>
            <FormBasic />
            <div className="space-y-2">
                {boards.map((board) => (
                    <div key={board.title}>
                        Borad name: {board.title}
                    </div>
                ))}
            </div>
        </div>
    )
};