import React from 'react';
import FetchUser from '../services/UsrQuery';

const UsrListQuery: React.FC = () => {
    const srv = FetchUser();

    const handleDeleteUser = async (userId: number) => {
        try {
            console.log("userId", userId)
            await srv.delete(userId);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (srv.list?.isLoading) return <p>Loading...</p>;
    if (srv.list?.error) return <p>Error fetching data: {srv.list?.error?.message}</p>;

    return (
        <div>
            <h3>User List Query</h3>
            <ul>
                {srv.list?.data?.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsrListQuery;
