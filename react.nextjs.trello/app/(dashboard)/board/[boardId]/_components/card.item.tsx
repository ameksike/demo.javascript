"use client";

import { CardWithList } from "@/model/types";
import { useCardModal } from "@/services/card.modal";
import { Draggable } from "@hello-pangea/dnd";

interface CardItemProps {
    index: number;
    data: CardWithList
}

export function CardItem({ index, data }: CardItemProps) {
    const cardModal = useCardModal();

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    onClick={() => cardModal.onOpen(data.id)}
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
                >
                    {data.title}
                </div>
            )}

        </Draggable>
    )
}