"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebarMobile } from "@/services/sidebar.mobile"
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

export function NavbarMobile() {
    const { isOpen, onClose, onOpen } = useSidebarMobile(state => state);
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Whenever the URL changes, the mobile sidebar will automatically close
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);


    // Avoiding hydration errors: See the article "The Perils of Hydration" in the references section
    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2"
                variant="ghost"
                size="sm"
            >
                <Menu className="h-4 w-4" />
                <Sheet open={isOpen} onOpenChange={onClose}>
                    <SheetContent 
                        side="left"
                        className="p-2 pt-10"
                    >
                        <Sidebar
                            storageKey="t-sidebar-mobile-state"
                        />
                    </SheetContent>
                </Sheet>
            </Button>
        </>
    )
}