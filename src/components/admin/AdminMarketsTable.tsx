
'use client';

import { useQuery } from '@tanstack/react-query';
import { listMarkets } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Market } from '@/lib/types';

export function AdminMarketsTable({ teamsMap }: { teamsMap: Map<string, string> }) {
    const [stateFilter, setStateFilter] = useState<Market['state'] | 'ALL'>('ALL');
    
    const { data, error, isLoading } = useQuery({
        queryKey: ['admin-markets', stateFilter],
        queryFn: () => listMarkets({ state: stateFilter === 'ALL' ? undefined : stateFilter }),
    });

    const getFixtureTeams = (fixtureId: string) => {
        // This is a placeholder as we don't have fixture data directly.
        // A more robust solution would join this data on the backend.
        return fixtureId.substring(0, 20) + '...';
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <Select value={stateFilter} onValueChange={(value) => setStateFilter(value as any)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by state" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All States</SelectItem>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="LOCKED">Locked</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="VOID">Void</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading && <Loading message="Fetching markets..." />}
            {error && <ErrorMessage error={error} />}
            {data && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Market ID</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Fixture ID</TableHead>
                            <TableHead>Published At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No markets found.</TableCell></TableRow>}
                        {data.rows.map((market) => (
                            <TableRow key={market.id}>
                                <TableCell className="font-mono text-xs">{market.id}</TableCell>
                                <TableCell><Badge variant={market.state === 'OPEN' ? 'default' : 'secondary'}>{market.state}</Badge></TableCell>
                                <TableCell className="font-mono text-xs">{market.fixtureId}</TableCell>
                                <TableCell>{market.publishedAt ? format(new Date(market.publishedAt), 'Pp') : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
