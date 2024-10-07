"use client";

import { useAction } from "@/services/hook";
import { deleteBoard } from "@/actions/board/delete";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
    id: string;
}

export async function BoardOptions({ id }: BoardOptionsProps) {
    const { excecute, isLoading } = useAction(deleteBoard, {
        onSuccess() {
            toast.success(`Board deleted!`);
        },
        onError(error) {
            toast.error(error);
        },
    });

    const onDelete = () => {
        excecute({ id });
    }

    return (
        <Popover >
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="transparent">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 ">
                    Board actions
                </div>
                <PopoverClose >
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>

                <Button
                    className="rounded-none w-full h-auto p-2 px-5 justify-start text-sm"
                    variant="ghost"
                    onClick={onDelete}
                    disabled={isLoading}
                >
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    )
}