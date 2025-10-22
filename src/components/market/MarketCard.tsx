import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getMarket, getFixture, getTeam, getPool, getCompetition } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import ProbabilityChip from './ProbabilityChip';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { BarChart2, Check, Clock, Lock, X } from 'lucide-react';

type MarketCardProps = {
  marketId: string;
};

export default async function MarketCard({ marketId }: MarketCardProps) {
  const market = await getMarket(marketId);
  if (!market) return <Card className="flex items-center justify-center p-4">Market not found</Card>;

  const fixture = await getFixture(market.fixtureId);
  const pool = await getPool(market.id);
  const homeTeam = fixture ? getTeam(fixture.homeTeamId) : null;
  const awayTeam = fixture ? getTeam(fixture.awayTeamId) : null;
  const competition = fixture ? getCompetition(fixture.competitionId) : null;

  if (!fixture || !homeTeam || !awayTeam || !competition || !pool) {
    return (
        <Card className="flex flex-col transition-all hover:shadow-md p-4 space-y-2">
            <div className="text-sm text-muted-foreground">Loading market...</div>
            <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="flex justify-around items-center pt-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-muted"></div>
                        <div className="h-4 bg-muted rounded w-12"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="text-muted-foreground text-sm">vs</div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-muted"></div>
                        <div className="h-4 bg-muted rounded w-12"></div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                </div>
            </div>
        </Card>
    );
  }

  const homeTeamLogo = getPlaceholderImage(homeTeam.logoId);
  const awayTeamLogo = getPlaceholderImage(awayTeam.logoId);

  const getStatusBadge = () => {
    switch(market.state) {
      case 'OPEN':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{market.state}</Badge>;
      case 'LOCKED':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"><Lock className="mr-1 h-3 w-3" /> {market.state}</Badge>;
      case 'RESOLVED':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Check className="mr-1 h-3 w-3" /> {market.state}</Badge>;
      case 'VOID':
         return <Badge variant="destructive"><X className="mr-1 h-3 w-3" /> {market.state}</Badge>;
      default:
        return <Badge variant="outline">{market.state}</Badge>;
    }
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <Link href={`/markets/${market.id}`} className="flex flex-col h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{competition.name}</span>
            {getStatusBadge()}
          </div>
          <CardTitle className="text-lg font-headline pt-2 truncate">
            {homeTeam.name} vs {awayTeam.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              {homeTeamLogo && (
                <Image src={homeTeamLogo.imageUrl} alt={homeTeam.name} width={48} height={48} className="rounded-full bg-muted" data-ai-hint={homeTeamLogo.imageHint} />
              )}
              <span className="text-sm font-semibold">{homeTeam.shortName}</span>
              <ProbabilityChip probability={pool?.lastPriceYes ?? 0} side="YES" />
            </div>
            <div className="text-muted-foreground text-sm">vs</div>
            <div className="flex flex-col items-center gap-2 text-center">
              {awayTeamLogo && (
                <Image src={awayTeamLogo.imageUrl} alt={awayTeam.name} width={48} height={48} className="rounded-full bg-muted" data-ai-hint={awayTeamLogo.imageHint} />
              )}
              <span className="text-sm font-semibold">{awayTeam.shortName}</span>
              <ProbabilityChip probability={pool?.lastPriceNo ?? 0} side="NO" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {market.state === 'OPEN' && `Closes ${formatDistanceToNow(fixture.startTimeUtc, { addSuffix: true })}`}
            {market.state === 'LOCKED' && 'Trading Closed'}
            {market.state === 'RESOLVED' && `Resolved ${market.resolvedAt ? formatDistanceToNow(market.resolvedAt, { addSuffix: true }) : ''}`}
          </div>
          <div className="flex items-center gap-1">
            <BarChart2 className="h-3 w-3" />
            {formatCurrency(pool?.volume24h ?? 0, '')} Volume
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
