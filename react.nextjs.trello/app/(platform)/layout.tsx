import { ModalProvider } from "@/components/providers/modal";
import { QueryProvider } from "@/components/providers/query";
import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    );
}