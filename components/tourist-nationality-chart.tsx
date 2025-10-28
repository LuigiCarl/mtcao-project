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

const chartData = [
  { nationality: "Philippines", foreign: 320, domestic: 850, total: 1170 },
  { nationality: "Korea", foreign: 450, domestic: 120, total: 570 },
  { nationality: "USA", foreign: 380, domestic: 80, total: 460 },
  { nationality: "Japan", foreign: 290, domestic: 60, total: 350 },
  { nationality: "China", foreign: 240, domestic: 50, total: 290 },
  { nationality: "Others", foreign: 180, domestic: 140, total: 320 },
]

const chartConfig = {
  foreign: {
    label: "Foreign",
    color: "hsl(142, 76%, 36%)",
  },
  domestic: {
    label: "Domestic",
    color: "hsl(142, 71%, 45%)",
  },
} satisfies ChartConfig

export function TouristNationalityChart() {
  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      <CardHeader>
        <CardTitle>Tourist by Nationality</CardTitle>
        <CardDescription>Foreign vs Domestic breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full min-h-[300px] aspect-auto">
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
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
            <Bar dataKey="domestic" fill="var(--color-domestic)" radius={4}>
              <LabelList
                dataKey="domestic"
                position="top"
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
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