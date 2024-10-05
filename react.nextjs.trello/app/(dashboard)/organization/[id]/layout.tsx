import { LayoutParam } from "@/model/LayoutParam";
import { OrgControl } from "../_components/control";

export default function ({ children }: LayoutParam) {
    return (
        <>
            <OrgControl />
            {children}
        </>
    );
}