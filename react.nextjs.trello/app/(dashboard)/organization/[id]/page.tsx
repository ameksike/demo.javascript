import { Button } from "@/components/ui/button";
import { create, list } from "@/services/board.action";

export default async function ({ params: { id } }: { params: { id: string } }) {
    const boards = await list();
    return (
        <div>
            <form action={create}>
                <input
                    id="title"
                    name="title"
                    required
                    placeholder="Enter a board title"
                    className="border-black border p-1"
                />
            </form>
            <Button type="submit"> Submit </Button>
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