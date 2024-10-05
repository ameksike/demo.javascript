import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            <div className="h-full">
                <Navbar />
                {children}
            </div>
        </ClerkProvider>
    );
}