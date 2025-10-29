<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TouristController;
use App\Http\Controllers\Api\BoatController;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\AnalyticsController;

Route::middleware('api')->group(function () {
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
});
