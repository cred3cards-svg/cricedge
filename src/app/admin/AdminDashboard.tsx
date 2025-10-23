
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
import { useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { User, Trade, Market, Fixture, Team } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // --- Hardcode a demo user ID to fetch specific data ---
    const demoUserId = 'cricket_fan_123';

    // Fetch a single user's document.
    const userQuery = useMemoFirebase(() => (firestore && isAdmin ? doc(firestore, 'users', demoUserId) : null), [firestore, isAdmin]);
    const { data: singleUser, isLoading: isLoadingUsers } = useDoc<User>(userQuery);

    // Fetch trades for that single user.
    const tradesQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, `users/${demoUserId}/trades`) : null), [firestore, isAdmin]);
    const { data: userTrades, isLoading: isLoadingTrades } = useCollection<Trade>(tradesQuery);
    
    const marketsQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'markets') : null), [firestore, isAdmin]);
    const { data: markets, isLoading: isLoadingMarkets } = useCollection<Market>(marketsQuery);
    
    const fixturesQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'fixtures') : null), [firestore, isAdmin]);
    const { data: fixtures, isLoading: isLoadingFixtures } = useCollection<Fixture>(fixturesQuery);

    const teamsQuery = useMemoFirebase(() => (firestore && isAdmin ? collection(firestore, 'teams') : null), [firestore, isAdmin]);
    const { data: teams, isLoading: isLoadingTeams } = useCollection<Team>(teamsQuery);
    
    useEffect(() => {
        const checkAdminAuth = () => {
            const adminSession = sessionStorage.getItem('admin-authenticated');
            if (adminSession !== 'true') {
                router.push('/admin/login');
                return;
            }
            
            setIsAdmin(true);
            setIsLoading(false); 
        };

        checkAdminAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!isAdmin) {
      return null; 
    }

    const isDataLoading = isLoadingUsers || isLoadingMarkets || isLoadingFixtures || isLoadingTeams || isLoadingTrades;

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
                                <CardDescription>Displaying a single demo user. A secure backend function is required to list all users.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Handle</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>User ID</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingUsers ? (
                                            <TableRow>
                                                <TableCell colSpan={4}><Skeleton className="h-4 w-full" /></TableCell>
                                            </TableRow>
                                        ) : singleUser ? (
                                            <TableRow>
                                                <TableCell>{singleUser.email}</TableCell>
                                                <TableCell>{singleUser.handle}</TableCell>
                                                <TableCell><Badge variant="outline">{singleUser.role}</Badge></TableCell>
                                                <TableCell>{singleUser.id}</TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                    Could not load demo user.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="trades">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Trades</CardTitle>
                                <CardDescription>Displaying trades for a single demo user. A secure backend function is required to list all trades.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Market ID</TableHead>
                                            <TableHead>User ID</TableHead>
                                            <TableHead>Side</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="text-right">Shares</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingTrades ? (
                                             Array.from({ length: 3 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : userTrades && userTrades.length > 0 ? (
                                            userTrades.map(trade => (
                                                <TableRow key={trade.id}>
                                                    <TableCell>{formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true })}</TableCell>
                                                    <TableCell className="font-mono text-xs">{trade.marketId}</TableCell>
                                                    <TableCell className="font-mono text-xs">{trade.uid}</TableCell>
                                                    <TableCell><Badge variant="outline">{trade.side}</Badge></TableCell>
                                                    <TableCell>{formatCurrency(trade.amount, '')}</TableCell>
                                                    <TableCell className="text-right">{trade.shares.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                                    No trades found for demo user.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
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
                                        {isLoadingMarkets || isLoadingFixtures || isLoadingTeams ? (
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
                                        {isLoadingFixtures || isLoadingTeams ? (
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
