import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/providers/modal";
import { QueryProvider } from "@/components/providers/query";

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            <QueryProvider>
                <ModalProvider />
                <Toaster />
                <div className="h-full">
                    <Navbar />
                    {children}
                </div>
            </QueryProvider>
        </ClerkProvider>
    );
}