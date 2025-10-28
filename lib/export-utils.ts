// Utility functions for exporting reports in various formats

/**
 * Export data as CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file to download
 * @param headers - Optional custom headers
 */
export function exportToCSV(
  data: any[],
  filename: string,
  headers?: string[]
) {
  if (!data || data.length === 0) {
    alert("No data to export")
    return
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])
  
  // Create CSV content
  const csvRows = [
    csvHeaders.join(","), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header]
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(",")
    )
  ]

  const csvContent = csvRows.join("\n")
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data as JSON file
 * @param data - Data to export
 * @param filename - Name of the file to download
 */
export function exportToJSON(data: any, filename: string) {
  if (!data) {
    alert("No data to export")
    return
  }

  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate printable HTML report (opens in new window for printing/PDF)
 * @param title - Report title
 * @param content - HTML content to print
 */
export function exportToPDF(title: string, content: string) {
  const printWindow = window.open("", "_blank")
  
  if (!printWindow) {
    alert("Please allow pop-ups to export PDF")
    return
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print / Save as PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </p>
        ${content}
        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>MTCAO Tourism Management System</p>
        </div>
      </body>
    </html>
  `
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}

/**
 * Format data for CSV export with proper column mapping
 */
export function formatForExport(data: any[], columnMapping?: Record<string, string>) {
  if (!columnMapping) return data

  return data.map(row => {
    const formatted: any = {}
    Object.entries(columnMapping).forEach(([key, label]) => {
      formatted[label] = row[key]
    })
    return formatted
  })
}
