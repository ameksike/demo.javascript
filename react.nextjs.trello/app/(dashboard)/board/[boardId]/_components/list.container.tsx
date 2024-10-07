"use client";
import { ListWithCards } from "@/model/types";
import { ListForm } from "./list.form";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

export function ListContainer({
    boardId,
    data
}: ListContainerProps) {
    
    return (
        <ol>
            <ListForm />
            <div className="flex-shrink-0 w-1" />
        </ol>
    )
}