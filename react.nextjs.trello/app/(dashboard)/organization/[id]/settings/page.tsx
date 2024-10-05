import { OrganizationProfile } from "@clerk/nextjs";

export default async function () {

    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "nono",
                            width: "100%"
                        },
                        card: {
                            border: "1px solid #e5e5e5",
                            boxShadow: "none",
                            width: "100%"
                        }
                    }
                }}
            />
        </div>
    )
};