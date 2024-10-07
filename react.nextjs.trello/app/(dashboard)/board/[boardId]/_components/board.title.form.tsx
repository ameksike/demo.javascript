"use client";

import { useAction } from "@/actions/board/create/hook";
import { updateBoard } from "@/actions/board/update";
import { FormInput } from "@/components/from/input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFromProps {
    data: Board;
}

export function BoardTitleFrom({ data }: BoardTitleFromProps) {

    const { excecute, fieldErrors } = useAction(updateBoard, {
        onSuccess(data) {
            toast.success(`Board "${data.title}" updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError(error) {
            toast.error(error);
        },
    });


    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(data.title);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }
    const disableEditing = () => {
        setIsEditing(false);
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        excecute({ title, id: data.id });
    }
    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    if (isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput
                    ref={inputRef}
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"

                />
            </form>
        );
    }

    return (
        <Button
            onClick={enableEditing}
            className="font-bold text-lg h-auto w-auto p-1 px-2"
            variant="transparent"
        >
            {title}
        </Button>
    )
}