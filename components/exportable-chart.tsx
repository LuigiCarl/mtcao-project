"use client"

import * as React from "react"
import { Download, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportChartAsImage, exportChartAsJPG } from "@/lib/chart-export"

interface ExportableChartProps {
  children: React.ReactNode
  chartId: string
  chartName: string
}

export function ExportableChart({ children, chartId, chartName }: ExportableChartProps) {
  const handleExportPNG = () => {
    exportChartAsImage(chartId, chartName)
  }

  const handleExportJPG = () => {
    exportChartAsJPG(chartId, chartName)
  }

  return (
    <div className="relative h-full">
      <div className="absolute right-4 top-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export as Image</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportPNG}>
              <ImageIcon className="mr-2 h-4 w-4" />
              PNG Format
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJPG}>
              <ImageIcon className="mr-2 h-4 w-4" />
              JPG Format
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div id={chartId} className="h-full">
        {children}
      </div>
    </div>
  )
}
