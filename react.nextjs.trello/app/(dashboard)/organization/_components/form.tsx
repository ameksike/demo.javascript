"use client";

import { createBoard } from "@/app/actions/board/create";
import { FormInput } from "@/components/from/input";
import { useAction } from "@/app/actions/board/create/hook";

export const FormBasic = () => {
    
    const { excecute, fieldErrors } = useAction(createBoard, {
        onSuccess(data) {
            console.log("onSuccess", data)
        },
        onError(error) {
            console.log("onError", error)
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        excecute({ title });
    }

    return (
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput 
                    id="title"
                    errors={fieldErrors as Record<string, string[] | undefined>}
                />
            </div>
        </form>
    );
}
