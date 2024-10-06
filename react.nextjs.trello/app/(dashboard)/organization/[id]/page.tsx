import { list } from "@/services/board.action";
import { FormClient } from "../_components/form.client";

export default async function ({ params: { id } }: { params: { id: string } }) {
    const boards = await list();
    return (
        <div>
            <FormClient />
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