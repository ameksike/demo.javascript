import { LayoutParam } from "@/model/LayoutParam";
import { OrgControl } from "../_components/control";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
    const { orgSlug } = auth();
    return {
        title: orgSlug || "organization"
    }
}

export default function ({ children }: LayoutParam) {
    return (
        <>
            <OrgControl />
            {children}
        </>
    );
}