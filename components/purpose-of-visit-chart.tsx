"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  { purpose: "Leisure", visitors: 1850, fill: "hsl(142, 76%, 36%)" },
  { purpose: "Business", visitors: 420, fill: "hsl(142, 71%, 45%)" },
  { purpose: "Education", visitors: 180, fill: "hsl(140, 60%, 55%)" },
  { purpose: "Official", visitors: 95, fill: "hsl(138, 50%, 65%)" },
  { purpose: "Others", visitors: 215, fill: "hsl(136, 40%, 75%)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  leisure: {
    label: "Leisure",
    color: "hsl(142, 76%, 36%)",
  },
  business: {
    label: "Business",
    color: "hsl(142, 71%, 45%)",
  },
  education: {
    label: "Education",
    color: "hsl(140, 60%, 55%)",
  },
  official: {
    label: "Official",
    color: "hsl(138, 50%, 65%)",
  },
  others: {
    label: "Others",
    color: "hsl(136, 40%, 75%)",
  },
} satisfies ChartConfig

export function PurposeOfVisitChart() {
  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Purpose of Visit</CardTitle>
        <CardDescription>Tourist visit purposes breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="purpose"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Leisure tourism up 8.3% this quarter <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing visitor distribution by purpose
        </div>
      </CardFooter>
    </Card>
  )
}
