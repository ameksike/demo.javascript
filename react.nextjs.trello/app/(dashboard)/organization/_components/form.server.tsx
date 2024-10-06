"use server"

import { create } from "@/services/board.action";

export const FormServer = () => {

    return (
        <form action={create}>
            <input
                id="title"
                name="title"
                required
                placeholder="Enter a board title"
                className="border-black border p-1"
            />
        </form>
    );
}
