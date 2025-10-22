import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFixtures, getMarkets, getTeam } from "@/lib/data";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export default function AdminPage() {
    // In a real app, this page would be protected and only accessible to users with the 'admin' role.
    const markets = getMarkets();
    const fixtures = getFixtures();

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage markets, fixtures, and application settings.</p>
                </header>

                <Tabs defaultValue="markets">
                    <TabsList>
                        <TabsTrigger value="markets">Markets</TabsTrigger>
                        <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="audit">Audit Log</TabsTrigger>
                    </TabsList>
                    <TabsContent value="markets">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Markets</CardTitle>
                                <CardDescription>View, publish, lock, and resolve markets.</CardDescription>
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
                                        {markets.map(market => {
                                            const fixture = getFixtures().find(f => f.id === market.fixtureId);
                                            const homeTeam = fixture ? getTeam(fixture.homeTeamId) : null;
                                            const awayTeam = fixture ? getTeam(fixture.awayTeamId) : null;
                                            return (
                                            <TableRow key={market.id}>
                                                <TableCell className="font-medium">{homeTeam?.name} vs {awayTeam?.name}</TableCell>
                                                <TableCell><Badge variant={market.state === 'OPEN' ? 'default' : 'secondary'} className={market.state === 'OPEN' ? 'bg-green-100 text-green-800' : ''}>{market.state}</Badge></TableCell>
                                                <TableCell>{fixture ? format(fixture.startTimeUtc, 'Pp') : 'N/A'}</TableCell>
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
                                        })}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="fixtures">
                         <Card>
                            <CardHeader>
                                <CardTitle>Fixtures</CardTitle>
                                <CardDescription>Fixtures synced from Betfair.</CardDescription>
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
                                        {fixtures.map(fixture => {
                                            const homeTeam = getTeam(fixture.homeTeamId);
                                            const awayTeam = getTeam(fixture.awayTeamId);
                                            return(
                                            <TableRow key={fixture.id}>
                                                <TableCell>{homeTeam?.name} vs {awayTeam?.name}</TableCell>
                                                <TableCell>{fixture.competitionId}</TableCell>
                                                <TableCell>{format(fixture.startTimeUtc, 'Pp')}</TableCell>
                                                <TableCell><Badge variant="outline">{fixture.status}</Badge></TableCell>
                                            </TableRow>
                                            )
                                        })}
                                    </TableBody>
                               </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
