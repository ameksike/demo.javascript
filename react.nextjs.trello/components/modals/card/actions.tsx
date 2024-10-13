"use client";

import { copyCard } from "@/actions/card/copy";
import { deleteCard } from "@/actions/card/delete";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/model/types";
import { useCardModal } from "@/services/card.modal";
import { useAction } from "@/services/hook";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface CardActionProps {
    data: CardWithList
}

export function CardAction({ data }: CardActionProps) {
    const params = useParams();
    const cardModal = useCardModal();

    const { excecute: excecuteCopyCard, isLoading: isLoadingCopyCard } = useAction(copyCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" copied!`);
            cardModal.onClose();
        },
        onError(error) {
            toast.error(error);
        },
    });

    const { excecute: excecuteDeleteCard, isLoading: isLoadingDeleteCard } = useAction(deleteCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" deteled!`);
            cardModal.onClose();
        },
        onError(error) {
            toast.error(error);
        },
    });

    const onCopy = () => {
        const boardId = params.boardId as string;
        excecuteCopyCard({ id: data.id, boardId });
    }

    const onDelete = () => {
        const boardId = params.boardId as string;
        excecuteDeleteCard({ id: data.id, boardId });
    }

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            <Button
                onClick={onCopy}
                disabled={isLoadingCopyCard}
                className="w-full justify-start"
                variant="gray"
                size="inline"
            >
                <Copy className="h-4 w-4 mr-2" />
                Copy
            </Button>
            <Button
                onClick={onDelete}
                disabled={isLoadingDeleteCard}
                className="w-full justify-start"
                variant="gray"
                size="inline"
            >
                <Trash className="h-4 w-4 mr-2" />
                Delete
            </Button>

        </div>
    )
}

CardAction.Skeleton = function () {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    )
}