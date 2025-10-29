<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TripController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Trip::with('boat');
        
        // Apply month/year filters if provided
        $month = $request->query('month');
        $year = $request->query('year');
        
        if ($month && $month !== 'all') {
            $query->whereMonth('trip_date', $month)
                  ->whereYear('trip_date', $year ?: date('Y'));
        }
        
        $trips = $query->latest('trip_date')->paginate(50);
        return response()->json($trips);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'boat_id' => 'required|exists:boats,id',
            'trip_date' => 'required|date',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'nullable|date_format:H:i',
            'destination' => 'required|string|max:255',
            'passengers_count' => 'required|integer|min:0',
            'trip_type' => 'required|in:tour,transfer,charter,other',
            'status' => 'sometimes|in:scheduled,ongoing,completed,cancelled',
            'revenue' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        $trip = Trip::create($validated);
        return response()->json($trip->load('boat'), 201);
    }

    public function show(Trip $trip): JsonResponse
    {
        return response()->json($trip->load('boat'));
    }

    public function update(Request $request, Trip $trip): JsonResponse
    {
        $validated = $request->validate([
            'boat_id' => 'sometimes|exists:boats,id',
            'trip_date' => 'sometimes|date',
            'departure_time' => 'sometimes|date_format:H:i',
            'arrival_time' => 'nullable|date_format:H:i',
            'destination' => 'sometimes|string|max:255',
            'passengers_count' => 'sometimes|integer|min:0',
            'trip_type' => 'sometimes|in:tour,transfer,charter,other',
            'status' => 'sometimes|in:scheduled,ongoing,completed,cancelled',
            'revenue' => 'nullable|numeric|min:0',
            'remarks' => 'nullable|string',
        ]);

        $trip->update($validated);
        return response()->json($trip->load('boat'));
    }

    public function destroy(Trip $trip): JsonResponse
    {
        $trip->delete();
        return response()->json(['message' => 'Trip deleted successfully']);
    }

    public function recent(): JsonResponse
    {
        $trips = Trip::with('boat')
            ->latest('trip_date')
            ->latest('departure_time')
            ->limit(10)
            ->get();

        return response()->json($trips);
    }

    public function trends(): JsonResponse
    {
        $trends = Trip::selectRaw('MONTH(trip_date) as month, COUNT(*) as trips, SUM(passengers_count) as passengers')
            ->whereYear('trip_date', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($trends);
    }
}
