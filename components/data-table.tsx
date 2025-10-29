"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/search-input"
import { useTrips } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps {
  month?: string
  year?: string
}

export function DataTable({ month, year }: DataTableProps = {}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const { trips, loading, error } = useTrips(month, year)

  // Transform API data to match table format
  const data = React.useMemo(() => {
    if (!trips) return []
    
    return trips.map((trip: any) => ({
      id: `BT-${String(trip.id).padStart(3, '0')}`,
      date: new Date(trip.trip_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      boatName: trip.boat?.boat_name || 'N/A',
      operator: trip.boat?.operator_name || 'N/A',
      tourists: trip.passengers_count,
      destination: trip.destination,
      status: trip.status,
      tripType: trip.trip_type,
    }))
  }, [trips])

  const filteredData = data.filter((row) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      row.id.toLowerCase().includes(searchLower) ||
      row.boatName.toLowerCase().includes(searchLower) ||
      row.operator.toLowerCase().includes(searchLower) ||
      row.destination.toLowerCase().includes(searchLower) ||
      row.date.toLowerCase().includes(searchLower)
    )
  })

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="w-full">
      <div className="pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Recent Boat Trips</h3>
          <p className="text-sm text-muted-foreground">
            Latest boat trips recorded in the system.
          </p>
        </div>
        <SearchInput 
          className="w-[300px]" 
          onSearch={setSearchQuery}
          placeholder="Search trips..."
        />
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-destructive">Error loading trips: {error}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Boat Name</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-center">Passengers</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    {searchQuery ? `No results found for "${searchQuery}"` : "No trips available"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.boatName}</TableCell>
                    <TableCell>{row.operator}</TableCell>
                    <TableCell>{row.destination}</TableCell>
                    <TableCell className="text-center">{row.tourists}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                        {row.tripType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                          row.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : row.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} trips
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
