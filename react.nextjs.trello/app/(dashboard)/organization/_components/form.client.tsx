"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSafe } from "@/services/board.action";
import { useFormState, useFormStatus } from "react-dom";

export const FormClient = () => {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createSafe, initialState);
    const { pending } = useFormStatus();

    return (
        <form action={dispatch}>
            <div className="flex flex-col space-y-2">
                <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Enter a board title"
                    className="p-1"
                    disabled={pending}
                />
                <Button type="submit" disabled={pending} className=""> Submit </Button>

                {/*state?.errors?.title ? (
                    <div>
                        {state.errors.title.map((error: string) => (
                            <p key={error} className="text-red-500"> {error} </p>
                        ))}
                    </div>
                ) : null*/}
            </div>
        </form>
    );
}
