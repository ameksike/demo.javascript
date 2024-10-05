import { auth, currentUser } from "@clerk/nextjs/server"

export default async function () {

    const user = await currentUser();
    const { userId } = auth();

    return (
        <div className="flex flex-col">
            <span> <strong>User ID:</strong> {userId}</span>
            <span> <strong>Username:</strong> {user?.username}</span>
            <span> <strong>FullName:</strong> {user?.fullName}</span>
            <span> <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</span>
        </div>
    )
};