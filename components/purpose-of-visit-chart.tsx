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
    color: "hsl(221, 83%, 53%)",
  },
  education: {
    label: "Education",
    color: "hsl(280, 65%, 60%)",
  },
  official: {
    label: "Official",
    color: "hsl(45, 93%, 58%)",
  },
  others: {
    label: "Others",
    color: "hsl(199, 89%, 48%)",
  },
} satisfies ChartConfig

interface PurposeOfVisitChartProps {
  data?: any[]
}

export function PurposeOfVisitChart({ data }: PurposeOfVisitChartProps) {
  // Transform API data or use fallback
  const chartData = data?.map((item: any) => {
    const purpose = item.purpose?.charAt(0).toUpperCase() + item.purpose?.slice(1) || 'Others'
    const configKey = purpose.toLowerCase() as keyof typeof chartConfig
    return {
      purpose: purpose,
      visitors: item.visitors || 0,
      fill: `var(--color-${configKey})`,
    }
  }) || [
    { purpose: "Leisure", visitors: 1850, fill: "var(--color-leisure)" },
    { purpose: "Business", visitors: 420, fill: "var(--color-business)" },
    { purpose: "Education", visitors: 180, fill: "var(--color-education)" },
    { purpose: "Official", visitors: 95, fill: "var(--color-official)" },
    { purpose: "Others", visitors: 215, fill: "var(--color-others)" },
  ]

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

  const CustomLegend = () => (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mt-4">
      {chartData.map((entry) => {
        const configKey = entry.purpose.toLowerCase() as keyof typeof chartConfig
        const configItem = chartConfig[configKey]
        const color = (configItem && 'color' in configItem) ? configItem.color : 'hsl(0, 0%, 50%)'
        
        return (
          <div key={entry.purpose} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground whitespace-nowrap">
              {entry.purpose}: <span className="font-medium text-foreground">{entry.visitors.toLocaleString()}</span>
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <Card className="flex flex-col h-full min-h-[500px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Purpose of Visit</CardTitle>
        <CardDescription>Tourist visit purposes breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex flex-col">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[280px]"
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
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <CustomLegend />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors by purpose
        </div>
      </CardFooter>
    </Card>
  )
}
