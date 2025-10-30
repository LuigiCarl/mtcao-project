<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use App\Models\Tourist;
use App\Models\Boat;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TourismController extends Controller
{
    /**
     * Get all tourism records with pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // Optimize with eager loading and field selection
            $query = Trip::with([
                'boat' => function($q) {
                    $q->select(['id', 'boat_name', 'registration_number', 'boat_type', 'capacity', 'status']);
                },
                'tourists' => function($q) {
                    $q->select(['id', 'trip_id', 'full_name', 'age', 'gender', 'nationality', 
                               'origin_city', 'type', 'purpose', 'destination', 'accommodation_type']);
                }
            ])
            ->select(['id', 'boat_id', 'trip_date', 'departure_time', 'destination', 'passengers_count', 'trip_type', 'status']);
            
            // Filter by date range
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('trip_date', [$request->start_date, $request->end_date]);
            }
            
            // Filter by month/year
            if ($request->has('month') && $request->month !== 'all') {
                $query->whereMonth('trip_date', $request->month);
            }
            
            if ($request->has('year')) {
                $query->whereYear('trip_date', $request->year);
            }
            
            // Filter by boat
            if ($request->has('boat_id') && $request->boat_id !== 'all') {
                $query->where('boat_id', $request->boat_id);
            }
            
            // Use cursor pagination for better performance
            $trips = $query->latest('trip_date')
                          ->latest('departure_time')
                          ->paginate($request->get('per_page', 20));
            
            return response()->json($trips);
        } catch (\Exception $e) {
            Log::error('Tourism index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch tourism records'], 500);
        }
    }

    /**
     * Store a new tourism record (trip with multiple tourists)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                // Trip Information
                'visitDate' => 'required|date',
                'visitTime' => 'required|date_format:H:i',
                'boatName' => 'required|string|max:255',
                'boatOperator' => 'required|string|max:255',
                'boatCaptain' => 'required|string|max:255',
                'boatCrew' => 'nullable|string|max:255',
                
                // Tourist Entries
                'touristEntries' => 'required|array|min:1|max:10',
                'touristEntries.*.name' => 'required|string|max:255',
                'touristEntries.*.age' => 'required|integer|min:1|max:120',
                'touristEntries.*.gender' => 'required|in:male,female',
                'touristEntries.*.isForeign' => 'required|boolean',
                'touristEntries.*.nationality' => 'required|string|max:255',
                'touristEntries.*.origin' => 'required|string|max:255',
                'touristEntries.*.purpose' => 'required|in:leisure,business,education,official,others',
                'touristEntries.*.transport' => 'required|in:land,air,sea',
                'touristEntries.*.destination' => 'required|in:island_tour,juag_lagoon,cave_diving,beach',
                'touristEntries.*.isOvernight' => 'required|boolean',
                'touristEntries.*.lengthOfStay' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Find or create boat
            $boat = Boat::firstOrCreate(
                ['boat_name' => $validated['boatName']],
                [
                    'operator_name' => $validated['boatOperator'],
                    'operator_contact' => 'N/A', // Default value
                    'captain_name' => $validated['boatCaptain'],
                    'captain_license' => 'N/A', // Default value
                    'capacity' => 50, // default
                    'boat_type' => 'other', // default type
                    'home_port' => 'Unknown', // Default value
                    'engine_type' => 'N/A', // Default value
                    'engine_horsepower' => 'N/A', // Default value
                    'year_built' => date('Y'), // Current year as default
                    'registration_number' => 'REG-' . strtoupper(substr(md5($validated['boatName']), 0, 8)),
                    'status' => 'active'
                ]
            );

            // Update boat info if exists (only update the fields we have)
            $boat->update([
                'operator_name' => $validated['boatOperator'],
                'captain_name' => $validated['boatCaptain'],
            ]);

            // Create trip
            $trip = Trip::create([
                'boat_id' => $boat->id,
                'trip_date' => $validated['visitDate'],
                'departure_time' => $validated['visitTime'],
                'arrival_time' => null,
                'destination' => 'Tourist Visit',
                'passengers_count' => count($validated['touristEntries']),
                'trip_type' => 'tour',
                'status' => 'completed',
                'remarks' => $validated['boatCrew'] ? 'Crew: ' . $validated['boatCrew'] : null,
            ]);

            // Create tourists
            $tourists = [];
            foreach ($validated['touristEntries'] as $entry) {
                // Determine accommodation type
                $lengthOfStay = floatval($entry['lengthOfStay']);
                $accommodationType = 'day_tour';
                if ($entry['isOvernight']) {
                    $accommodationType = $lengthOfStay >= 3 ? 'staycation' : 'overnight';
                }

                // Parse full name
                $nameParts = explode(' ', trim($entry['name']), 2);
                $firstName = $nameParts[0] ?? '';
                $lastName = $nameParts[1] ?? '';

                $tourist = Tourist::create([
                    'trip_id' => $trip->id,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'full_name' => $entry['name'],
                    'age' => $entry['age'],
                    'gender' => $entry['gender'],
                    'nationality' => $entry['nationality'],
                    'origin_city' => $entry['origin'],
                    'type' => $entry['isForeign'] ? 'foreign' : 'domestic',
                    'purpose' => $entry['purpose'],
                    'transport_mode' => $entry['transport'],
                    'destination' => $entry['destination'],
                    'accommodation_type' => $accommodationType,
                    'arrival_date' => $validated['visitDate'],
                    'departure_date' => $entry['isOvernight'] 
                        ? date('Y-m-d', strtotime($validated['visitDate'] . ' + ' . intval($lengthOfStay) . ' days'))
                        : $validated['visitDate'],
                    'duration_days' => max(0, intval($lengthOfStay)),
                ]);

                $tourists[] = $tourist;
            }

            DB::commit();

            return response()->json([
                'message' => 'Tourism record created successfully',
                'trip' => $trip->load('boat'),
                'tourists' => $tourists,
                'summary' => [
                    'total_tourists' => count($tourists),
                    'foreign' => collect($tourists)->where('type', 'foreign')->count(),
                    'domestic' => collect($tourists)->where('type', 'domestic')->count(),
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tourism store error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to create tourism record',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific tourism record
     */
    public function show($id): JsonResponse
    {
        try {
            $trip = Trip::with(['boat', 'tourists'])->findOrFail($id);
            return response()->json($trip);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Tourism record not found'], 404);
        }
    }

    /**
     * Update a tourism record
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'visitDate' => 'sometimes|date',
                'visitTime' => 'sometimes|date_format:H:i',
                'boatName' => 'sometimes|string|max:255',
                'boatOperator' => 'sometimes|string|max:255',
                'boatCaptain' => 'sometimes|string|max:255',
                'boatCrew' => 'nullable|string|max:255',
                'touristEntries' => 'sometimes|array|min:1|max:10',
                'touristEntries.*.name' => 'required|string|max:255',
                'touristEntries.*.age' => 'required|integer|min:0|max:150',
                'touristEntries.*.gender' => 'required|in:male,female',
                'touristEntries.*.isForeign' => 'required|boolean',
                'touristEntries.*.nationality' => 'required|string|max:255',
                'touristEntries.*.origin' => 'required|string|max:255',
                'touristEntries.*.purpose' => 'required|in:leisure,business,education,official,others',
                'touristEntries.*.transport' => 'required|in:land,air,sea',
                'touristEntries.*.destination' => 'required|in:island_tour,juag_lagoon,cave_diving,beach',
                'touristEntries.*.isOvernight' => 'required|boolean',
                'touristEntries.*.lengthOfStay' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            $trip = Trip::with('boat')->findOrFail($id);

            // Update boat if provided
            if (isset($validated['boatName'])) {
                $boat = Boat::firstOrCreate(
                    ['boat_name' => $validated['boatName']],
                    [
                        'operator_name' => $validated['boatOperator'] ?? 'N/A',
                        'operator_contact' => 'N/A',
                        'captain_name' => $validated['boatCaptain'] ?? 'N/A',
                        'captain_license' => 'N/A',
                        'capacity' => 50,
                        'boat_type' => 'other',
                        'home_port' => 'Unknown',
                        'engine_type' => 'N/A',
                        'engine_horsepower' => 'N/A',
                        'year_built' => date('Y'),
                        'registration_number' => 'REG-' . strtoupper(substr(md5($validated['boatName']), 0, 8)),
                        'status' => 'active'
                    ]
                );

                if (isset($validated['boatOperator'])) {
                    $boat->operator_name = $validated['boatOperator'];
                }
                if (isset($validated['boatCaptain'])) {
                    $boat->captain_name = $validated['boatCaptain'];
                }
                // Note: crew_members column doesn't exist in boats table
                // Crew info is stored in trip remarks instead
                $boat->save();

                $trip->boat_id = $boat->id;
            }

            // Update trip
            if (isset($validated['visitDate'])) {
                $trip->trip_date = $validated['visitDate'];
            }
            if (isset($validated['visitTime'])) {
                $trip->departure_time = $validated['visitTime'];
            }
            if (isset($validated['touristEntries'])) {
                $trip->passengers_count = count($validated['touristEntries']);
            }
            // Update remarks with crew info if provided
            if (isset($validated['boatCrew'])) {
                $trip->remarks = 'Crew: ' . $validated['boatCrew'];
            }
            $trip->save();

            // Update tourists if provided
            if (isset($validated['touristEntries'])) {
                // Delete old tourists
                Tourist::where('trip_id', $trip->id)->delete();

                // Create new tourists
                foreach ($validated['touristEntries'] as $entry) {
                    $lengthOfStay = floatval($entry['lengthOfStay'] ?? 0);
                    $accommodationType = 'day_tour';
                    if ($entry['isOvernight'] ?? false) {
                        $accommodationType = $lengthOfStay >= 3 ? 'staycation' : 'overnight';
                    }

                    $nameParts = explode(' ', trim($entry['name'] ?? ''), 2);
                    
                    Tourist::create([
                        'trip_id' => $trip->id,
                        'first_name' => $nameParts[0] ?? '',
                        'last_name' => $nameParts[1] ?? '',
                        'full_name' => $entry['name'] ?? '',
                        'age' => $entry['age'] ?? 0,
                        'gender' => $entry['gender'] ?? 'male',
                        'nationality' => $entry['nationality'] ?? '',
                        'origin_city' => $entry['origin'] ?? '',
                        'type' => ($entry['isForeign'] ?? false) ? 'foreign' : 'domestic',
                        'purpose' => $entry['purpose'] ?? 'leisure',
                        'transport_mode' => $entry['transport'] ?? 'land',
                        'destination' => $entry['destination'] ?? 'juag_lagoon',
                        'accommodation_type' => $accommodationType,
                        'arrival_date' => $trip->trip_date,
                        'departure_date' => ($entry['isOvernight'] ?? false)
                            ? date('Y-m-d', strtotime($trip->trip_date . ' + ' . intval($lengthOfStay) . ' days'))
                            : $trip->trip_date,
                        'duration_days' => max(0, intval($lengthOfStay)),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Tourism record updated successfully',
                'trip' => $trip->load(['boat', 'tourists'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tourism update error: ' . $e->getMessage());
            Log::error('Full exception: ' . $e);
            return response()->json([
                'error' => 'Failed to update tourism record',
                'message' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Delete a tourism record
     */
    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();

            $trip = Trip::findOrFail($id);
            
            // Delete associated tourists
            Tourist::where('trip_id', $trip->id)->delete();
            
            // Delete trip
            $trip->delete();

            DB::commit();

            return response()->json([
                'message' => 'Tourism record deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Tourism destroy error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete tourism record',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
