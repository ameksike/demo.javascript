"use client";

import { useEffect, useState } from "react";
import { CardModal } from "../modals/card";

export function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    if (!isMounted) {
        return null;
    }
    return (
        <>
            <CardModal />
        </>
    )
}