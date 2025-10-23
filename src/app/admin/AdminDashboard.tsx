
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Market, Fixture, Team } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const FixtureRow = ({ fixture, teams }: { fixture: Fixture, teams: Team[] | null }) => {
    const homeTeam = useMemo(() => teams?.find(t => t.id === fixture.homeTeamId), [teams, fixture.homeTeamId]);
    const awayTeam = useMemo(() => teams?.find(t => t.id === fixture.awayTeamId), [teams, fixture.awayTeamId]);

    if (!homeTeam || !awayTeam) {
        return (
            <TableRow>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
            </TableRow>
        )
    }

    return (
         <TableRow key={fixture.id}>
            <TableCell>{homeTeam?.name} vs {awayTeam?.name}</TableCell>
            <TableCell>{fixture.competitionId}</TableCell>
            <TableCell>{format(new Date(fixture.startTimeUtc), 'Pp')}</TableCell>
            <TableCell><Badge variant="outline">{fixture.status}</Badge></TableCell>
        </TableRow>
    )
};

const MarketRow = ({ market, fixtures, teams }: { market: Market, fixtures: Fixture[] | null, teams: Team[] | null }) => {
    const fixture = useMemo(() => fixtures?.find(f => f.id === market.fixtureId), [fixtures, market.fixtureId]);
    const homeTeam = useMemo(() => fixture ? teams?.find(t => t.id === fixture.homeTeamId) : null, [teams, fixture]);
    const awayTeam = useMemo(() => fixture ? teams?.find(t => t.id === fixture.awayTeamId) : null, [teams, fixture]);

    if (!fixture || !homeTeam || !awayTeam) {
         return (
            <TableRow>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
            </TableRow>
        )
    }
    
    return (
         <TableRow key={market.id}>
            <TableCell className="font-medium">{homeTeam?.name} vs {awayTeam?.name}</TableCell>
            <TableCell><Badge variant={market.state === 'OPEN' ? 'default' : 'secondary'} className={market.state === 'OPEN' ? 'bg-green-100 text-green-800' : ''}>{market.state}</Badge></TableCell>
            <TableCell>{fixture ? format(new Date(fixture.startTimeUtc), 'Pp') : 'N/A'}</TableCell>
            <TableCell>{market.resolution ?? 'N/A'}</TableCell>
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Publish</DropdownMenuItem>
                        <DropdownMenuItem>Lock</DropdownMenuItem>
                        <DropdownMenuItem>Resolve</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Void</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
};


export default function AdminDashboard() {
    const firestore = useFirestore();
    const router = useRouter();
    
    // This state gates all data fetching until the admin is authenticated.
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Queries are initialized to `null` and will not run until `isAdmin` is true.
    const marketsQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'markets') : null), [firestore, isAdmin]);
    const { data: markets, isLoading: isLoadingMarkets } = useCollection<Market>(marketsQuery);
    
    const fixturesQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'fixtures') : null), [firestore, isAdmin]);
    const { data: fixtures, isLoading: isLoadingFixtures } = useCollection<Fixture>(fixturesQuery);

    const teamsQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'teams') : null), [firestore, isAdmin]);
    const { data: teams, isLoading: isLoadingTeams } = useCollection<Team>(teamsQuery);
    
    // Check for admin authentication on the client side.
    useEffect(() => {
        const adminSession = sessionStorage.getItem('admin-authenticated');
        if (adminSession !== 'true') {
            router.push('/admin/login');
        } else {
            setIsAdmin(true);
        }
        setIsLoading(false);
    }, [router]);

    // Show a loading spinner while checking for the session.
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    // Render nothing if not an admin (will be redirected shortly).
    if (!isAdmin) {
      return null; 
    }

    const isDataLoading = isLoadingMarkets || isLoadingFixtures || isLoadingTeams;

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage markets, fixtures, and application settings.</p>
                </header>

                <Tabs defaultValue="markets">
                    <TabsList>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="trades">All Trades</TabsTrigger>
                        <TabsTrigger value="markets">Markets</TabsTrigger>
                        <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                        <TabsTrigger value="audit">Audit Log</TabsTrigger>
                    </TabsList>
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>Displaying all users requires a secure backend function.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Admin user list must be loaded via a secure backend function.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="trades">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Trades</CardTitle>
                                <CardDescription>Displaying all user trades requires a secure backend function.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Admin trade list must be loaded via a secure backend function.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="markets">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Markets</CardTitle>
                                <CardDescription>View, publish, lock, and resolve markets from the database.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Market</TableHead>
                                            <TableHead>State</TableHead>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>Resolution</TableHead>
                                            <TableHead><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isDataLoading ? (
                                             Array.from({ length: 5 }).map((_, i) => (
                                                <MarketRow key={i} market={{} as Market} fixtures={null} teams={null} />
                                            ))
                                        ) : (
                                            markets?.map((market) => (
                                                <MarketRow key={market.id} market={market} fixtures={fixtures} teams={teams} />
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="fixtures">
                         <Card>
                            <CardHeader>
                                <CardTitle>Fixtures</CardTitle>
                                <CardDescription>Fixtures stored in the database.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Match</TableHead>
                                            <TableHead>Competition</TableHead>
                                            <TableHead>Start Time</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isDataLoading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <FixtureRow key={i} fixture={{} as Fixture} teams={null} />
                                            ))
                                        ) : (
                                            fixtures?.map(fixture => (
                                                <FixtureRow key={fixture.id} fixture={fixture} teams={teams} />
                                            ))
                                        )}
                                    </TableBody>
                               </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="audit">
                         <Card>
                            <CardHeader>
                                <CardTitle>Audit Log</CardTitle>
                                <CardDescription>This feature is not yet implemented.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    Audit logging requires a secure backend implementation.
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
