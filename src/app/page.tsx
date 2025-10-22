import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calendar, Star } from 'lucide-react';
import MarketCard from '@/components/market/MarketCard';
import { getMarkets } from '@/lib/data';

export default async function Home() {
  const markets = await getMarkets();
  
  // Filter for markets starting in the future
  const upcomingMarkets = markets.filter(m => {
      // In a real app, we'd get fixture data and check startTimeUtc
      // For now, we'll just show the first few as featured.
      return true;
  });

  const featuredMarkets = upcomingMarkets.slice(0, 3);
  const todaysMarkets = upcomingMarkets.slice(3, 6);

  return (
    <div className="flex flex-col">
      <section className="relative w-full">
        <Card className="border-none rounded-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/Cricket_Animation_For_Website_Created.mp4" type="video/mp4" />
          </video>
          <div className="relative grid h-[50vh] min-h-[400px] place-items-center bg-black/50 p-4 text-center">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl font-headline">
                Trade Your Cricket Instincts
              </h1>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/markets">
                    View Markets <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="container mx-auto py-12 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl font-headline flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Featured Markets
          </h2>
          <Button variant="outline" asChild>
            <Link href="/markets">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredMarkets.length > 0 ? (
            featuredMarkets.map((market) => (
              <MarketCard key={market.id} marketId={market.id} />
            ))
          ) : (
             <p className="text-muted-foreground col-span-full">No featured markets available at the moment.</p>
          )}
        </div>
      </section>

      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl font-headline flex items-center gap-2">
              <Calendar className="h-6 w-6 text-accent" />
              Upcoming Matches
            </h2>
            <Button variant="outline" asChild>
              <Link href="/markets">View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {todaysMarkets.length > 0 ? (
                todaysMarkets.map((market) => (
                    <MarketCard key={market.id} marketId={market.id} />
                ))
             ) : (
                <p className="text-muted-foreground col-span-full">No upcoming matches available at the moment.</p>
             )}
          </div>
        </div>
      </section>
    </div>
  );
}
