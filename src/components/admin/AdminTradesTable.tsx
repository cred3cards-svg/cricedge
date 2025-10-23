
'use client';

import { useQuery } from '@tanstack/react-query';
import { listTrades } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/badge';
import Link from 'next/link';

export function AdminTradesTable() {
    const { data, error, isLoading } = useQuery({
        queryKey: ['admin-trades'],
        queryFn: listTrades,
    });
    
    if (isLoading) return <Loading message="Fetching trades..." />;
    if (error) return <ErrorMessage error={error} />;
    if (!data || data.length === 0) return <p className="py-8 text-center text-muted-foreground">No trades found.</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Market ID</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Shares</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((trade) => (
                    <TableRow key={trade.id}>
                        <TableCell className="text-xs text-muted-foreground">{format(new Date(trade.createdAt), 'Pp')}</TableCell>
                        <TableCell className="font-mono text-xs">{trade.uid}</TableCell>
                        <TableCell className="font-mono text-xs">
                             <Link href={`/markets/${trade.marketId}`} className="hover:underline">
                                {trade.marketId}
                            </Link>
                        </TableCell>
                        <TableCell><Badge className={trade.side === 'YES' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>{trade.side}</Badge></TableCell>
                        <TableCell>{formatCurrency(trade.amount)}</TableCell>
                        <TableCell>{trade.shares.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
