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
import { toast } from "sonner";
import { FormPicker } from "./picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);

    const { excecute, fieldErrors } = useAction(createBoard, {
        onSuccess(data) {
            toast.success("Board created!");
            closeRef.current?.click();
            router.push("/board/" + data.id);
        },
        onError(error) {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;
        excecute({ title, image });
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
                <PopoverClose ref={closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form className="space-y-4" action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors as Record<string, string[] | undefined>}
                        />
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