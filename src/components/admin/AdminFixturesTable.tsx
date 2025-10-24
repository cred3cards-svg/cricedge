'use client';

import { useQuery } from '@tanstack/react-query';
import { adminListFixtures } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

export function AdminFixturesTable({ teamsMap }: { teamsMap: Map<string, string> }) {
    const { data, error, isLoading } = useQuery({
        queryKey: ['admin-fixtures'],
        queryFn: adminListFixtures,
    });
    
    if (isLoading) return <Loading message="Fetching fixtures..." />;
    if (error) return <ErrorMessage error={error} />;
    if (!data || data.length === 0) return <p className="py-8 text-center text-muted-foreground">No fixtures found.</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Match</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fixture ID</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((fixture) => (
                    <TableRow key={fixture.id}>
                        <TableCell className="font-medium">
                            {teamsMap.get(fixture.homeTeamId) || fixture.homeTeamId} vs {teamsMap.get(fixture.awayTeamId) || fixture.awayTeamId}
                        </TableCell>
                        <TableCell>{fixture.startTimeUtc ? format(new Date(fixture.startTimeUtc), 'Pp') : 'N/A'}</TableCell>
                        <TableCell><Badge variant="outline">{fixture.status}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{fixture.id}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
