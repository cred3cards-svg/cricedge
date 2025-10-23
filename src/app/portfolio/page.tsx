
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFixture, getMarket, getTeam } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Coins, Gift, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { Position, Trade, Fixture, Team, Wallet } from "@/lib/types";
import { useCollection, useDoc, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

function PositionRow({ pos }: { pos: Position }) {
    const [fixture, setFixture] = useState<Fixture | undefined>(undefined);
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);

    useEffect(() => {
        const fetchFixture = async () => {
            const market = await getMarket(pos.marketId);
            if (market) {
                const f = await getFixture(market.fixtureId);
                setFixture(f);
                if (f) {
                    const ht = await getTeam(f.homeTeamId);
                    const at = await getTeam(f.awayTeamId);
                    setHomeTeam(ht);
                    setAwayTeam(at);
                }
            }
        }
        fetchFixture();
    }, [pos.marketId]);

    if (!homeTeam || !awayTeam) {
        return (
             <TableRow>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
        );
    }

    const isYes = pos.yesShares > 0;
    const pnlClass = pos.unrealizedPnl >= 0 ? "text-green-600" : "text-red-600";

    return (
        <TableRow>
            <TableCell>
                <Link href={`/markets/${pos.marketId}`} className="font-medium hover:underline">
                    {homeTeam.shortName} vs {awayTeam.shortName}
                </Link>
            </TableCell>
            <TableCell><Badge className={isYes ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>{isYes ? 'YES' : 'NO'}</Badge></TableCell>
            <TableCell>{(isYes ? pos.yesShares : pos.noShares).toFixed(2)}</TableCell>
            <TableCell>{formatCurrency(isYes ? pos.avgPriceYes : pos.avgPriceNo, '')}</TableCell>
            <TableCell>{formatCurrency(0.65, '')}</TableCell>
            <TableCell className={`text-right font-medium ${pnlClass}`}>
                {pos.unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(pos.unrealizedPnl)}
            </TableCell>
        </TableRow>
    )
}

function TradeRow({ trade }: { trade: Trade }) {
    const [fixture, setFixture] = useState<Fixture | undefined>(undefined);
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);

    useEffect(() => {
        const fetchFixture = async () => {
            const market = await getMarket(trade.marketId);
            if (market) {
                const f = await getFixture(market.fixtureId);
                setFixture(f);
                if (f) {
                    const ht = await getTeam(f.homeTeamId);
                    const at = await getTeam(f.awayTeamId);
                    setHomeTeam(ht);
                    setAwayTeam(at);
                }
            }
        }
        fetchFixture();
    }, [trade.marketId]);

     if (!homeTeam || !awayTeam) {
        return (
             <TableRow>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-4 w-20" /></TableCell>
            </TableRow>
        );
    }
    
    return (
        <TableRow>
            <TableCell className="text-muted-foreground text-xs">{trade.createdAt ? formatDistanceToNow(new Date(trade.createdAt), { addSuffix: true}) : 'N/A'}</TableCell>
            <TableCell>
                <Link href={`/markets/${trade.marketId}`} className="font-medium hover:underline">
                    {homeTeam.shortName} vs {awayTeam.shortName}
                </Link>
            </TableCell>
            <TableCell><Badge className={trade.side === 'YES' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>{trade.side}</Badge></TableCell>
            <TableCell>{formatCurrency(trade.amount)}</TableCell>
            <TableCell>{trade.shares.toFixed(2)}</TableCell>
            <TableCell className="text-right">{formatCurrency(trade.avgPrice, '')}</TableCell>
        </TableRow>
    )
}


export default function PortfolioPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const walletRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return doc(firestore, `wallets/${user.uid}`);
    }, [firestore, user]);
    const { data: wallet, isLoading: isLoadingWallet } = useDoc<Wallet>(walletRef);

    const positionsRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/positions`);
    }, [firestore, user]);
    const { data: positions, isLoading: isLoadingPositions } = useCollection<Position>(positionsRef);

    const tradesRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/trades`);
    }, [firestore, user]);
    const { data: trades, isLoading: isLoadingTrades } = useCollection<Trade>(tradesRef);
    
    const handleFaucet = () => {
        toast({
            title: "Success!",
            description: `1,000 DC has been added to your wallet.`
        })
    }

    const isLoading = isUserLoading || isLoadingWallet || isLoadingPositions || isLoadingTrades;

     if (isLoading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user) {
         return (
            <div className="container mx-auto py-8 text-center">
                <p className="text-muted-foreground">Please <Link href="/login" className="underline font-semibold text-primary">log in</Link> to view your portfolio.</p>
            </div>
        )
    }

    const unrealizedPnl = positions?.reduce((acc, pos) => acc + pos.unrealizedPnl, 0) ?? 0;
    const pnlClass = unrealizedPnl >= 0 ? "text-green-600" : "text-red-600";
    const availableBalance = wallet ? wallet.balanceDemo - wallet.lockedDemo : 0;

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
                                <div className="text-2xl font-bold">{formatCurrency(wallet?.balanceDemo ?? 0)}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 rounded-lg border p-4">
                             <div className="rounded-full bg-green-500/10 p-3 flex items-center justify-center">
                                <Coins className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Available</div>
                                <div className="text-2xl font-bold">{formatCurrency(availableBalance)}</div>
                            </div>
                        </div>
                         <div className="flex items-center gap-4 rounded-lg border p-4">
                             <div className="rounded-full bg-amber-500/10 p-3 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Unrealized P&L</div>
                                <div className={`text-2xl font-bold ${pnlClass}`}>
                                    {unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(unrealizedPnl)}
                                </div>
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
                                        {positions && positions.length > 0 ? (
                                            positions.filter(p => p.yesShares > 0 || p.noShares > 0).map(pos => <PositionRow key={pos.id} pos={pos} />)
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No open positions.</TableCell>
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
                                        {trades && trades.length > 0 ? (
                                            trades.map(trade => <TradeRow key={trade.id} trade={trade} />)
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No trade history.</TableCell>
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

    