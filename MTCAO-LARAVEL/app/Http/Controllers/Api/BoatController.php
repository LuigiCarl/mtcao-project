<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BoatController extends Controller
{
    public function index(): JsonResponse
    {
        // Optimize with lazy loading for trips and field selection
        $boats = Boat::with([
            'trips' => function($q) {
                $q->select(['id', 'boat_id', 'trip_date', 'passengers_count', 'trip_type'])
                  ->latest('trip_date')
                  ->limit(5); // Only get recent trips
            }
        ])
        ->select(['id', 'boat_name', 'registration_number', 'boat_type', 'capacity', 
                 'operator_name', 'operator_contact', 'captain_name', 'captain_license',
                 'home_port', 'engine_type', 'engine_horsepower', 'year_built', 'status'])
        ->latest()
        ->get();
        
        return response()->json($boats);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'boat_name' => 'required|string|max:255',
            'registration_number' => 'required|string|unique:boats',
            'boat_type' => 'required|in:ferry,speedboat,yacht,bangka,other',
            'capacity' => 'required|integer|min:1',
            'operator_name' => 'required|string|max:255',
            'operator_contact' => 'required|string|max:255',
            'captain_name' => 'required|string|max:255',
            'captain_license' => 'required|string|max:255',
            'home_port' => 'required|string|max:255',
            'engine_type' => 'required|string|max:255',
            'engine_horsepower' => 'required|string|max:255',
            'year_built' => 'required|integer|min:1900|max:' . date('Y'),
        ]);

        $boat = Boat::create($validated);
        return response()->json($boat, 201);
    }

    public function show(Boat $boat): JsonResponse
    {
        return response()->json($boat->load('trips'));
    }

    public function update(Request $request, Boat $boat): JsonResponse
    {
        $validated = $request->validate([
            'boat_name' => 'sometimes|string|max:255',
            'registration_number' => 'sometimes|string|unique:boats,registration_number,' . $boat->id,
            'boat_type' => 'sometimes|in:ferry,speedboat,yacht,bangka,other',
            'capacity' => 'sometimes|integer|min:1',
            'operator_name' => 'sometimes|string|max:255',
            'operator_contact' => 'sometimes|string|max:255',
            'captain_name' => 'sometimes|string|max:255',
            'captain_license' => 'sometimes|string|max:255',
            'home_port' => 'sometimes|string|max:255',
            'engine_type' => 'sometimes|string|max:255',
            'engine_horsepower' => 'sometimes|string|max:255',
            'year_built' => 'sometimes|integer|min:1900|max:' . date('Y'),
            'status' => 'sometimes|in:active,maintenance,inactive',
        ]);

        $boat->update($validated);
        return response()->json($boat);
    }

    public function destroy(Boat $boat): JsonResponse
    {
        $boat->delete();
        return response()->json(['message' => 'Boat deleted successfully']);
    }

    public function summary(): JsonResponse
    {
        $total = Boat::count();
        $active = Boat::where('status', 'active')->count();
        $totalCapacity = Boat::where('status', 'active')->sum('capacity');

        return response()->json([
            'total_boats' => $total,
            'active_boats' => $active,
            'total_capacity' => $totalCapacity,
        ]);
    }

    public function monthlyTrips(): JsonResponse
    {
        $trips = Boat::join('trips', 'boats.id', '=', 'trips.boat_id')
            ->selectRaw('MONTH(trips.trip_date) as month, COUNT(*) as trips, SUM(trips.passengers_count) as passengers')
            ->whereYear('trips.trip_date', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($trips);
    }
}
