"use client";

import { ListWithCards } from "@/model/types";
import { ListHeader } from "./list.header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card.form";

interface ListItemProps {
    index: number
    data: ListWithCards
}

export function ListItem({ data, index }: ListItemProps) {
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);
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

    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader
                    data={data}
                    onAddCard={enableEditing}
                />
                <CardForm
                    ref={textareaRef}
                    listId={data.id}
                    isEditing={isEditing}
                    enableEditing={enableEditing}
                    disableEditing={disableEditing}
                />
            </div>
        </li>
    )
}