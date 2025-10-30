"use client"

import * as React from "react"
import { format } from "date-fns"
import { Pencil, Trash2, Eye, Loader2, RefreshCw } from "lucide-react"
import { getTourismRecords, deleteTourismRecord, getTourismRecord } from "@/lib/api/tourism"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TourismRecord {
  id: number
  boat_id: number
  trip_date: string
  departure_time: string
  passengers_count: number
  boat: {
    id: number
    boat_name: string
    operator_name: string
    captain_name: string
  }
  tourists?: Array<{
    id: number
    full_name: string
    type: string
    nationality: string
  }>
}

interface TourismRecordsTableProps {
  onEdit?: (record: any) => void
  onRefresh?: () => void
  refreshTrigger?: number
}

export function TourismRecordsTable({ onEdit, onRefresh, refreshTrigger }: TourismRecordsTableProps) {
  const [records, setRecords] = React.useState<TourismRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = React.useState<string>("all")
  const [selectedYear, setSelectedYear] = React.useState<string>(new Date().getFullYear().toString())
  const [expandedRows, setExpandedRows] = React.useState<Set<number>>(new Set())
  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [editingId, setEditingId] = React.useState<number | null>(null)

  const fetchRecords = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const filters: any = {}
      if (selectedMonth !== "all") {
        filters.month = selectedMonth
      }
      if (selectedYear !== "all") {
        filters.year = selectedYear
      }

      const response = await getTourismRecords(filters)
      setRecords(response.data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load tourism records")
    } finally {
      setLoading(false)
    }
  }, [selectedMonth, selectedYear])

  React.useEffect(() => {
    fetchRecords()
  }, [fetchRecords, refreshTrigger])

  const handleEdit = async (id: number) => {
    if (!onEdit) return
    
    setEditingId(id)
    try {
      const response = await getTourismRecord(id)
      onEdit(response)
    } catch (err: any) {
      alert(`Failed to load record: ${err.message}`)
    } finally {
      setEditingId(null)
    }
  }

  const handleDelete = async (id: number, tripDate: string, boatName: string) => {
    if (!confirm(
      `⚠️ Delete Tourism Record?\n\n` +
      `Date: ${format(new Date(tripDate), "PPP")}\n` +
      `Boat: ${boatName}\n\n` +
      `This will permanently delete:\n` +
      `• The trip record\n` +
      `• All tourist entries for this trip\n\n` +
      `This action cannot be undone. Continue?`
    )) {
      return
    }

    setDeletingId(id)
    try {
      await deleteTourismRecord(id)
      
      // Show success message
      const successMsg = document.createElement('div')
      successMsg.className = 'fixed top-4 right-4 z-50 p-4 bg-green-50 border border-green-500 rounded-lg shadow-lg'
      successMsg.innerHTML = '<p class="text-sm text-green-700 font-medium">✅ Tourism record deleted successfully!</p>'
      document.body.appendChild(successMsg)
      setTimeout(() => successMsg.remove(), 3000)
      
      fetchRecords()
      if (onRefresh) onRefresh()
    } catch (err: any) {
      alert(`❌ Failed to delete record:\n\n${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const months = [
    { value: "all", label: "All Months" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const years = ["all", "2025", "2024", "2023", "2022"]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Tourism Records</CardTitle>
            <CardDescription>
              View, edit, and delete tourism arrival records
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={fetchRecords} variant="outline" size="sm" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="p-4 mb-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading records...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tourism records found</p>
            <p className="text-sm mt-2">Create a new record using the form above</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px] text-xs sm:text-sm whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Time</TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Boat Name</TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Operator</TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Captain</TableHead>
                  <TableHead className="text-xs sm:text-sm whitespace-nowrap">Tourists</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <React.Fragment key={record.id}>
                    <TableRow className="hover:bg-muted/50 text-xs sm:text-sm">
                      <TableCell className="font-medium py-2 px-2 sm:px-4">
                        {format(new Date(record.trip_date), "MMM dd")}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words">{record.departure_time}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words">{record.boat?.boat_name || "N/A"}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words">{record.boat?.operator_name || "N/A"}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words">{record.boat?.captain_name || "N/A"}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <span className="font-semibold">{record.passengers_count}</span>
                      </TableCell>
                      <TableCell className="text-right py-2 px-2 sm:px-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(record.id)}
                            title="View tourists"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(record.id)}
                              disabled={editingId === record.id}
                              title="Edit record"
                            >
                              {editingId === record.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Pencil className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(record.id, record.trip_date, record.boat?.boat_name || "Unknown")}
                            disabled={deletingId === record.id}
                            title="Delete record"
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingId === record.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded tourist details */}
                    {expandedRows.has(record.id) && record.tourists && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/50">
                          <div className="p-4">
                            <h4 className="font-semibold mb-3">Tourist Details:</h4>
                            <div className="grid gap-2">
                              {record.tourists.map((tourist, idx) => (
                                <div
                                  key={tourist.id}
                                  className="flex items-center gap-4 p-2 bg-background rounded border text-sm"
                                >
                                  <span className="font-medium text-muted-foreground">
                                    #{idx + 1}
                                  </span>
                                  <span className="font-medium">{tourist.full_name}</span>
                                  <span className="text-muted-foreground">
                                    {tourist.nationality}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      tourist.type === "foreign"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {tourist.type === "foreign" ? "Foreign" : "Domestic"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {records.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {records.length} record(s)
          </div>
        )}
      </CardContent>
    </Card>
  )
}
