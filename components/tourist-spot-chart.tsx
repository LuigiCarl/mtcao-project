"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  juagLagoon: {
    label: "Juag Lagoon",
    color: "hsl(199, 89%, 48%)",
  },
  cave: {
    label: "Cave",
    color: "hsl(30, 80%, 55%)",
  },
  beach: {
    label: "Beach",
    color: "hsl(45, 93%, 58%)",
  },
} satisfies ChartConfig

interface TouristSpotChartProps {
  data?: any[]
}

export function TouristSpotChart({ data }: TouristSpotChartProps) {
  // Transform API data or use fallback
  const colorMap: Record<string, string> = {
    'Juag Lagoon': 'hsl(199, 89%, 48%)',
    'Cave': 'hsl(30, 80%, 55%)',
    'Beach': 'hsl(45, 93%, 58%)',
    'Diving Spot': 'hsl(280, 65%, 60%)',
    'Island Tour': 'hsl(142, 76%, 36%)',
  }
  
  const chartData = data?.map((item: any) => ({
    spot: item.destination || item.spot,
    visitors: item.visitors || item.count || 0,
    fill: colorMap[item.destination || item.spot] || 'hsl(0, 0%, 50%)',
  })) || [
    { spot: "Beach", visitors: 1620, fill: "hsl(45, 93%, 58%)" },
    { spot: "Juag Lagoon", visitors: 1450, fill: "hsl(199, 89%, 48%)" },
    { spot: "Cave", visitors: 980, fill: "hsl(30, 80%, 55%)" },
  ]

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  const mostPopular = chartData.length > 0 
    ? chartData.reduce((max, curr) => curr.visitors > max.visitors ? curr : max)
    : null

  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      <CardHeader>
        <CardTitle>Popular Tourist Spots</CardTitle>
        <CardDescription>Most visited destinations this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-[300px] aspect-auto">
          <BarChart accessibilityLayer data={chartData} width={undefined} height={undefined}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="spot"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="visitors"
              radius={8}
              fill="var(--color-visitors)"
            >
              <LabelList
                dataKey="visitors"
                position="top"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {mostPopular ? (
            <>{mostPopular.spot} is most popular <TrendingUp className="h-4 w-4" /></>
          ) : (
            <>No data available for selected period</>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Total spot visits: {totalVisitors.toLocaleString()} visitors
        </div>
      </CardFooter>
    </Card>
  )
}
