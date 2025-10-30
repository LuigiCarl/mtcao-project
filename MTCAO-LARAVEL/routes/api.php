<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TouristController;
use App\Http\Controllers\Api\BoatController;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\TourismController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\ReportsController;

Route::middleware('api')->group(function () {
    // Tourism routes (Combined Trip + Tourists)
    Route::apiResource('tourism', TourismController::class);
    
    // Tourist routes
    Route::apiResource('tourists', TouristController::class);
    Route::get('tourists/stats/summary', [TouristController::class, 'summary']);
    Route::get('tourists/stats/by-nationality', [TouristController::class, 'byNationality']);
    Route::get('tourists/stats/by-purpose', [TouristController::class, 'byPurpose']);
    Route::get('tourists/stats/by-accommodation', [TouristController::class, 'byAccommodation']);
    
    // Boat routes
    Route::apiResource('boats', BoatController::class);
    Route::get('boats/stats/summary', [BoatController::class, 'summary']);
    Route::get('boats/stats/monthly-trips', [BoatController::class, 'monthlyTrips']);
    
    // Trip routes
    Route::apiResource('trips', TripController::class);
    Route::get('trips/stats/recent', [TripController::class, 'recent']);
    Route::get('trips/stats/trends', [TripController::class, 'trends']);
    
    // Analytics routes
    Route::prefix('analytics')->group(function () {
        Route::get('dashboard', [AnalyticsController::class, 'dashboard']);
        Route::get('forecast', [AnalyticsController::class, 'forecast']);
        Route::get('tourist-spots', [AnalyticsController::class, 'touristSpots']);
    });
    
    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::get('/{group}', [SettingsController::class, 'getByGroup']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::put('/single', [SettingsController::class, 'updateSingle']);
        Route::post('/reset', [SettingsController::class, 'reset']);
        Route::get('/export/all', [SettingsController::class, 'export']);
        Route::post('/import', [SettingsController::class, 'import']);
    });
    
    // Export/Backup routes
    Route::prefix('export')->group(function () {
        Route::get('/all', [ExportController::class, 'exportAllData']);
        Route::get('/tourists', [ExportController::class, 'exportTourists']);
        Route::get('/boats', [ExportController::class, 'exportBoats']);
        Route::get('/trips', [ExportController::class, 'exportTrips']);
        Route::get('/database/info', [ExportController::class, 'getDatabaseInfo']);
        Route::get('/database/backup', [ExportController::class, 'backupDatabase']);
    });
    
    // Import routes
    Route::prefix('import')->group(function () {
        Route::post('/tourists', [ExportController::class, 'importTourists']);
        Route::post('/boats', [ExportController::class, 'importBoats']);
        Route::post('/trips', [ExportController::class, 'importTrips']);
        Route::post('/database', [ExportController::class, 'importDatabase']);
    });
    
    // Data management routes (DANGEROUS - requires confirmation)
    Route::prefix('data')->group(function () {
        Route::delete('/clear-all', [ExportController::class, 'clearAllRecords']);
        Route::delete('/clear-table', [ExportController::class, 'clearTable']);
    });
    
    // Reports routes
    Route::prefix('reports')->group(function () {
        Route::get('/tourists', [ReportsController::class, 'getTouristReport']);
        Route::get('/boats', [ReportsController::class, 'getBoatReport']);
        // Legacy routes (backward compatible)
        Route::get('/monthly-tourist-arrivals', [ReportsController::class, 'getMonthlyTouristArrivals']);
        Route::get('/monthly-boat-trips', [ReportsController::class, 'getMonthlyBoatTrips']);
    });
});
