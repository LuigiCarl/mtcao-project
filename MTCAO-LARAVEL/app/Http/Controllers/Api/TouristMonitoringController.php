<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tourist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TouristMonitoringController extends Controller
{
    /**
     * Get real-time tourist statistics for today
     */
    public function getTodayStats(): JsonResponse
    {
        $today = Carbon::today();

        $stats = [
            'total_today' => Tourist::whereDate('arrival_date', $today)->count(),
            'foreign_today' => Tourist::whereDate('arrival_date', $today)
                ->where('type', 'foreign')
                ->count(),
            'domestic_today' => Tourist::whereDate('arrival_date', $today)
                ->where('type', 'domestic')
                ->count(),
        ];

        // Get hourly breakdown for today
        $hourlyBreakdown = Tourist::whereDate('arrival_date', $today)
            ->select(
                DB::raw('HOUR(created_at) as hour'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN type = "foreign" THEN 1 ELSE 0 END) as foreign'),
                DB::raw('SUM(CASE WHEN type = "domestic" THEN 1 ELSE 0 END) as domestic')
            )
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->map(function ($item) {
                return [
                    'hour' => sprintf('%02d:00', $item->hour),
                    'total' => (int) $item->count,
                    'foreign' => (int) $item->foreign,
                    'domestic' => (int) $item->domestic,
                ];
            });

        return response()->json([
            'stats' => $stats,
            'hourly_breakdown' => $hourlyBreakdown,
            'last_updated' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Get weekly tourist statistics
     */
    public function getWeeklyStats(): JsonResponse
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $dailyStats = Tourist::whereBetween('arrival_date', [$startOfWeek, $endOfWeek])
            ->select(
                DB::raw('DATE(arrival_date) as date'),
                DB::raw('DAYNAME(arrival_date) as day_name'),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN type = "foreign" THEN 1 ELSE 0 END) as foreign'),
                DB::raw('SUM(CASE WHEN type = "domestic" THEN 1 ELSE 0 END) as domestic')
            )
            ->groupBy('date', 'day_name')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'day' => $item->day_name,
                    'total' => (int) $item->total,
                    'foreign' => (int) $item->foreign,
                    'domestic' => (int) $item->domestic,
                ];
            });

        $weekTotal = $dailyStats->sum('total');
        $weekForeign = $dailyStats->sum('foreign');
        $weekDomestic = $dailyStats->sum('domestic');

        return response()->json([
            'daily_stats' => $dailyStats,
            'week_summary' => [
                'total' => $weekTotal,
                'foreign' => $weekForeign,
                'domestic' => $weekDomestic,
                'start_date' => $startOfWeek->toDateString(),
                'end_date' => $endOfWeek->toDateString(),
            ],
        ]);
    }

    /**
     * Get recent tourist arrivals
     */
    public function getRecentArrivals(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);

        $recentTourists = Tourist::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($tourist) {
                return [
                    'id' => $tourist->id,
                    'name' => $tourist->name,
                    'nationality' => $tourist->nationality,
                    'type' => $tourist->type,
                    'arrival_date' => $tourist->arrival_date,
                    'purpose' => $tourist->purpose_of_visit,
                    'accommodation' => $tourist->accommodation_type ?? 'N/A',
                    'created_at' => $tourist->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'recent_arrivals' => $recentTourists,
        ]);
    }

    /**
     * Get tourist statistics by nationality (top countries)
     */
    public function getTopNationalities(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 10);
        $period = $request->input('period', 'month'); // day, week, month, year

        $startDate = match ($period) {
            'day' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        $nationalities = Tourist::where('arrival_date', '>=', $startDate)
            ->select('nationality', DB::raw('COUNT(*) as count'))
            ->groupBy('nationality')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'nationality' => $item->nationality,
                    'count' => (int) $item->count,
                ];
            });

        return response()->json([
            'top_nationalities' => $nationalities,
            'period' => $period,
            'start_date' => $startDate->toDateString(),
        ]);
    }

    /**
     * Get tourist statistics by purpose of visit
     */
    public function getByPurpose(Request $request): JsonResponse
    {
        $period = $request->input('period', 'month');

        $startDate = match ($period) {
            'day' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfMonth(),
        };

        $purposes = Tourist::where('arrival_date', '>=', $startDate)
            ->select(
                'purpose_of_visit',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN type = "foreign" THEN 1 ELSE 0 END) as foreign'),
                DB::raw('SUM(CASE WHEN type = "domestic" THEN 1 ELSE 0 END) as domestic')
            )
            ->groupBy('purpose_of_visit')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) {
                return [
                    'purpose' => $item->purpose_of_visit,
                    'total' => (int) $item->count,
                    'foreign' => (int) $item->foreign,
                    'domestic' => (int) $item->domestic,
                ];
            });

        return response()->json([
            'by_purpose' => $purposes,
            'period' => $period,
        ]);
    }

    /**
     * Get live monitoring dashboard data
     */
    public function getLiveDashboard(): JsonResponse
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        // Today's stats
        $todayTotal = Tourist::whereDate('arrival_date', $today)->count();
        $todayForeign = Tourist::whereDate('arrival_date', $today)->where('type', 'foreign')->count();
        $todayDomestic = Tourist::whereDate('arrival_date', $today)->where('type', 'domestic')->count();

        // Yesterday's stats for comparison
        $yesterdayTotal = Tourist::whereDate('arrival_date', $yesterday)->count();

        // Calculate percentage change
        $percentageChange = $yesterdayTotal > 0 
            ? round((($todayTotal - $yesterdayTotal) / $yesterdayTotal) * 100, 2)
            : 0;

        // This week stats
        $weekStart = Carbon::now()->startOfWeek();
        $weekTotal = Tourist::where('arrival_date', '>=', $weekStart)->count();

        // This month stats
        $monthStart = Carbon::now()->startOfMonth();
        $monthTotal = Tourist::where('arrival_date', '>=', $monthStart)->count();

        // Recent arrivals (last 5)
        $recentArrivals = Tourist::orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'nationality', 'type', 'created_at'])
            ->map(function ($tourist) {
                return [
                    'name' => $tourist->first_name . ' ' . $tourist->last_name,
                    'nationality' => $tourist->nationality,
                    'type' => $tourist->type,
                    'time_ago' => $tourist->created_at->diffForHumans(),
                ];
            });

        return response()->json([
            'today' => [
                'total' => $todayTotal,
                'foreign' => $todayForeign,
                'domestic' => $todayDomestic,
                'percentage_change' => $percentageChange,
            ],
            'week_total' => $weekTotal,
            'month_total' => $monthTotal,
            'recent_arrivals' => $recentArrivals,
            'last_updated' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Get tourist trends and predictions
     */
    public function getTrends(): JsonResponse
    {
        // Get last 30 days data
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        $dailyTrends = Tourist::where('arrival_date', '>=', $thirtyDaysAgo)
            ->select(
                DB::raw('DATE(arrival_date) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => (int) $item->count,
                ];
            });

        // Calculate average daily arrivals
        $avgDaily = $dailyTrends->avg('count');

        // Get peak day
        $peakDay = $dailyTrends->sortByDesc('count')->first();

        return response()->json([
            'daily_trends' => $dailyTrends,
            'statistics' => [
                'average_daily' => round($avgDaily, 2),
                'peak_day' => $peakDay,
                'total_period' => $dailyTrends->sum('count'),
            ],
        ]);
    }
}
