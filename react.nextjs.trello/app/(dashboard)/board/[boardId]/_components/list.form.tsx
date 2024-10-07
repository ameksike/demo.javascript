"use client";

import { Plus, X } from "lucide-react";
import { ListWrapper } from "./list.wrapper";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/from/input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/from/submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/services/hook";
import { createList } from "@/actions/list/create";
import { toast } from "sonner";


export function ListForm() {
    const router = useRouter();
    const params = useParams();
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

    const { excecute, fieldErrors } = useAction(createList, {
        onSuccess(data) {
            toast.success(`List "${data.title}" created`);
            router.refresh();
        },
        onError(error) {
            toast.error(error);
        },
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        excecute({ title, boardId });
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    }

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        id="title"
                        ref={inputRef}
                        errors={fieldErrors as Record<string, string[] | undefined>}
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input transition"
                        placeholder="Enter list title..."
                    />
                    <input hidden value={params.boardId} name="boardId" />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add list
                        </FormSubmit>
                        <Button className="" onClick={disableEditing} size="sm" variant="ghost">
                            <X className="w-5 h-5" />
                        </Button>

                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper >
            <button
                onClick={enableEditing}
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
                <Plus className="h-4 w-4 mr-2 " />
                Add a list
            </button>
        </ListWrapper>
    )
}