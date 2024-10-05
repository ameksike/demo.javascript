import { OrganizationSwitcher } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server"

export default async function ({ params: { id } }: { params: { id: string } }) {

    const { userId, orgId } = auth();
    return (
        <div>
            <OrganizationSwitcher />
            Organizations: {id} - {orgId} - {userId}

        </div>
    )
};