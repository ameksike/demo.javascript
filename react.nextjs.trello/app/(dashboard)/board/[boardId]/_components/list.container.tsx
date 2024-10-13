"use client";

import { ListWithCards } from "@/model/types";
import { ListForm } from "./list.form";
import { useEffect, useState } from "react";
import { ListItem } from "./list.item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import { useAction } from "@/services/hook";
import { orderList } from "@/actions/list/order";
import { toast } from "sonner";
import { orderCard } from "@/actions/card/order";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export function ListContainer({
    boardId,
    data
}: ListContainerProps) {
    /**
     * Optimistic UI is a pattern that you can use to simulate the results of a mutation 
     * and update the UI even before receiving a response from the server. 
     * Once the response is received from the server, the optimistic result is thrown away 
     * and replaced with the actual result.
     */
    const [orderdData, setOrderedData] = useState(data);
    const { excecute: excecuteListOrder } = useAction(orderList, {
        onSuccess(data) {
            toast.success("List reordered!")
        },
        onError(error) {
            toast.error(error);
        },
    });
    const { excecute: excecuteCardOrder } = useAction(orderCard, {
        onSuccess(data) {
            toast.success("Card reordered!")
        },
        onError(error) {
            toast.error(error);
        },
    });


    useEffect(() => {
        setOrderedData(data);
    }, [data])

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        // if there is no destination
        if (!destination) {
            return;
        }

        // if dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // User moves a list
        if (type === "list") {
            const items = reorder(
                orderdData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order: index }));

            setOrderedData(items);
            // Trigger Server Action
            excecuteListOrder({ items, boardId });
        }

        // User moves a card
        if (type === "card") {
            let newOrderData = [...orderdData];

            // Source and Destination list 
            const sourceList = newOrderData.find(list => list.id === source.droppableId);
            const destList = newOrderData.find(list => list.id === destination.droppableId);

            // if there is no source list or destination list
            if (!sourceList || !destList) {
                return;
            }

            // Check if cards exist on the source list
            if (!sourceList?.cards) {
                sourceList.cards = [];
            }
            // Check if cards exist on the destination list
            if (!destList?.cards) {
                destList.cards = [];
            }

            // Moving the card in the same list 
            if (source.droppableId === destination.droppableId) {
                const reorderdCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                ).map((item, index) => ({ ...item, order: index }));
                reorderdCards.forEach((card, idx) => {
                    card.order = idx;
                });
                sourceList.cards = reorderdCards;
                setOrderedData(newOrderData);
                // Trigger Server Action
                excecuteCardOrder({ boardId, items: reorderdCards });
            } else {
                // Moving the card to a different list 
                // Remove cards from the source list 
                const [moveCard] = sourceList.cards.splice(source.index, 1);
                // Assign the new listId to the moved card
                moveCard.listId = destination.droppableId;
                // Add the card to the destination list
                destList.cards.splice(destination.index, 0, moveCard);
                // Update the order for each card in the source list 
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });
                // Update the order for each card in the destination list 
                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });
                setOrderedData(newOrderData);
                // Trigger Server Action
                excecuteCardOrder({ boardId, items: destList.cards });
            }
        }
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provider) => (
                    <ol
                        {...provider.droppableProps}
                        ref={provider.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderdData.map((list, index) => (
                            <ListItem
                                key={list.id}
                                index={index}
                                data={list}
                            />
                        ))}
                        {provider.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}