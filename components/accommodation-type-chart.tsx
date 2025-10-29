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
  dayTour: {
    label: "Day Tour",
    color: "hsl(142, 76%, 36%)",
  },
  overnight: {
    label: "Overnight",
    color: "hsl(221, 83%, 53%)",
  },
  staycation: {
    label: "Staycation",
    color: "hsl(280, 65%, 60%)",
  },
} satisfies ChartConfig

interface AccommodationTypeChartProps {
  data?: any[]
}

export function AccommodationTypeChart({ data }: AccommodationTypeChartProps) {
  // Transform API data or use fallback
  const chartData = data?.map((item: any) => {
    const type = item.accommodation_type?.split('_').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Unknown'
    
    const colorMap: Record<string, string> = {
      'Day Tour': 'hsl(142, 76%, 36%)',
      'Overnight': 'hsl(221, 83%, 53%)',
      'Staycation': 'hsl(280, 65%, 60%)',
    }
    
    return {
      type,
      visitors: item.visitors || 0,
      fill: colorMap[type] || 'hsl(0, 0%, 50%)',
    }
  }) || [
    { type: "Day Tour", visitors: 1240, fill: "hsl(142, 76%, 36%)" },
    { type: "Overnight", visitors: 890, fill: "hsl(221, 83%, 53%)" },
    { type: "Staycation", visitors: 630, fill: "hsl(280, 65%, 60%)" },
  ]

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      <CardHeader>
        <CardTitle>Accommodation Type</CardTitle>
        <CardDescription>Tourist accommodation preferences</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-[300px] aspect-auto">
          <BarChart accessibilityLayer data={chartData} width={undefined} height={undefined}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
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
          Day tours most popular this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total accommodations: {totalVisitors.toLocaleString()} visitors
        </div>
      </CardFooter>
    </Card>
  )
}
