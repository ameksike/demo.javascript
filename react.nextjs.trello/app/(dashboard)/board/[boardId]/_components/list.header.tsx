"use client";

import { updateList } from "@/actions/list/update";
import { FormInput } from "@/components/from/input";
import { useAction } from "@/services/hook";
import { List } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListOptions } from "./list.options";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void;
}

export function ListHeader({ data, onAddCard }: ListHeaderProps) {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

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

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    }
    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const { excecute, fieldErrors } = useAction(updateList, {
        onSuccess(data) {
            toast.success(`List "${data.title}" updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError(error) {
            toast.error(error);
        },
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        const id = formData.get("id") as string;

        if (title === data.title) {
            return disableEditing();
        }

        excecute({ title, boardId, id });
    }

    return (
        <li className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ? (
                <form
                    ref={formRef}
                    action={onSubmit}
                    className="flex-1 px-[2px] "
                >
                    <input hidden id="id" name="id" value={data.id} />
                    <input hidden id="boardId" name="boardId" value={data.boardId} />
                    <FormInput
                        id="title"
                        onBlur={onBlur}
                        ref={inputRef}
                        placeholder="Enter list title"
                        defaultValue={title}
                        errors={fieldErrors as Record<string, string[] | undefined>}
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input transition truncate bg-transparent focus:bg-white"
                    />
                    <button type="submit" hidden />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                >
                    {title}
                </div>
            )}
            <ListOptions data={data} onAddCard={onAddCard} />
        </li>
    )
}