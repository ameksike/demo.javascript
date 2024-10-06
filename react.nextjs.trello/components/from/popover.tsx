"use client";

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

import { createBoard } from "@/actions/board/create";
import { useAction } from "@/actions/board/create/hook";
import { FormInput } from "./input";
import { FormSubmit } from "./submit";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface FormPopOverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export function FormPopOver({
    children,
    align,
    side = "bottom",
    sideOffset = 0
}: FormPopOverProps) {
    const { excecute, fieldErrors } = useAction(createBoard, {
        onSuccess(data) {
            console.log(data)
        },
        onError(error) {
            console.log(error)
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        excecute({ title });
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                sideOffset={sideOffset}
                side={side}
                className="w-80 pt-3"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>
                <PopoverClose asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors as Record<string, string[] | undefined>}
                        />
                    </div>
                    <FormSubmit classname="w-full">  Create  </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
}