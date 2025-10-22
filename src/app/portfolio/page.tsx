'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCompetition, getFixture, getMarket, getTeam, getUserPositions, getUserTrades } from "@/lib/data";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ArrowDown, ArrowUp, Coins, Gift, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { Position, Trade, Fixture } from "@/lib/types";


export default function PortfolioPage() {
    const [positions, setPositions] = useState<Position[]>([]);
    const [trades, setTrades] = useState<Trade[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        // In a real app, you'd fetch this from Firestore based on the logged-in user
        setPositions(getUserPositions('user-1'));
        setTrades(getUserTrades('user-1'));
    }, []);

    const handleFaucet = () => {
        toast({
            title: "Success!",
            description: `1,000 DC has been added to your wallet.`
        })
    }

    const PositionRow = ({ pos }: { pos: Position }) => {
        const [fixture, setFixture] = useState<Fixture | undefined>(undefined);
        
        useEffect(() => {
            const fetchFixture = async () => {
                const market = await getMarket(pos.marketId);
                if (market) {
                    const f = await getFixture(market.fixtureId);
                    setFixture(f);
                }
            }
            fetchFixture();
        }, [pos.marketId]);

        const homeTeam = fixture ? getTeam(fixture.homeTeamId) : null;
        const awayTeam = fixture ? getTeam(fixture.awayTeamId) : null;
        const isYes = pos.yesShares > 0;
        const pnlClass = pos.unrealizedPnl > 0 ? "text-green-600" : "text-red-600";

        if (!homeTeam || !awayTeam) return null;

        return (
            <TableRow>
                <TableCell>
                    <Link href={`/markets/${pos.marketId}`} className="font-medium hover:underline">
                        {homeTeam?.shortName} vs {awayTeam?.shortName}
                    </Link>
                </TableCell>
                <TableCell><Badge className={isYes ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>{isYes ? 'YES' : 'NO'}</Badge></TableCell>
                <TableCell>{isYes ? pos.yesShares : pos.noShares}</TableCell>
                <TableCell>{formatCurrency(isYes ? pos.avgPriceYes : pos.avgPriceNo, '')}</TableCell>
                <TableCell>{formatCurrency(0.65, '')}</TableCell>
                <TableCell className={`text-right font-medium ${pnlClass}`}>
                    {pos.unrealizedPnl > 0 ? '+' : ''}{formatCurrency(pos.unrealizedPnl)}
                </TableCell>
            </TableRow>
        )
    }

    const TradeRow = ({ trade }: { trade: Trade }) => {
        const [fixture, setFixture] = useState<Fixture | undefined>(undefined);
        
        useEffect(() => {
            const fetchFixture = async () => {
                const market = await getMarket(trade.marketId);
                if (market) {
                    const f = await getFixture(market.fixtureId);
                    setFixture(f);
                }
            }
            fetchFixture();
        }, [trade.marketId]);

        const homeTeam = fixture ? getTeam(fixture.homeTeamId) : null;
        const awayTeam = fixture ? getTeam(fixture.awayTeamId) : null;

        if (!homeTeam || !awayTeam) return null;
        
        return (
            <TableRow>
                <TableCell className="text-muted-foreground">{formatDistanceToNow(fromUnixTime(trade.createdAt/1000), { addSuffix: true})}</TableCell>
                <TableCell>
                    <Link href={`/markets/${trade.marketId}`} className="font-medium hover:underline">
                        {homeTeam?.shortName} vs {awayTeam?.shortName}
                    </Link>
                </TableCell>
                <TableCell><Badge className={trade.side === 'YES' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>{trade.side}</Badge></TableCell>
                <TableCell>{formatCurrency(trade.amount)}</TableCell>
                <TableCell>{trade.shares.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatCurrency(trade.avgPrice, '')}</TableCell>
            </TableRow>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">My Portfolio</h1>
                    <p className="text-muted-foreground">Manage your funds and track your prediction performance.</p>
                </header>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle>Wallet</CardTitle>
                            <CardDescription>Your demo credit balance.</CardDescription>
                        </div>
                        <Button onClick={handleFaucet}>
                            <Gift className="mr-2 h-4 w-4" /> Claim Daily Credits
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-lg border p-4">
                             <div className="rounded-full bg-primary/10 p-3 flex items-center justify-center">
                                <Coins className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Total Balance</div>
                                <div className="text-2xl font-bold">{formatCurrency(11350.50)}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 rounded-lg border p-4">
                             <div className="rounded-full bg-green-500/10 p-3 flex items-center justify-center">
                                <Coins className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Available</div>
                                <div className="text-2xl font-bold">{formatCurrency(9850.50)}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 rounded-lg border p-4">
                             <div className="rounded-full bg-amber-500/10 p-3 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Unrealized P&L</div>
                                <div className="text-2xl font-bold text-green-600">+{formatCurrency(340.25)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="positions">
                    <TabsList>
                        <TabsTrigger value="positions">Open Positions</TabsTrigger>
                        <TabsTrigger value="history">Trade History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="positions">
                        <Card>
                            <CardContent className="pt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Market</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Shares</TableHead>
                                            <TableHead>Avg. Price</TableHead>
                                            <TableHead>Current Price</TableHead>
                                            <TableHead className="text-right">Unrealized P&L</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {positions.length > 0 ? (
                                            positions.filter(p => p.unrealizedPnl !== 0).map(pos => <PositionRow key={pos.marketId} pos={pos} />)
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground">No open positions.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="history">
                         <Card>
                            <CardContent className="pt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Market</TableHead>
                                            <TableHead>Side</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Shares</TableHead>
                                            <TableHead className="text-right">Avg. Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {trades.length > 0 ? (
                                            trades.map(trade => <TradeRow key={trade.tradeId} trade={trade} />)
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground">No trade history.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
