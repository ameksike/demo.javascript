"use client";

import { createBoard } from "@/actions/board/create";
import { FormInput } from "@/components/from/input";
import { useAction } from "@/actions/board/create/hook";
import { FormSubmit } from "@/components/from/submit";

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
                    label="Board Title"
                    id="title"
                    errors={fieldErrors as Record<string, string[] | undefined>}
                />
                <FormSubmit >
                    Save
                </FormSubmit>
            </div>
        </form>
    );
}
