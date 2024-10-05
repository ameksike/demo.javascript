"use client"

import { useAuth, UserButton, useUser } from "@clerk/nextjs"

export default function () {
    const { userId } = useAuth();
    const { user } = useUser()

    return (
        <div className="flex flex-col">
            <UserButton />

            <span> <strong>User ID:</strong> {userId}</span>
            <span> <strong>Username:</strong> {user?.username}</span>
            <span> <strong>FullName:</strong> {user?.fullName}</span>
            <span> <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</span>
        </div>
    )
};