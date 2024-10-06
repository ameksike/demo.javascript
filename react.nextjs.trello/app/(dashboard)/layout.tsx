import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import { Toaster } from "sonner";

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            <Toaster />
            <div className="h-full">
                <Navbar />
                {children}
            </div>
        </ClerkProvider>
    );
}