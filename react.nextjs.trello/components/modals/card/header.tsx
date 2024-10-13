"use client";

import { updateCard } from "@/actions/card/update";
import { FormInput } from "@/components/from/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/model/types";
import { useAction } from "@/services/hook";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface CardHeaderProps {
    data: CardWithList
}

export function CardHeader({ data }: CardHeaderProps) {
    const inputRef = useRef<ElementRef<"input">>(null);
    const params = useParams();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(data?.title);
    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();
    }
    const { excecute } = useAction(updateCard, {
        onSuccess(data) {
            toast.success(`Renamed to "${data.title}"`);
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            });
            setTitle(data.title);
        },
        onError(error) {
            toast.error(error);
        },
    })
    const onSubmint = (formData: FormData) => {
        const title = formData.get("title") as string;
        if (title === data.title) {
            return;
        }
        excecute({ title, boardId: params.boardId as string, id: data.id });
    }
    return (
        <div className="flex items-start gap-x-3 mb-6 w-full">
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div>
                <form action={onSubmint}>
                    <FormInput
                        id="title"
                        defaultValue={title}
                        className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                        ref={inputRef}
                        onBlur={onBlur}
                    />
                </form>

                <p className="text-sm text-muted-foreground">
                    in list <span className="underline">{data.list?.title}</span>
                </p>
            </div>
        </div>
    );
}

CardHeader.Skeleton = function () {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200 " />
            <div>
                <Skeleton className="h-6 w-24 mt-1 bg-neutral-200 " />
                <Skeleton className="h-4 w-12  bg-neutral-200 " />
            </div>
        </div>
    )
}