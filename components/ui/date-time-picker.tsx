"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({ date, onDateChange, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [currentMonth, setCurrentMonth] = React.useState(date || new Date())

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1))
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))
  }

  const handleMonthSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    )
  }

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const years = Array.from({ length: 200 }, (_, i) => new Date().getFullYear() - 100 + i)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Month and Year Selectors */}
          <div className="flex gap-2 mb-3">
            <select
              value={currentMonth.getMonth()}
              onChange={handleMonthSelectChange}
              className="flex-1 text-sm px-2 py-1 rounded-md border border-input bg-background"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentMonth.getFullYear()}
              onChange={handleYearChange}
              className="flex-1 text-sm px-2 py-1 rounded-md border border-input bg-background"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground w-9 h-9 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth().map((day, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={!day}
                  onClick={() => day && handleDateSelect(day)}
                  className={cn(
                    "w-9 h-9 text-sm rounded-md flex items-center justify-center",
                    !day && "invisible",
                    day && "hover:bg-accent hover:text-accent-foreground",
                    isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
