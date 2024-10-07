"use client";

import { ListWithCards } from "@/model/types";
import { ListForm } from "./list.form";
import { useEffect, useState } from "react";
import { ListItem } from "./list.item";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
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
    useEffect(() => {
        setOrderedData(data);
    }, [data])



    return (
        <ol className="flex gap-x-3 h-full">
            {orderdData.map((list, index) => (
                <ListItem
                    key={list.id}
                    index={index}
                    data={list}
                />
            ))}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
        </ol>
    )
}