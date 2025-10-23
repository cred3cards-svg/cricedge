
'use client';

import { useQuery } from '@tanstack/react-query';
import { adminListFixtures, adminListTeams } from '@/lib/adminApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { useMemo } from 'react';

export function AdminFixturesTable() {
    const { data: teamsData, isLoading: isLoadingTeams } = useQuery({
        queryKey: ['admin-teams'],
        queryFn: adminListTeams
    });

    const teamsMap = useMemo(() => {
        if (!teamsData) return new Map<string, string>();
        return new Map(teamsData.rows.map(team => [team.id, team.name]));
    }, [teamsData]);

    const { data, error, isLoading } = useQuery({
        queryKey: ['admin-fixtures'],
        queryFn: adminListFixtures,
        enabled: !isLoadingTeams, // Only fetch fixtures after teams are loaded
    });
    
    if (isLoading || isLoadingTeams) return <Loading message="Fetching fixtures..." />;
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
                        <TableCell>{format(new Date(fixture.startTimeUtc), 'Pp')}</TableCell>
                        <TableCell><Badge variant="outline">{fixture.status}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{fixture.id}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
