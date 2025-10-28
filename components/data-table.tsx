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

const data = [
  { id: "BT-001", date: "Oct 28, 2025", boatName: "Sea Explorer", operator: "Blue Wave Co.", tourists: 8, foreign: 6, purpose: "Leisure" },
  { id: "BT-002", date: "Oct 27, 2025", boatName: "Ocean Dream", operator: "Marine Tours", tourists: 10, foreign: 8, purpose: "Leisure" },
  { id: "BT-003", date: "Oct 27, 2025", boatName: "Island Hopper", operator: "Paradise Boats", tourists: 6, foreign: 2, purpose: "Business" },
  { id: "BT-004", date: "Oct 26, 2025", boatName: "Coral Queen", operator: "Blue Wave Co.", tourists: 9, foreign: 7, purpose: "Leisure" },
  { id: "BT-005", date: "Oct 26, 2025", boatName: "Wave Rider", operator: "Coast Marine", tourists: 5, foreign: 5, purpose: "Education" },
  { id: "BT-006", date: "Oct 25, 2025", boatName: "Sun Seeker", operator: "Marine Tours", tourists: 7, foreign: 4, purpose: "Leisure" },
  { id: "BT-007", date: "Oct 25, 2025", boatName: "Blue Horizon", operator: "Ocean Adventures", tourists: 10, foreign: 9, purpose: "Leisure" },
  { id: "BT-008", date: "Oct 24, 2025", boatName: "Sea Breeze", operator: "Paradise Boats", tourists: 8, foreign: 6, purpose: "Official" },
]

export function DataTable() {
  return (
    <div className="w-full">
      <div className="pb-4">
        <h3 className="text-lg font-semibold">Recent Boat Transactions</h3>
        <p className="text-sm text-muted-foreground">
          Latest boat trips and tourist entries recorded in the system.
        </p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Boat Name</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead className="text-center">Tourists</TableHead>
              <TableHead className="text-center">Foreign</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.boatName}</TableCell>
                <TableCell>{row.operator}</TableCell>
                <TableCell className="text-center">{row.tourists}</TableCell>
                <TableCell className="text-center">{row.foreign}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      row.purpose === "Leisure"
                        ? "bg-green-100 text-green-800"
                        : row.purpose === "Business"
                        ? "bg-blue-100 text-blue-800"
                        : row.purpose === "Education"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {row.purpose}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
