import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>
    );
}