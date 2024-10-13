"use client";

import { updateCard } from "@/actions/card/update";
import { FormSubmit } from "@/components/from/submit";
import { FormTextarea } from "@/components/from/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/model/types";
import { useAction } from "@/services/hook";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardDescriptionProps {
    data: CardWithList
}

export function CardDescription({ data }: CardDescriptionProps) {
    const params = useParams();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const { excecute, fieldErrors } = useAction(updateCard, {
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })
            toast.success(`Card "${data.title}" updated`);
            disableEditing();
        },
        onError(error) {
            toast.error(error);
        },
    })

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.select();
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

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;
        const boardId = params.boardId as string;
        excecute({ description, boardId, id: data.id });
    }

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {!isEditing
                    ? (
                        <div onClick={enableEditing} role="button" className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md">
                            {data.description || "Add a more detailed description..."}
                        </div>
                    )
                    : (
                        <form action={onSubmit} ref={formRef} className="space-y-2">
                            <FormTextarea
                                id="description"
                                ref={textareaRef}
                                errors={fieldErrors as Record<string, string[] | undefined>}
                                className="w-full mt-2"
                                placeholder="Add more details description..."
                                defaultValue={data.description || undefined}
                            />
                            <div className="flex items-center gap-x-2">
                                <FormSubmit className="" >
                                    Save
                                </FormSubmit>
                                <Button
                                    type="button"
                                    onClick={disableEditing}
                                    size="sm"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )
                }

            </div>
        </div>
    )
}

CardDescription.Skeleton = function () {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
                <Skeleton className="h-[78px] w-full bg-neutral-200" />
            </div>
        </div>
    )
}