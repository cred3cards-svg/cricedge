import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCompetitions } from "@/lib/data";

export default function MarketFilters() {
  const competitions = getCompetitions();

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        {competitions.map((comp) => (
          <TabsTrigger key={comp.id} value={comp.id}>{comp.name}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
