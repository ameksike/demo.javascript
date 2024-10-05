import { LayoutParam } from "@/model/LayoutParam";
import { ClerkProvider } from "@clerk/nextjs"

export default function ({ children }: LayoutParam) {
    return (
        <ClerkProvider>
            {children}
        </ClerkProvider>
    );
}