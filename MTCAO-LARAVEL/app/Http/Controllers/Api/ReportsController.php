<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tourist;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Get tourist arrivals report with flexible date filtering
     */
    public function getTouristReport(Request $request): JsonResponse
    {
        $request->validate([
            'period' => 'nullable|in:day,month,year',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'year' => 'nullable|integer|min:2020|max:2099',
            'month' => 'nullable|integer|min:1|max:12',
        ]);

        $period = $request->input('period', 'month');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $year = $request->input('year');
        $month = $request->input('month');

        // Build query based on period
        $query = Tourist::query();

        // Apply date filters
        if ($startDate && $endDate) {
            $query->whereBetween('arrival_date', [$startDate, $endDate]);
        } elseif ($year && $month) {
            $query->whereYear('arrival_date', $year)
                  ->whereMonth('arrival_date', $month);
        } elseif ($year) {
            $query->whereYear('arrival_date', $year);
        } else {
            // Default: last 12 months
            $query->where('arrival_date', '>=', Carbon::now()->subMonths(12));
        }

        // Group by period
        switch ($period) {
            case 'day':
                $dateFormat = '%Y-%m-%d';
                $labelFormat = 'M d, Y';
                break;
            case 'year':
                $dateFormat = '%Y';
                $labelFormat = 'Y';
                break;
            case 'month':
            default:
                $dateFormat = '%Y-%m';
                $labelFormat = 'M Y';
                break;
        }

        $reportData = $query->select(
            DB::raw("DATE_FORMAT(arrival_date, '{$dateFormat}') as period"),
            DB::raw("COUNT(CASE WHEN type = 'foreign' THEN 1 END) as `foreign`"),
            DB::raw("COUNT(CASE WHEN type = 'domestic' THEN 1 END) as `domestic`"),
            DB::raw('COUNT(*) as total')
        )
        ->groupBy('period')
        ->orderBy('period', 'asc')
        ->get();

        // Format for frontend
        $formattedData = $reportData->map(function ($item) use ($labelFormat, $period) {
            try {
                if ($period === 'year') {
                    $date = Carbon::createFromFormat('Y', $item->period);
                } elseif ($period === 'day') {
                    $date = Carbon::createFromFormat('Y-m-d', $item->period);
                } else {
                    $date = Carbon::createFromFormat('Y-m', $item->period);
                }
                $label = $date->format($labelFormat);
            } catch (\Exception $e) {
                $label = $item->period;
            }

            return [
                'period' => $label,
                'foreign' => (int) $item->foreign,
                'domestic' => (int) $item->domestic,
                'total' => (int) $item->total,
            ];
        });

        return response()->json([
            'data' => $formattedData,
            'filters' => [
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'year' => $year,
                'month' => $month,
            ],
            'summary' => [
                'total_tourists' => $formattedData->sum('total'),
                'total_foreign' => $formattedData->sum('foreign'),
                'total_domestic' => $formattedData->sum('domestic'),
            ]
        ]);
    }

    /**
     * Get boat trips report with flexible date filtering
     */
    public function getBoatReport(Request $request): JsonResponse
    {
        $request->validate([
            'period' => 'nullable|in:day,month,year',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'year' => 'nullable|integer|min:2020|max:2099',
            'month' => 'nullable|integer|min:1|max:12',
            'boat_id' => 'nullable|integer|exists:boats,id',
        ]);

        $period = $request->input('period', 'month');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $year = $request->input('year');
        $month = $request->input('month');
        $boatId = $request->input('boat_id');

        // Build query based on period
        $query = Trip::query()->join('boats', 'trips.boat_id', '=', 'boats.id');

        // Apply date filters
        if ($startDate && $endDate) {
            $query->whereBetween('trip_date', [$startDate, $endDate]);
        } elseif ($year && $month) {
            $query->whereYear('trip_date', $year)
                  ->whereMonth('trip_date', $month);
        } elseif ($year) {
            $query->whereYear('trip_date', $year);
        } else {
            // Default: last 6 months
            $query->where('trip_date', '>=', Carbon::now()->subMonths(6));
        }

        // Filter by boat if specified
        if ($boatId) {
            $query->where('trips.boat_id', $boatId);
        }

        // Group by period
        switch ($period) {
            case 'day':
                $dateFormat = '%Y-%m-%d';
                $labelFormat = 'M d, Y';
                break;
            case 'year':
                $dateFormat = '%Y';
                $labelFormat = 'Y';
                break;
            case 'month':
            default:
                $dateFormat = '%Y-%m';
                $labelFormat = 'M Y';
                break;
        }

        $reportData = $query->select(
            DB::raw("DATE_FORMAT(trip_date, '{$dateFormat}') as period"),
            'boats.boat_name',
            DB::raw('COUNT(*) as trips')
        )
        ->groupBy('period', 'boats.boat_name')
        ->orderBy('period', 'asc')
        ->get();

        // Pivot data for frontend (group by period, then boat names)
        $pivotedData = [];
        $boatNames = [];
        
        foreach ($reportData as $item) {
            try {
                if ($period === 'year') {
                    $date = Carbon::createFromFormat('Y', $item->period);
                } elseif ($period === 'day') {
                    $date = Carbon::createFromFormat('Y-m-d', $item->period);
                } else {
                    $date = Carbon::createFromFormat('Y-m', $item->period);
                }
                $label = $date->format($labelFormat);
            } catch (\Exception $e) {
                $label = $item->period;
            }
            
            if (!isset($pivotedData[$label])) {
                $pivotedData[$label] = [
                    'period' => $label,
                    'total' => 0,
                ];
            }
            
            $pivotedData[$label][$item->boat_name] = (int) $item->trips;
            $pivotedData[$label]['total'] += (int) $item->trips;
            $boatNames[$item->boat_name] = true;
        }

        return response()->json([
            'data' => array_values($pivotedData),
            'boat_names' => array_keys($boatNames),
            'filters' => [
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'year' => $year,
                'month' => $month,
                'boat_id' => $boatId,
            ],
            'summary' => [
                'total_trips' => collect($pivotedData)->sum('total'),
            ]
        ]);
    }

    /**
     * Legacy: Get monthly tourist arrivals (backward compatible)
     */
    public function getMonthlyTouristArrivals(): JsonResponse
    {
        $request = new Request(['period' => 'month']);
        $response = $this->getTouristReport($request);
        return response()->json($response->getData()->data);
    }

    /**
     * Legacy: Get monthly boat trips (backward compatible)
     */
    public function getMonthlyBoatTrips(): JsonResponse
    {
        $request = new Request(['period' => 'month']);
        $response = $this->getBoatReport($request);
        return response()->json($response->getData()->data);
    }
}
