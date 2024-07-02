import React from "react";
import useFetch from "../services/UseFetch";
import { User } from "../models/User";

const UsrList: React.FC = () => {
    const { data, error, loading } = useFetch<User[]>('https://jsonplaceholder.typicode.com/users');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {data?.map(user => (
                <li key={user.id}>
                    {user.name} ({user.username}) - {user.email}
                </li>
            ))}
        </ul>
    );
};

export default UsrList;
