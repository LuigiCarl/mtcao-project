"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
    { month: "January", boats: 145, tourists: 892 },
    { month: "February", boats: 168, tourists: 1024 },
    { month: "March", boats: 192, tourists: 1186 },
    { month: "April", boats: 215, tourists: 1345 },
    { month: "May", boats: 238, tourists: 1512 },
    { month: "June", boats: 256, tourists: 1628 },
    { month: "July", boats: 289, tourists: 1845 },
    { month: "August", boats: 302, tourists: 1932 },
    { month: "September", boats: 285, tourists: 1756 },
    { month: "October", boats: 268, tourists: 1634 },
]

const chartConfig = {
    tourists: {
        label: "Tourists",
        color: "hsl(142, 71%, 45%)",
    },
    boats: {
        label: "Boat Trips",
        color: "hsl(142, 76%, 36%)",
    },
    
} satisfies ChartConfig

export function BoatTripTrendChart() {
    return (
        <Card>
        <CardHeader>
        <CardTitle>Boat Trip Trends</CardTitle>
        <CardDescription>Monthly boat trips and tourist count</CardDescription>
        </CardHeader>
        <CardContent>
        <ChartContainer config={chartConfig}>
        <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
            left: 12,
            right: 12,
        }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
        dataKey="month"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
        dataKey="tourists"
        type="monotone"
        stroke="var(--color-tourists)"
        strokeWidth={2}
        dot={false}
        />
        <Line
        dataKey="boats"
        type="monotone"
        stroke="var(--color-boats)"
        strokeWidth={2}
        dot={false}
        />
        
        </LineChart>
        </ChartContainer>
        </CardContent>
        <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
        <div className="flex items-center gap-2 font-medium leading-none">
        Peak season showing strong growth <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
        January - October 2025
        </div>
        </div>
        </div>
        </CardFooter>
        </Card>
    )
}
