"use client";

import { createCard } from "@/actions/card/create";
import { FormSubmit } from "@/components/from/submit";
import { FormTextarea } from "@/components/from/textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/services/hook";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, forwardRef, KeyboardEventHandler, RefObject, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
    listId: string;
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId,
    isEditing,
    enableEditing,
    disableEditing
}, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);
    const { excecute, fieldErrors } = useAction(createCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" created!`);
            formRef.current?.reset();
        },
        onError(error) {
            toast.error(error);
        },
    });

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            disableEditing();
        }
    }
    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        if (event.key === "Escape" && !event.shiftKey) {
            event.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = params.boardId as string;
        excecute({ title, boardId, listId });
    }

    if (isEditing) {
        return (
            <form
                ref={formRef}
                action={onSubmit}
                className="m-1 py-0.5 px-1 space-y-4"
            >
                <FormTextarea
                    id="title"
                    ref={ref}
                    onKeyDown={onTextareaKeyDown}
                    placeholder="Enter a title for this card..."
                    errors={fieldErrors as Record<string, string[] | undefined>}
                />
                <input hidden id="listId" name="listId" value={listId} />
                <div className="flex items-center gap-x-1">
                    <FormSubmit >
                        Add card
                    </FormSubmit>
                    <Button onClick={disableEditing} size="sm" variant="ghost">
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </form>
        )
    }
    return (
        <li className="pt-2 px-2">
            <Button
                onClick={enableEditing}
                className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                size="sm"
                variant="ghost"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add a card
            </Button>

        </li>
    )
});
CardForm.displayName = "CardForm2";

// Another way to define the ref attribute for the component
export function CardForm2({ listId, isEditing, enableEditing, disableEditing }: {
    fef: RefObject<HTMLTextAreaElement>;
    listId: string;
    isEditing: boolean;
    enableEditing: () => void;
    disableEditing: () => void;
}) {
    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            ...
        </li>
    )
}