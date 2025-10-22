import { getMarket, getFixture, getTeam, getPool, getCompetition } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, add } from "date-fns";
import { Clock, Info, Lock, ShieldCheck, Users } from "lucide-react";
import PriceChart from "@/components/market/PriceChart";
import TradeWidget from "@/components/market/TradeWidget";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatPercentage } from "@/lib/utils";

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const market = getMarket(params.id);
  if (!market) notFound();

  const fixture = getFixture(market.fixtureId);
  const pool = getPool(market.id);
  const homeTeam = fixture ? getTeam(fixture.homeTeamId) : null;
  const awayTeam = fixture ? getTeam(fixture.awayTeamId) : null;
  const competition = fixture ? getCompetition(fixture.competitionId) : null;
  
  if (!fixture || !homeTeam || !awayTeam || !competition || !pool) notFound();
  
  const homeTeamLogo = getPlaceholderImage(homeTeam.logoId);
  const awayTeamLogo = getPlaceholderImage(awayTeam.logoId);

  const getStatusInfo = () => {
    switch(market.state) {
      case 'OPEN':
        return { 
          icon: <Clock className="h-4 w-4 text-green-500" />,
          text: `Market is open. Closes at ${format(fixture.startTimeUtc, "MMM d, h:mm a")}.`,
          badge: <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">OPEN</Badge>
        };
      case 'LOCKED':
        return { 
          icon: <Lock className="h-4 w-4 text-muted-foreground" />,
          text: 'Trading is locked. Match is live or has started.',
          badge: <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">LOCKED</Badge>
        };
      case 'RESOLVED':
        return { 
          icon: <ShieldCheck className="h-4 w-4 text-blue-500" />,
          text: `Market resolved. Outcome: ${market.resolution}.`,
          badge: <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">RESOLVED</Badge>
        };
      default:
        return {
          icon: <Info className="h-4 w-4 text-muted-foreground" />,
          text: 'Market is in a draft state.',
          badge: <Badge variant="outline">DRAFT</Badge>
        };
    }
  }

  const status = getStatusInfo();
  
  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">{competition.name}</div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-headline flex items-center gap-3">
              {homeTeamLogo && <Image src={homeTeamLogo.imageUrl} data-ai-hint={homeTeamLogo.imageHint} alt={homeTeam.name} width={32} height={32} className="rounded-full" />}
              <span>{homeTeam.name}</span>
              <span className="text-muted-foreground">vs</span>
              <span>{awayTeam.name}</span>
              {awayTeamLogo && <Image src={awayTeamLogo.imageUrl} data-ai-hint={awayTeamLogo.imageHint} alt={awayTeam.name} width={32} height={32} className="rounded-full" />}
            </h1>
            {status.badge}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {status.icon}
              <p>{status.text}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>Implied probability for {homeTeam.name} to win.</CardDescription>
              </CardHeader>
              <CardContent>
                <PriceChart />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <TradeWidget market={market} pool={pool} homeTeam={homeTeam} awayTeam={awayTeam} />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Market Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Market Type</span>
                  <span className="font-semibold">{market.type.replace('_', ' ')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Trading Fee</span>
                  <span className="font-semibold">{market.feeBps / 100}%</span>
                </div>
                <div className="col-span-full">
                  <span className="text-muted-foreground">Resolution Rules</span>
                  <p className="font-semibold">
                    This market resolves to 'YES' if {homeTeam.name} wins the match according to official sources. If {awayTeam.name} wins, it resolves to 'NO'. If the match is a draw, tie, or abandoned, the market may be voided.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Avg. Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Mock Data */}
                  <TableRow>
                    <TableCell>{format(new Date(), "h:mm:ss a")}</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800">YES</Badge></TableCell>
                    <TableCell>100</TableCell>
                    <TableCell>{formatCurrency(0.65, '')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(65)}</TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>{format(add(new Date(), {minutes: -2}), "h:mm:ss a")}</TableCell>
                    <TableCell><Badge className="bg-pink-100 text-pink-800">NO</Badge></TableCell>
                    <TableCell>250</TableCell>
                    <TableCell>{formatCurrency(0.34, '')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(85)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
