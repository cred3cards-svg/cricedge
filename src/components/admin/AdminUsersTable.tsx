
'use client';
import React from 'react';
import { adminListUsers } from '@/lib/adminApi';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function AdminUsersTable() {
  const [rows, setRows] = React.useState<any[] | null>(null);
  const [err, setErr] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let alive = true;
    adminListUsers()
      .then((r) => alive && setRows(r.rows))
      .catch((e) => alive && setErr(e));
    return () => { alive = false; };
  }, []);

  if (err) return <ErrorMessage error={err} />;
  if (!rows) return <Loading message="Fetching users..." />;
  if (!rows.length) return <p className="py-8 text-center text-muted-foreground">No users found.</p>;

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
        {rows.map(user => (
          <TableRow key={user.id}>
            <TableCell className="font-mono text-xs">{user.id}</TableCell>
            <TableCell>{user.handle || 'N/A'}</TableCell>
            <TableCell>{user.email || 'N/A'}</TableCell>
            <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'Pp') : 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
