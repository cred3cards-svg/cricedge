
'use client';

import { useQuery } from '@tanstack/react-query';
import { listUsers } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';

export function AdminUsersTable() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: listUsers
    });

    if (isLoading) return <Loading message="Fetching users..." />;
    if (error) return <ErrorMessage error={error} />;
    if (!data || data.length === 0) return <p className="py-8 text-center text-muted-foreground">No users found.</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Handle</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                        <TableCell>{user.handle ?? 'N/A'}</TableCell>
                        <TableCell>{user.email ?? 'N/A'}</TableCell>
                        <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'Pp') : 'N/A'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
