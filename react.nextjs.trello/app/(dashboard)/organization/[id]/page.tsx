import { auth } from "@clerk/nextjs/server"

export default async function ({ params: { id } }: { params: { id: string } }) {

    const { userId, orgId } = auth();
    return (
        <div>

            Organizations: {id} - {orgId} - {userId}

        </div>
    )
};