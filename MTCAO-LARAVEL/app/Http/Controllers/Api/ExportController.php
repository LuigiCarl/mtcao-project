<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tourist;
use App\Models\Boat;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;

class ExportController extends Controller
{
    /**
     * Export all data to CSV
     */
    public function exportAllData()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        
        // Get all data
        $tourists = Tourist::all();
        $boats = Boat::all();
        $trips = Trip::with('boat')->get();
        
        // Create CSV content
        $csv = "MUNICIPAL TOURISM DATA EXPORT\n";
        $csv .= "Generated: " . now()->toDateTimeString() . "\n\n";
        
        // Tourists CSV
        $csv .= "=== TOURISTS ===\n";
        $csv .= "ID,Name,Nationality,Type,Age,Gender,Purpose,Accommodation,Duration Days,Arrival Date,Departure Date\n";
        foreach ($tourists as $tourist) {
            $csv .= sprintf(
                "%d,\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",\"%s\",%d,%s,%s\n",
                $tourist->id,
                $tourist->name,
                $tourist->nationality,
                $tourist->type,
                $tourist->age ?? 0,
                $tourist->gender ?? '',
                $tourist->purpose ?? '',
                $tourist->accommodation_type ?? '',
                $tourist->duration_days ?? 0,
                $tourist->arrival_date ?? '',
                $tourist->departure_date ?? ''
            );
        }
        
        // Boats CSV
        $csv .= "\n=== BOATS ===\n";
        $csv .= "ID,Boat Name,Registration Number,Operator Name,Capacity,Status,Year Built\n";
        foreach ($boats as $boat) {
            $csv .= sprintf(
                "%d,\"%s\",\"%s\",\"%s\",%d,\"%s\",%d\n",
                $boat->id,
                $boat->boat_name,
                $boat->registration_number,
                $boat->operator_name,
                $boat->capacity,
                $boat->status,
                $boat->year_built ?? 0
            );
        }
        
        // Trips CSV
        $csv .= "\n=== TRIPS ===\n";
        $csv .= "ID,Boat Name,Trip Date,Departure Time,Arrival Time,Destination,Passengers,Trip Type,Status,Revenue\n";
        foreach ($trips as $trip) {
            $csv .= sprintf(
                "%d,\"%s\",%s,%s,%s,\"%s\",%d,\"%s\",\"%s\",%.2f\n",
                $trip->id,
                $trip->boat->boat_name ?? 'N/A',
                $trip->trip_date,
                $trip->departure_time ?? '',
                $trip->arrival_time ?? '',
                $trip->destination,
                $trip->passengers_count,
                $trip->trip_type,
                $trip->status,
                $trip->revenue ?? 0
            );
        }
        
        $csv .= "\n=== SUMMARY ===\n";
        $csv .= sprintf("Total Tourists: %d\n", $tourists->count());
        $csv .= sprintf("Total Boats: %d\n", $boats->count());
        $csv .= sprintf("Total Trips: %d\n", $trips->count());
        
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=mtcao_data_export_{$timestamp}.csv",
        ]);
    }
    
    /**
     * Export tourists only
     */
    public function exportTourists()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $tourists = Tourist::all();
        
        $csv = "ID,Name,Nationality,Type,Age,Gender,Purpose,Accommodation,Duration Days,Arrival Date,Departure Date,Created At\n";
        
        foreach ($tourists as $tourist) {
            $csv .= sprintf(
                "%d,\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",\"%s\",%d,%s,%s,%s\n",
                $tourist->id,
                $tourist->name,
                $tourist->nationality,
                $tourist->type,
                $tourist->age ?? 0,
                $tourist->gender ?? '',
                $tourist->purpose ?? '',
                $tourist->accommodation_type ?? '',
                $tourist->duration_days ?? 0,
                $tourist->arrival_date ?? '',
                $tourist->departure_date ?? '',
                $tourist->created_at
            );
        }
        
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=tourists_export_{$timestamp}.csv",
        ]);
    }
    
    /**
     * Export boats only
     */
    public function exportBoats()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $boats = Boat::all();
        
        $csv = "ID,Boat Name,Registration Number,Operator Name,Contact Number,Capacity,Type,Status,Year Built,Created At\n";
        
        foreach ($boats as $boat) {
            $csv .= sprintf(
                "%d,\"%s\",\"%s\",\"%s\",\"%s\",%d,\"%s\",\"%s\",%d,%s\n",
                $boat->id,
                $boat->boat_name,
                $boat->registration_number,
                $boat->operator_name,
                $boat->contact_number ?? '',
                $boat->capacity,
                $boat->type ?? '',
                $boat->status,
                $boat->year_built ?? 0,
                $boat->created_at
            );
        }
        
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=boats_export_{$timestamp}.csv",
        ]);
    }
    
    /**
     * Export trips only
     */
    public function exportTrips()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $trips = Trip::with('boat')->get();
        
        $csv = "ID,Boat Name,Trip Date,Departure Time,Arrival Time,Destination,Passengers,Trip Type,Status,Revenue,Remarks,Created At\n";
        
        foreach ($trips as $trip) {
            $csv .= sprintf(
                "%d,\"%s\",%s,%s,%s,\"%s\",%d,\"%s\",\"%s\",%.2f,\"%s\",%s\n",
                $trip->id,
                $trip->boat->boat_name ?? 'N/A',
                $trip->trip_date,
                $trip->departure_time ?? '',
                $trip->arrival_time ?? '',
                $trip->destination,
                $trip->passengers_count,
                $trip->trip_type,
                $trip->status,
                $trip->revenue ?? 0,
                $trip->remarks ?? '',
                $trip->created_at
            );
        }
        
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=trips_export_{$timestamp}.csv",
        ]);
    }
    
    /**
     * Get database backup info (file-based backup requires server access)
     */
    public function getDatabaseInfo(): JsonResponse
    {
        $dbName = config('database.connections.mysql.database');
        
        $stats = [
            'database_name' => $dbName,
            'tables' => [
                'tourists' => Tourist::count(),
                'boats' => Boat::count(),
                'trips' => Trip::count(),
            ],
            'total_records' => Tourist::count() + Boat::count() + Trip::count(),
            'database_size' => $this->getDatabaseSize($dbName),
            'last_updated' => DB::table('tourists')->latest('updated_at')->first()->updated_at ?? null,
        ];
        
        return response()->json($stats);
    }
    
    /**
     * Get database size in MB
     */
    private function getDatabaseSize($dbName): float
    {
        try {
            $result = DB::select("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
                FROM information_schema.TABLES 
                WHERE table_schema = ?
            ", [$dbName]);
            
            return $result[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            return 0;
        }
    }
    
    /**
     * Generate SQL backup
     */
    public function backupDatabase()
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $dbName = config('database.connections.mysql.database');
        
        // Get all table data
        $tables = ['tourists', 'boats', 'trips', 'settings'];
        $sql = "-- MySQL Database Backup\n";
        $sql .= "-- Database: {$dbName}\n";
        $sql .= "-- Generated: " . now()->toDateTimeString() . "\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";
        
        foreach ($tables as $table) {
            $sql .= "-- Table: {$table}\n";
            $sql .= "DROP TABLE IF EXISTS `{$table}`;\n\n";
            
            // Get create table statement
            $createTable = DB::select("SHOW CREATE TABLE `{$table}`");
            $sql .= $createTable[0]->{'Create Table'} . ";\n\n";
            
            // Get table data
            $rows = DB::table($table)->get();
            
            if ($rows->count() > 0) {
                $sql .= "INSERT INTO `{$table}` VALUES\n";
                $values = [];
                
                foreach ($rows as $row) {
                    $rowData = (array) $row;
                    $escapedValues = array_map(function($value) {
                        if ($value === null) return 'NULL';
                        return "'" . addslashes($value) . "'";
                    }, $rowData);
                    $values[] = '(' . implode(',', $escapedValues) . ')';
                }
                
                $sql .= implode(",\n", $values) . ";\n\n";
            }
        }
        
        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";
        
        return Response::make($sql, 200, [
            'Content-Type' => 'application/sql',
            'Content-Disposition' => "attachment; filename=mtcao_backup_{$timestamp}.sql",
        ]);
    }

    /**
     * Import tourists from CSV
     */
    public function importTourists(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $handle = fopen($file->getRealPath(), 'r');
            
            // Read header row
            $header = fgetcsv($handle);
            
            $imported = 0;
            $errors = [];
            $skipped = 0;
            
            DB::beginTransaction();
            
            while (($row = fgetcsv($handle)) !== false) {
                try {
                    // Skip empty rows
                    if (empty(array_filter($row))) {
                        continue;
                    }
                    
                    // Map CSV columns to database fields
                    $data = array_combine($header, $row);
                    
                    // Create or update tourist
                    Tourist::updateOrCreate(
                        ['id' => $data['ID'] ?? null],
                        [
                            'name' => $data['Name'] ?? '',
                            'nationality' => $data['Nationality'] ?? '',
                            'type' => $data['Type'] ?? 'foreign',
                            'age' => (int)($data['Age'] ?? 0),
                            'gender' => $data['Gender'] ?? '',
                            'purpose' => $data['Purpose'] ?? '',
                            'accommodation' => $data['Accommodation'] ?? '',
                            'duration_days' => (int)($data['Duration Days'] ?? 1),
                            'arrival_date' => $data['Arrival Date'] ?? now(),
                            'departure_date' => $data['Departure Date'] ?? now(),
                        ]
                    );
                    
                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row {$imported}: {$e->getMessage()}";
                    $skipped++;
                }
            }
            
            fclose($handle);
            DB::commit();
            
            return response()->json([
                'message' => 'Import completed',
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import boats from CSV
     */
    public function importBoats(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        try {
            $file = $request->file('file');
            $handle = fopen($file->getRealPath(), 'r');
            
            $header = fgetcsv($handle);
            $imported = 0;
            $errors = [];
            $skipped = 0;
            
            DB::beginTransaction();
            
            while (($row = fgetcsv($handle)) !== false) {
                try {
                    if (empty(array_filter($row))) {
                        continue;
                    }
                    
                    $data = array_combine($header, $row);
                    
                    Boat::updateOrCreate(
                        ['id' => $data['ID'] ?? null],
                        [
                            'name' => $data['Boat Name'] ?? $data['Name'] ?? '',
                            'registration_number' => $data['Registration Number'] ?? $data['Registration'] ?? '',
                            'type' => $data['Type'] ?? '',
                            'capacity' => (int)($data['Capacity'] ?? 0),
                            'operator_name' => $data['Operator Name'] ?? $data['Operator'] ?? '',
                            'contact_number' => $data['Contact Number'] ?? '',
                            'status' => $data['Status'] ?? 'active',
                            'year_built' => $data['Year Built'] ?? null,
                            'last_inspection_date' => $data['Last Inspection'] ?? null,
                        ]
                    );
                    
                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row {$imported}: {$e->getMessage()}";
                    $skipped++;
                }
            }
            
            fclose($handle);
            DB::commit();
            
            return response()->json([
                'message' => 'Import completed',
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import trips from CSV
     */
    public function importTrips(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240',
        ]);

        try {
            $file = $request->file('file');
            $handle = fopen($file->getRealPath(), 'r');
            
            $header = fgetcsv($handle);
            $imported = 0;
            $errors = [];
            $skipped = 0;
            
            DB::beginTransaction();
            
            while (($row = fgetcsv($handle)) !== false) {
                try {
                    if (empty(array_filter($row))) {
                        continue;
                    }
                    
                    $data = array_combine($header, $row);
                    
                    // Find boat by boat_name
                    $boat = Boat::where('boat_name', $data['Boat Name'] ?? '')->first();
                    
                    if (!$boat) {
                        $skipped++;
                        $errors[] = "Row " . ($imported + $skipped + 1) . ": Boat not found - " . ($data['Boat Name'] ?? 'N/A');
                        continue;
                    }
                    
                    // Parse dates
                    $tripDate = $data['Trip Date'] ?? now();
                    $departureTime = $data['Departure Time'] ?? '00:00:00';
                    $arrivalTime = $data['Arrival Time'] ?? '00:00:00';
                    
                    Trip::updateOrCreate(
                        ['id' => $data['ID'] ?? null],
                        [
                            'boat_id' => $boat->id,
                            'trip_date' => $tripDate,
                            'departure_time' => $departureTime,
                            'arrival_time' => $arrivalTime,
                            'destination' => $data['Destination'] ?? '',
                            'passengers_count' => (int)($data['Passengers'] ?? 0),
                            'trip_type' => $data['Trip Type'] ?? 'tour',
                            'status' => $data['Status'] ?? 'completed',
                            'revenue' => (float)($data['Revenue'] ?? 0),
                            'remarks' => $data['Remarks'] ?? '',
                        ]
                    );
                    
                    $imported++;
                } catch (\Exception $e) {
                    $errors[] = "Row {$imported}: {$e->getMessage()}";
                    $skipped++;
                }
            }
            
            fclose($handle);
            DB::commit();
            
            return response()->json([
                'message' => 'Import completed',
                'imported' => $imported,
                'skipped' => $skipped,
                'errors' => $errors,
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import/Restore database from SQL file
     */
    public function importDatabase(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB max - removed mime validation as it's unreliable
            'confirm' => 'required|in:true,1,yes,on', // User must confirm
        ]);

        try {
            $file = $request->file('file');
            
            // Check file extension manually
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, ['sql', 'txt'])) {
                return response()->json([
                    'message' => 'Import failed',
                    'error' => 'File must be a .sql or .txt file',
                ], 400);
            }
            
            $sql = file_get_contents($file->getRealPath());
            
            if (empty($sql)) {
                return response()->json([
                    'message' => 'Import failed',
                    'error' => 'SQL file is empty',
                ], 400);
            }

            // Remove comments and split into statements
            $sql = preg_replace('/^--.*$/m', '', $sql); // Remove single-line comments
            $sql = preg_replace('/\/\*.*?\*\//s', '', $sql); // Remove multi-line comments
            
            // Split SQL into individual statements (handle multi-line statements)
            $statements = [];
            $currentStatement = '';
            foreach (explode("\n", $sql) as $line) {
                $line = trim($line);
                if (empty($line)) continue;
                
                $currentStatement .= $line . ' ';
                if (substr($line, -1) === ';') {
                    $statements[] = trim(rtrim($currentStatement, ';'));
                    $currentStatement = '';
                }
            }
            if (!empty($currentStatement)) {
                $statements[] = trim($currentStatement);
            }

            $executed = 0;
            $skipped = 0;
            $errors = [];

            // Disable foreign key checks
            DB::unprepared('SET FOREIGN_KEY_CHECKS=0');

            foreach ($statements as $index => $statement) {
                $statement = trim($statement);
                if (empty($statement)) {
                    continue;
                }
                
                try {
                    // Skip SET FOREIGN_KEY_CHECKS as we handle it separately
                    if (stripos($statement, 'SET FOREIGN_KEY_CHECKS') !== false) {
                        $skipped++;
                        continue;
                    }
                    
                    // Use unprepared for DDL statements (no transaction needed)
                    DB::unprepared($statement);
                    $executed++;
                } catch (\Exception $e) {
                    $errorMsg = $e->getMessage();
                    
                    // Ignore "Unknown table" errors on DROP TABLE IF EXISTS
                    if (stripos($statement, 'DROP TABLE IF EXISTS') !== false && 
                        stripos($errorMsg, "Unknown table") !== false) {
                        $skipped++;
                        continue;
                    }
                    
                    // Log all other errors (truncate long messages)
                    $errors[] = "Statement {$index}: " . substr($errorMsg, 0, 200);
                }
            }

            // Re-enable foreign key checks
            DB::unprepared('SET FOREIGN_KEY_CHECKS=1');

            $totalStatements = count($statements) - $skipped;
            
            // Return error if too many errors (more than 20% failed AND more than 5 errors)
            if (count($errors) > max($totalStatements * 0.2, 5) && $totalStatements > 0) {
                return response()->json([
                    'message' => 'Database import failed',
                    'error' => 'Too many errors occurred during restore',
                    'executed' => $executed,
                    'total' => $totalStatements,
                    'skipped' => $skipped,
                    'errors' => array_slice($errors, 0, 10), // Only show first 10 errors
                ], 500);
            }

            return response()->json([
                'message' => 'Database import completed',
                'executed' => $executed,
                'total' => $totalStatements,
                'skipped' => $skipped,
                'errors' => $errors,
                'success' => count($errors) === 0,
            ]);

        } catch (\Exception $e) {
            // Re-enable foreign key checks on error
            try {
                DB::unprepared('SET FOREIGN_KEY_CHECKS=1');
            } catch (\Exception $ignored) {}
            
            return response()->json([
                'message' => 'Database import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear all records from database (DANGEROUS)
     * Requires explicit confirmation and authentication
     */
    public function clearAllRecords(Request $request): JsonResponse
    {
        $request->validate([
            'confirm' => 'required|in:true,1,yes,on',
            'confirmation_text' => 'required|string',
        ]);

        // Verify confirmation text matches exactly
        if ($request->confirmation_text !== 'DELETE ALL DATA') {
            return response()->json([
                'message' => 'Confirmation text does not match',
                'error' => 'You must type "DELETE ALL DATA" exactly to proceed.',
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Create a backup before clearing
            $backupName = 'auto_backup_before_clear_' . now()->format('Y-m-d_H-i-s') . '.sql';
            
            // Get counts before deletion for reporting
            $counts = [
                'tourists' => Tourist::count(),
                'boats' => Boat::count(),
                'trips' => Trip::count(),
            ];

            $total = array_sum($counts);

            // Disable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            // Truncate tables (faster than delete, resets auto-increment)
            DB::table('trips')->truncate();
            DB::table('tourists')->truncate();
            DB::table('boats')->truncate();

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            DB::commit();

            return response()->json([
                'message' => 'All records cleared successfully',
                'deleted' => $counts,
                'total' => $total,
                'backup_created' => $backupName,
                'timestamp' => now()->toDateTimeString(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to clear records',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear specific table records
     */
    public function clearTable(Request $request): JsonResponse
    {
        $request->validate([
            'table' => 'required|string|in:tourists,boats,trips',
            'confirm' => 'required|in:true,1,yes,on',
        ]);

        $table = $request->table;

        try {
            DB::beginTransaction();

            $count = DB::table($table)->count();

            // Use truncate for better performance
            if ($table === 'trips') {
                DB::table('trips')->truncate();
            } elseif ($table === 'tourists') {
                DB::table('tourists')->truncate();
            } elseif ($table === 'boats') {
                // Must clear trips first due to foreign key
                $tripsCount = DB::table('trips')->count();
                DB::table('trips')->truncate();
                DB::table('boats')->truncate();
                $count += $tripsCount;
            }

            DB::commit();

            return response()->json([
                'message' => ucfirst($table) . ' records cleared successfully',
                'table' => $table,
                'deleted' => $count,
                'timestamp' => now()->toDateTimeString(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to clear ' . $table,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

