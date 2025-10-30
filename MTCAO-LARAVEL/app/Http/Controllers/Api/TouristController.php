<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tourist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class TouristController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Optimize with eager loading to prevent N+1 queries
        $query = Tourist::with(['trip' => function($q) {
            $q->select(['id', 'boat_id', 'trip_date', 'destination']); // Only load needed fields
        }, 'trip.boat' => function($q) {
            $q->select(['id', 'boat_name', 'registration_number', 'status']); // Only needed boat fields
        }])
        ->select(['id', 'trip_id', 'first_name', 'last_name', 'full_name', 'age', 'gender', 
                  'nationality', 'origin_city', 'type', 'purpose', 'transport_mode', 
                  'destination', 'accommodation_type', 'arrival_date', 'departure_date', 'duration_days']);

        // Filter by month and year if provided
        if ($request->has('month') && $request->month !== 'all') {
            $query->whereMonth('arrival_date', $request->month + 1);
        }

        if ($request->has('year') && $request->year !== 'all') {
            $query->whereYear('arrival_date', $request->year);
        }

        // Get all tourists (no pagination for monitoring)
        $tourists = $query->latest('arrival_date')->get();
        
        return response()->json($tourists);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'nationality' => 'required|string|max:255',
            'type' => 'required|in:domestic,foreign',
            'purpose' => 'required|in:leisure,business,education,official,others',
            'accommodation_type' => 'required|in:day_tour,overnight,staycation',
            'arrival_date' => 'required|date',
            'departure_date' => 'nullable|date|after_or_equal:arrival_date',
            'duration_days' => 'nullable|integer|min:1',
            'contact_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'remarks' => 'nullable|string',
        ]);

        $tourist = Tourist::create($validated);
        return response()->json($tourist, 201);
    }

    public function show(Tourist $tourist): JsonResponse
    {
        return response()->json($tourist);
    }

    public function update(Request $request, Tourist $tourist): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'nationality' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:domestic,foreign',
            'purpose' => 'sometimes|in:leisure,business,education,official,others',
            'accommodation_type' => 'sometimes|in:day_tour,overnight,staycation',
            'arrival_date' => 'sometimes|date',
            'departure_date' => 'nullable|date|after_or_equal:arrival_date',
            'duration_days' => 'nullable|integer|min:1',
            'contact_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'remarks' => 'nullable|string',
        ]);

        $tourist->update($validated);
        return response()->json($tourist);
    }

    public function destroy(Tourist $tourist): JsonResponse
    {
        $tourist->delete();
        return response()->json(['message' => 'Tourist record deleted successfully']);
    }

    public function summary(): JsonResponse
    {
        $total = Tourist::count();
        $domestic = Tourist::where('type', 'domestic')->count();
        $foreign = Tourist::where('type', 'foreign')->count();
        $avgStay = Tourist::whereNotNull('duration_days')->avg('duration_days');

        return response()->json([
            'total_tourists' => $total,
            'domestic_tourists' => $domestic,
            'foreign_tourists' => $foreign,
            'average_stay' => round($avgStay, 1),
        ]);
    }

    public function byNationality(): JsonResponse
    {
        $stats = Tourist::select('nationality', 'type', DB::raw('count(*) as total'))
            ->groupBy('nationality', 'type')
            ->orderBy('total', 'desc')
            ->get()
            ->groupBy('nationality')
            ->map(function ($items) {
                $domestic = $items->where('type', 'domestic')->sum('total');
                $foreign = $items->where('type', 'foreign')->sum('total');
                return [
                    'domestic' => $domestic,
                    'foreign' => $foreign,
                    'total' => $domestic + $foreign,
                ];
            });

        return response()->json($stats);
    }

    public function byPurpose(): JsonResponse
    {
        $stats = Tourist::select('purpose', DB::raw('count(*) as visitors'))
            ->groupBy('purpose')
            ->get();

        return response()->json($stats);
    }

    public function byAccommodation(): JsonResponse
    {
        $stats = Tourist::select('accommodation_type', DB::raw('count(*) as visitors'))
            ->groupBy('accommodation_type')
            ->get();

        return response()->json($stats);
    }
}
