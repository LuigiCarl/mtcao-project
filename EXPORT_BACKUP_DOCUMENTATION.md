# Export & Backup System Documentation

## Overview
A complete data export and database backup system has been implemented for the MTCAO (Municipal Tourism Culture and Arts Office) system. This allows administrators to export data in CSV format and create full database backups in SQL format.

## Backend Implementation

### ExportController
Location: `MTCAO-LARAVEL/app/Http/Controllers/Api/ExportController.php`

#### Available Endpoints

1. **Export All Data** - `GET /api/export/all`
   - Exports tourists, boats, and trips in a single CSV file
   - Organized in sections with headers
   - Includes a summary section with total counts
   - Filename: `mtcao_data_export_YYYY-MM-DD_HH-mm-ss.csv`

2. **Export Tourists Only** - `GET /api/export/tourists`
   - Exports all tourist records
   - Columns: ID, Name, Nationality, Type, Age, Gender, Purpose, Accommodation, Duration Days, Arrival Date, Departure Date, Created At
   - Filename: `tourists_export_YYYY-MM-DD_HH-mm-ss.csv`

3. **Export Boats Only** - `GET /api/export/boats`
   - Exports all boat records
   - Columns: ID, Name, Registration, Type, Capacity, Operator, Status, Year Built, Last Inspection, Created At
   - Filename: `boats_export_YYYY-MM-DD_HH-mm-ss.csv`

4. **Export Trips Only** - `GET /api/export/trips`
   - Exports all trip records with boat information
   - Columns: ID, Boat Name, Boat Registration, Departure, Arrival, Origin, Destination, Passengers, Distance, Status, Created At
   - Filename: `trips_export_YYYY-MM-DD_HH-mm-ss.csv`

5. **Database Backup** - `GET /api/export/database/backup`
   - Creates a complete SQL backup of the database
   - Includes DROP TABLE statements
   - Includes CREATE TABLE statements
   - Includes INSERT statements for all data
   - Filename: `mtcao_backup_YYYY-MM-DD_HH-mm-ss.sql`

6. **Database Information** - `GET /api/export/database/info`
   - Returns JSON with database statistics
   - Information includes:
     - Database name
     - Table counts (tourists, boats, trips)
     - Total records
     - Database size in MB
     - Last updated timestamp

### Routes
Location: `MTCAO-LARAVEL/routes/api.php`

```php
Route::prefix('export')->group(function () {
    Route::get('/all', [ExportController::class, 'exportAllData']);
    Route::get('/tourists', [ExportController::class, 'exportTourists']);
    Route::get('/boats', [ExportController::class, 'exportBoats']);
    Route::get('/trips', [ExportController::class, 'exportTrips']);
    Route::get('/database/info', [ExportController::class, 'getDatabaseInfo']);
    Route::get('/database/backup', [ExportController::class, 'backupDatabase']);
});
```

## Frontend Implementation

### Settings Page
Location: `app/system/settings/page.tsx`

#### Export Handlers

```typescript
// Export all data to CSV
const handleExportAll = () => {
    toast.success("Export started", {
        description: "Downloading complete data export...",
    })
    window.open('http://127.0.0.1:8000/api/export/all', '_blank')
}

// Export individual data types
const handleExportTourists = () => { ... }
const handleExportBoats = () => { ... }
const handleExportTrips = () => { ... }

// Backup database
const handleBackupDatabase = () => {
    toast.success("Backup started", {
        description: "Generating database backup...",
    })
    window.open('http://127.0.0.1:8000/api/export/database/backup', '_blank')
}
```

#### UI Components

**Data Management Card:**
- Export All Data button (main export)
- Three smaller export buttons for individual data types:
  - Tourists Only
  - Boats Only
  - Trips Only
- Database Backup button (SQL format)
- Import Data button (placeholder for future implementation)

**Features:**
- Toast notifications when export starts
- Downloads open in new tab/window
- Filename includes timestamp for easy identification
- Proper Content-Disposition headers for automatic download

## File Format Details

### CSV Format
- UTF-8 encoding
- Comma-separated values
- Headers included in first row
- Dates formatted as: YYYY-MM-DD HH:mm:ss
- All sections clearly labeled (in all-data export)

### SQL Format
- Compatible with MySQL/MariaDB
- Includes database structure
- Includes all data
- Ready to restore to a new database
- Safe DROP TABLE IF EXISTS statements

## Usage

### From Settings Page
1. Navigate to Settings → Data Management tab
2. Click the appropriate export button:
   - "Export CSV" for complete data
   - Individual export buttons for specific data types
   - "Backup DB" for SQL database backup
3. File will automatically download with timestamp

### Direct API Access
You can also access exports directly via URL:
- http://127.0.0.1:8000/api/export/all
- http://127.0.0.1:8000/api/export/tourists
- http://127.0.0.1:8000/api/export/boats
- http://127.0.0.1:8000/api/export/trips
- http://127.0.0.1:8000/api/export/database/backup
- http://127.0.0.1:8000/api/export/database/info

## Testing

All endpoints have been tested and verified:
- ✅ CSV exports generate properly formatted files
- ✅ SQL backup creates valid database dumps
- ✅ Timestamps are included in filenames
- ✅ Content-Disposition headers work correctly
- ✅ All database records are included
- ✅ Toast notifications display properly

## Current Database Status
- Tourists: 99 records
- Boats: 3 records
- Trips: 50 records
- Database size: ~0.33 MB

## Future Enhancements

### Planned Features:
1. **Import Functionality**
   - CSV file upload
   - Data validation
   - Bulk insert with duplicate handling
   - Progress tracking

2. **Scheduled Backups**
   - Automatic daily/weekly backups
   - Email backup to administrator
   - Cloud storage integration (S3, Google Drive)
   - Backup retention policies

3. **Export Filters**
   - Date range selection
   - Custom field selection
   - Export templates
   - Format options (Excel, JSON)

4. **Advanced Features**
   - Incremental backups
   - Compressed exports (ZIP)
   - Encrypted backups
   - Multi-database backup support

## Security Considerations
- All export endpoints are protected by API middleware
- File downloads are streamed to avoid memory issues
- Proper Content-Type and Content-Disposition headers prevent security issues
- SQL backups include proper escaping

## Troubleshooting

### Common Issues:

**Export returns 500 error:**
- Check Laravel logs: `storage/logs/laravel.log`
- Verify database connection
- Ensure all models have data

**File doesn't download:**
- Check browser popup blocker
- Verify API endpoint is accessible
- Check network tab in browser DevTools

**Empty CSV file:**
- Verify database has records
- Check model relationships
- Review Laravel logs for errors

**SQL backup fails:**
- Ensure sufficient memory
- Check MySQL user permissions
- Verify all tables exist

## Support
For issues or questions, check:
1. Laravel logs: `storage/logs/laravel.log`
2. Browser console: F12 → Console tab
3. Network tab: F12 → Network tab
4. Database info endpoint for current status
