/**
 * https://tanstack.com/query/latest/docs/framework/react/overview
 * https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
 * https://tanstack.com/query/latest/docs/framework/react/guides/mutations
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { User } from '../models/User';

const srv = {
    list: async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    create: async (data: User) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    update: async (data: User,) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${data.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    },
    delete: async (userId: number) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }
}

const useFetchUsers = () => {

    const queryClient = useQueryClient()

    const list = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: () => srv.list(),
        initialData: []
    });

    const create = useMutation({
        mutationFn: (data: User) => srv.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            //list.refetch()
        }
    });

    const update = useMutation({
        mutationFn: (data: User) => srv.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            //list.refetch()
        }
    });

    const deletes = useMutation({
        mutationFn: (id: number) => srv.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            //list.refetch()
        }
    })

    return {
        queryClient,
        list,
        create: (data: User) => create.mutate(data),
        update: (data: User) => update.mutate(data),
        delete: (id: number) => deletes.mutate(id),
    }
}

export default useFetchUsers;