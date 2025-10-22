'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Market, Pool, Team } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

type TradeWidgetProps = {
  market: Market;
  pool: Pool;
  homeTeam: Team;
  awayTeam: Team;
};

export default function TradeWidget({ market, pool, homeTeam, awayTeam }: TradeWidgetProps) {
  const [activeTab, setActiveTab] = useState<'yes' | 'no'>('yes');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to trade.",
        variant: 'destructive'
      });
      return;
    }
    toast({
        title: "Trade Placed (Demo)",
        description: `You bought ${tradePreview.shares.toFixed(2)} shares of ${activeTab.toUpperCase()} for ${formatCurrency(parseFloat(amount))}.`,
        action: <CheckCircle className="text-green-500" />
    });
    setAmount('');
  }

  const tradePreview = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      return { cost: 0, shares: 0, avgPrice: 0, fee: 0, slippage: 0, payout: 0 };
    }

    const price = activeTab === 'yes' ? pool.lastPriceYes : pool.lastPriceNo;
    const fee = numAmount * (market.feeBps / 10000);
    const cost = numAmount - fee;
    const shares = cost / price;
    const payout = shares; // Payout is 1 DC per share if correct

    return {
      cost: numAmount,
      shares,
      avgPrice: price,
      fee,
      slippage: 0.005, // Mock slippage
      payout,
    };
  }, [amount, activeTab, pool, market]);

  const isDisabled = market.state !== 'OPEN';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        {isDisabled ? (
           <Alert variant="default" className="bg-muted">
             <AlertDescription className="text-center text-muted-foreground">
              Trading is currently locked for this market.
             </AlertDescription>
           </Alert>
        ) : (
          <Tabs defaultValue="yes" onValueChange={(value) => setActiveTab(value as 'yes' | 'no')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="yes" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-200">
                Buy YES ({homeTeam.shortName})
              </TabsTrigger>
              <TabsTrigger value="no" className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-800 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-200">
                Buy NO ({awayTeam.shortName})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="yes">
                {/* Content is shared */}
            </TabsContent>
            <TabsContent value="no">
               {/* Content is shared */}
            </TabsContent>
            <div className="grid gap-4 pt-4">
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (DC)</Label>
                    <Input id="amount" type="number" placeholder="100.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                
                <div className="space-y-2 rounded-md bg-muted/50 p-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">You receive approx.</span>
                        <span>{tradePreview.shares.toFixed(2)} Shares</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Average price</span>
                        <span>{formatCurrency(tradePreview.avgPrice, '')} / share</span>
                    </div>
                    <Separator className="my-2" />
                     <div className="flex justify-between font-semibold">
                        <span>Potential Payout</span>
                        <span>{formatCurrency(tradePreview.payout)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Trading fee</span>
                        <span>{formatCurrency(tradePreview.fee)}</span>
                    </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Est. slippage</span>
                        <span className="text-amber-600">{formatPercentage(tradePreview.slippage)}</span>
                    </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleTrade} disabled={!amount || parseFloat(amount) <= 0}>
                    Place Trade
                </Button>
            </div>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
