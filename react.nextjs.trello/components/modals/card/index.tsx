"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/model/types";
import { useCardModal } from "@/services/card.modal";
import { useQuery } from "@tanstack/react-query";
import { CardHeader } from "./header";

export function CardModal() {
    const id = useCardModal(state => state.id);
    const isOpen = useCardModal(state => state.isOpen);
    const onClose = useCardModal(state => state.onClose);
    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    });

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                {!cardData
                    ? <CardHeader.Skeleton />
                    : <CardHeader data={cardData!} />
                }
            </DialogContent>
        </Dialog>
    )
}