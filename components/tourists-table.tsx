"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Search, Filter, Download, RefreshCw, Users, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const API_BASE_URL = 'http://127.0.0.1:8000/api'

interface Tourist {
  id: number
  trip_id: number
  first_name: string
  last_name: string
  full_name: string
  age: number
  gender: string
  nationality: string
  origin_city: string
  type: string
  purpose: string
  transport_mode: string
  destination: string
  accommodation_type: string
  arrival_date: string
  departure_date: string
  duration_days: number
  created_at: string
  updated_at: string
  trip?: {
    id: number
    trip_date: string
    boat?: {
      boat_name: string
      operator_name: string
    }
  }
}

interface TouristsStats {
  total: number
  foreign: number
  domestic: number
  male: number
  female: number
  avg_age: number
  by_purpose: Record<string, number>
  by_transport: Record<string, number>
  by_accommodation: Record<string, number>
  by_destination: Record<string, number>
}

export function TouristsTable() {
  const [tourists, setTourists] = React.useState<Tourist[]>([])
  const [filteredTourists, setFilteredTourists] = React.useState<Tourist[]>([])
  const [stats, setStats] = React.useState<TouristsStats | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [purposeFilter, setPurposeFilter] = React.useState<string>("all")
  const [genderFilter, setGenderFilter] = React.useState<string>("all")
  const [accommodationFilter, setAccommodationFilter] = React.useState<string>("all")
  const [destinationFilter, setDestinationFilter] = React.useState<string>("all")
  const [monthFilter, setMonthFilter] = React.useState<string>(new Date().getMonth().toString())
  const [yearFilter, setYearFilter] = React.useState<string>(new Date().getFullYear().toString())

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 20

  // Fetch tourists data
  const fetchTourists = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (monthFilter !== "all") params.append('month', monthFilter)
      if (yearFilter !== "all") params.append('year', yearFilter)

      const response = await fetch(`${API_BASE_URL}/tourists?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch tourists')
      }

      const data = await response.json()
      const touristsData = Array.isArray(data) ? data : (data.data || [])
      
      setTourists(touristsData)
      calculateStats(touristsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load tourists')
      console.error('Error fetching tourists:', err)
    } finally {
      setIsLoading(false)
    }
  }, [monthFilter, yearFilter])

  // Calculate statistics
  const calculateStats = (data: Tourist[]) => {
    if (data.length === 0) {
      setStats(null)
      return
    }

    const stats: TouristsStats = {
      total: data.length,
      foreign: data.filter(t => t.type === 'foreign').length,
      domestic: data.filter(t => t.type === 'domestic').length,
      male: data.filter(t => t.gender === 'male').length,
      female: data.filter(t => t.gender === 'female').length,
      avg_age: Math.round(data.reduce((sum, t) => sum + t.age, 0) / data.length),
      by_purpose: {},
      by_transport: {},
      by_accommodation: {},
      by_destination: {}
    }

    // Count by purpose, transport, accommodation, and destination
    data.forEach(t => {
      stats.by_purpose[t.purpose] = (stats.by_purpose[t.purpose] || 0) + 1
      stats.by_transport[t.transport_mode] = (stats.by_transport[t.transport_mode] || 0) + 1
      stats.by_accommodation[t.accommodation_type] = (stats.by_accommodation[t.accommodation_type] || 0) + 1
      if (t.destination) {
        stats.by_destination[t.destination] = (stats.by_destination[t.destination] || 0) + 1
      }
    })

    setStats(stats)
  }

  // Apply filters
  React.useEffect(() => {
    let filtered = [...tourists]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.full_name.toLowerCase().includes(query) ||
        t.nationality.toLowerCase().includes(query) ||
        t.origin_city.toLowerCase().includes(query) ||
        t.trip?.boat?.boat_name?.toLowerCase().includes(query)
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(t => t.type === typeFilter)
    }

    // Purpose filter
    if (purposeFilter !== "all") {
      filtered = filtered.filter(t => t.purpose === purposeFilter)
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter(t => t.gender === genderFilter)
    }

    // Accommodation filter
    if (accommodationFilter !== "all") {
      filtered = filtered.filter(t => t.accommodation_type === accommodationFilter)
    }

    // Destination filter
    if (destinationFilter !== "all") {
      filtered = filtered.filter(t => t.destination === destinationFilter)
    }

    setFilteredTourists(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [tourists, searchQuery, typeFilter, purposeFilter, genderFilter, accommodationFilter, destinationFilter])

  // Fetch on mount and when filters change
  React.useEffect(() => {
    fetchTourists()
  }, [fetchTourists])

  // Pagination
  const totalPages = Math.ceil(filteredTourists.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTourists = filteredTourists.slice(startIndex, startIndex + itemsPerPage)

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Name', 'Age', 'Gender', 'Type', 'Nationality', 'Origin City',
      'Purpose', 'Transport', 'Destination', 'Accommodation', 'Arrival Date', 'Departure Date',
      'Duration (Days)', 'Boat Name', 'Operator'
    ]

    const rows = filteredTourists.map(t => [
      t.full_name,
      t.age,
      t.gender,
      t.type,
      t.nationality,
      t.origin_city,
      t.purpose,
      t.transport_mode,
      t.destination?.replace(/_/g, ' ') || '',
      t.accommodation_type,
      t.arrival_date,
      t.departure_date,
      t.duration_days,
      t.trip?.boat?.boat_name || '',
      t.trip?.boat?.operator_name || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tourists_${yearFilter}_${monthFilter}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error loading tourists</p>
            <p className="text-sm mt-2">{error}</p>
            <Button onClick={fetchTourists} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 auto-rows-max">
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Tourists</CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.foreign} foreign / {stats.domestic} domestic
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Gender Distribution</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-xl sm:text-2xl font-bold">{stats.male}M / {stats.female}F</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((stats.male / stats.total) * 100).toFixed(1)}% male
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Average Age</CardTitle>
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-xl sm:text-2xl font-bold">{stats.avg_age} years</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all visitors
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Top Purpose</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-xl sm:text-2xl font-bold capitalize line-clamp-1">
                {Object.entries(stats.by_purpose).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Object.entries(stats.by_purpose).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} visitors
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Popular Spot</CardTitle>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-xl sm:text-2xl font-bold capitalize line-clamp-1">
                {(() => {
                  const topSpot = Object.entries(stats.by_destination).sort((a, b) => b[1] - a[1])[0]
                  if (!topSpot) return 'N/A'
                  return topSpot[0].replace(/_/g, ' ')
                })()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Object.entries(stats.by_destination).sort((a, b) => b[1] - a[1])[0]?.[1] || 0} visitors
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-2xl">Tourist Records</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Monitor and analyze tourist arrivals
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV} 
                disabled={filteredTourists.length === 0}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchTourists}
                className="flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Sync</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1">
          {/* Filters */}
          <div className="space-y-3 sm:space-y-4 mb-6">
            {/* Period and Type Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Month</label>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="0">January</SelectItem>
                    <SelectItem value="1">February</SelectItem>
                    <SelectItem value="2">March</SelectItem>
                    <SelectItem value="3">April</SelectItem>
                    <SelectItem value="4">May</SelectItem>
                    <SelectItem value="5">June</SelectItem>
                    <SelectItem value="6">July</SelectItem>
                    <SelectItem value="7">August</SelectItem>
                    <SelectItem value="8">September</SelectItem>
                    <SelectItem value="9">October</SelectItem>
                    <SelectItem value="10">November</SelectItem>
                    <SelectItem value="11">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Year</label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="foreign">Foreign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Gender</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Destination</label>
                <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="island_tour">Island Tour</SelectItem>
                    <SelectItem value="juag_lagoon">Juag Lagoon</SelectItem>
                    <SelectItem value="cave_diving">Cave Diving</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search and Additional Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name, nationality, city, boat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Purpose</label>
                <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Purposes</SelectItem>
                    <SelectItem value="leisure">Leisure</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="official">Official</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-medium">Accommodation</label>
                <Select value={accommodationFilter} onValueChange={setAccommodationFilter}>
                  <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="day_tour">Day Tour</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="staycation">Staycation (3+ days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTourists.length)} of {filteredTourists.length} tourists
            </p>
            {(searchQuery || typeFilter !== "all" || purposeFilter !== "all" || genderFilter !== "all" || accommodationFilter !== "all" || destinationFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setTypeFilter("all")
                  setPurposeFilter("all")
                  setGenderFilter("all")
                  setAccommodationFilter("all")
                  setDestinationFilter("all")
                }}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto max-w-full">
            <Table className="min-w-full table-auto">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] text-xs sm:text-sm">#</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Name</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Age</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Gender</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Nationality</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Origin</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Purpose</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Transport</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Destination</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Accommodation</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Duration</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Arrival</TableHead>
                  <TableHead className="whitespace-nowrap break-words text-xs sm:text-sm">Boat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell colSpan={14} className="py-2 sm:py-4">
                        <Skeleton className="h-6 sm:h-8 w-full rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTourists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center py-8">
                      <div className="text-muted-foreground flex flex-col items-center">
                        <Users className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 opacity-50" />
                        <p className="font-medium text-sm sm:text-base">No tourists found</p>
                        <p className="text-xs sm:text-sm mt-1">Try adjusting your filters or date range</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTourists.map((tourist, index) => (
                    <TableRow key={tourist.id} className="hover:bg-muted/50 text-xs sm:text-sm">
                      <TableCell className="font-medium py-2 px-2 sm:px-4">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-medium py-2 px-2 sm:px-4 whitespace-nowrap break-words">
                        {tourist.full_name}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-left">{tourist.age}</TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <Badge variant={tourist.gender === 'male' ? 'default' : 'secondary'} className="text-xs">
                          {tourist.gender === 'male' ? 'M' : 'F'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <Badge variant={tourist.type === 'foreign' ? 'default' : 'outline'} className="text-xs">
                          {tourist.type === 'foreign' ? '🌍' : '🇵🇭'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words text-xs">
                        {tourist.nationality}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words text-xs">
                        {tourist.origin_city}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words text-xs">
                        {tourist.purpose}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words text-xs">
                        {tourist.transport_mode}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <Badge variant="secondary" className="text-xs capitalize break-words max-w-fit">
                          {tourist.destination?.replace('_', ' ') || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4">
                        <Badge variant="outline" className="text-xs capitalize break-words max-w-fit">
                          {tourist.accommodation_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 text-left text-xs">
                        {tourist.duration_days}d
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-nowrap break-words text-xs">
                        {format(new Date(tourist.arrival_date), 'MMM dd')}
                      </TableCell>
                      <TableCell className="py-2 px-2 sm:px-4 whitespace-normal break-words">
                        <div className="text-xs">
                          <div className="font-medium break-words">{tourist.trip?.boat?.boat_name || 'N/A'}</div>
                          <div className="text-muted-foreground text-xs break-words">
                            {tourist.trip?.boat?.operator_name || ''}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">«</span>
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">»</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
