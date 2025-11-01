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
  foreign: {
    label: "🌍 Foreign",
    color: "hsl(0, 84%, 60%)",
  },
  domestic: {
    label: "🏠 Domestic",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig

interface TouristNationalityChartProps {
  data?: any[]
}

export function TouristNationalityChart({ data }: TouristNationalityChartProps) {
  // Transform API data or use fallback
  const chartData = data?.map((item: any) => ({
    nationality: item.nationality,
    foreign: item.foreign || 0,
    domestic: item.domestic || 0,
    total: item.total || (item.foreign + item.domestic) || 0,
  })) || [
    { nationality: "Philippines", foreign: 320, domestic: 850, total: 1170 },
    { nationality: "Korea", foreign: 450, domestic: 120, total: 570 },
    { nationality: "USA", foreign: 380, domestic: 80, total: 460 },
    { nationality: "Japan", foreign: 290, domestic: 60, total: 350 },
    { nationality: "China", foreign: 240, domestic: 50, total: 290 },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Tourist by Nationality</CardTitle>
        <CardDescription>Foreign vs Domestic breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        {/* Color Legend with Indicators */}
        <div className="flex gap-6 text-xs mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0, 84%, 60%)' }} />
            <span>🌍 Foreign Tourists</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }} />
            <span>🏠 Domestic Tourists</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart accessibilityLayer data={chartData} width={undefined} height={undefined}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nationality"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="foreign" fill="var(--color-foreign)" radius={4}>
              <LabelList
                dataKey="foreign"
                position="top"
                className="fill-foreground font-semibold"
                fontSize={10}
              />
            </Bar>
            <Bar dataKey="domestic" fill="var(--color-domestic)" radius={4}>
              <LabelList
                dataKey="domestic"
                position="top"
                className="fill-foreground font-semibold"
                fontSize={10}
              />
            </Bar>
          </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 12.5% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing tourist arrivals by nationality
        </div>
      </CardFooter>
    </Card>
  )
}