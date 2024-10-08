"use client";

import { ListWithCards } from "@/model/types";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/from/submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/services/hook";
import { deleteList } from "@/actions/list/delete";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/list/copy";

interface ListOptionsProps {
    data: ListWithCards
    onAddCard: () => void
}

export function ListOptions({ data, onAddCard }: ListOptionsProps) {
    
    // delete list 
    const closeRef = useRef<ElementRef<"button">>(null);
    const { excecute: excecuteDelete } = useAction(deleteList, {
        onSuccess(data) {
            toast.success(`List "${data.title}" deleted!`);
            closeRef.current?.click();
        },
        onError(error) {
            toast.error(error);
        },
    });
    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        excecuteDelete({ boardId, id })
    }
    
    // copy list 
    const copyRef = useRef<ElementRef<"button">>(null);
    const { excecute: excecuteCopy } = useAction(copyList, {
        onSuccess(data) {
            toast.success(`List "${data.title}" copied!`);
            copyRef.current?.click();
        },
        onError(error) {
            toast.error(error);
        },
    });
    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;
        excecuteCopy({ boardId, id })
    }

    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List actions
                </div>
                <PopoverClose asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="w-4 h-4" />
                    </Button>
                </PopoverClose>
                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                >
                    Add card...
                </Button>
                <form action={onCopy}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input hidden name="boardId" id="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"

                    >
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                <form
                    action={onDelete}
                >
                    <input hidden name="id" id="id" value={data.id} />
                    <input hidden name="boardId" id="boardId" value={data.boardId} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"

                    >
                        Delete list...
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}