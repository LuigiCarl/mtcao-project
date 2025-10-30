<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Boat;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BoatMonitoringController extends Controller
{
    /**
     * Get current cycle status for all active boats
     */
    public function getCycleStatus(): JsonResponse
    {
        $boats = Boat::where('status', 'active')
            ->orderBy('cycle_position')
            ->orderBy('boat_name')
            ->get()
            ->map(function ($boat) {
                return [
                    'id' => $boat->id,
                    'boat_name' => $boat->boat_name,
                    'registration_number' => $boat->registration_number,
                    'current_cycle' => $boat->current_cycle,
                    'cycle_position' => $boat->cycle_position,
                    'has_trip_in_cycle' => $boat->has_trip_in_cycle,
                    'last_trip_date' => $boat->last_trip_date,
                    'status' => $boat->status,
                    'can_take_trip' => !$boat->has_trip_in_cycle,
                ];
            });

        $totalBoats = $boats->count();
        $boatsWithTrips = $boats->where('has_trip_in_cycle', true)->count();
        $currentCycle = $boats->first()?->current_cycle ?? 0;
        $cycleComplete = $totalBoats > 0 && $boatsWithTrips === $totalBoats;

        return response()->json([
            'boats' => $boats,
            'cycle_info' => [
                'current_cycle' => $currentCycle,
                'total_boats' => $totalBoats,
                'boats_with_trips' => $boatsWithTrips,
                'boats_remaining' => $totalBoats - $boatsWithTrips,
                'cycle_complete' => $cycleComplete,
                'progress_percentage' => $totalBoats > 0 ? round(($boatsWithTrips / $totalBoats) * 100, 2) : 0,
            ],
        ]);
    }

    /**
     * Get next available boat for trip
     */
    public function getNextAvailableBoat(): JsonResponse
    {
        $boat = Boat::where('status', 'active')
            ->where('has_trip_in_cycle', false)
            ->orderBy('cycle_position')
            ->orderBy('boat_name')
            ->first();

        if (!$boat) {
            return response()->json([
                'boat' => null,
                'message' => 'All boats have completed their trip for this cycle. Start a new cycle to continue.',
            ]);
        }

        return response()->json([
            'boat' => [
                'id' => $boat->id,
                'boat_name' => $boat->boat_name,
                'registration_number' => $boat->registration_number,
                'cycle_position' => $boat->cycle_position,
                'current_cycle' => $boat->current_cycle,
            ],
        ]);
    }

    /**
     * Assign trip to boat (marks boat as having trip in current cycle)
     */
    public function assignTrip(Request $request): JsonResponse
    {
        $request->validate([
            'boat_id' => 'required|exists:boats,id',
        ]);

        $boat = Boat::findOrFail($request->boat_id);

        if ($boat->has_trip_in_cycle) {
            return response()->json([
                'success' => false,
                'message' => 'This boat already has a trip in the current cycle.',
            ], 422);
        }

        if ($boat->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'This boat is not active.',
            ], 422);
        }

        $boat->update([
            'has_trip_in_cycle' => true,
            'last_trip_date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trip assigned to boat successfully.',
            'boat' => $boat,
        ]);
    }

    /**
     * Start new cycle (reset all boats)
     */
    public function startNewCycle(): JsonResponse
    {
        DB::beginTransaction();
        try {
            $currentCycle = Boat::where('status', 'active')->max('current_cycle') ?? 0;
            $newCycle = $currentCycle + 1;

            Boat::where('status', 'active')->update([
                'current_cycle' => $newCycle,
                'has_trip_in_cycle' => false,
                'cycle_position' => DB::raw('cycle_position'), // Keep existing positions
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'New cycle started successfully.',
                'new_cycle' => $newCycle,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to start new cycle: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reset cycle positions (reorder boats)
     */
    public function resetCyclePositions(): JsonResponse
    {
        DB::beginTransaction();
        try {
            $boats = Boat::where('status', 'active')
                ->orderBy('boat_name')
                ->get();

            foreach ($boats as $index => $boat) {
                $boat->update([
                    'cycle_position' => $index + 1,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cycle positions reset successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset positions: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get cycle history/statistics
     */
    public function getCycleHistory(): JsonResponse
    {
        $boats = Boat::where('status', 'active')
            ->withCount([
                'trips as total_trips',
                'trips as completed_trips' => function ($query) {
                    $query->where('status', 'completed');
                },
            ])
            ->get()
            ->map(function ($boat) {
                return [
                    'id' => $boat->id,
                    'boat_name' => $boat->boat_name,
                    'current_cycle' => $boat->current_cycle,
                    'total_trips' => $boat->total_trips,
                    'completed_trips' => $boat->completed_trips,
                    'last_trip_date' => $boat->last_trip_date,
                ];
            });

        return response()->json([
            'boats' => $boats,
        ]);
    }
}
