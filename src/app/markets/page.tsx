import MarketCard from "@/components/market/MarketCard";
import MarketFilters from "@/components/market/MarketFilters";
import { getMarkets } from "@/lib/data";

export default function MarketsPage() {
  const markets = getMarkets().filter(m => m.state !== 'DRAFT');

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            All Markets
          </h1>
          <p className="text-muted-foreground">
            Browse and trade on all active and upcoming cricket matches.
          </p>
        </header>

        <div>
            <MarketFilters />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {markets.map((market) => (
            <MarketCard key={market.id} marketId={market.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
