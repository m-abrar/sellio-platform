<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SearchQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class SearchAnalyticsController extends Controller
{
    public function index(Request $request): View
    {
        $days    = (int) $request->query('days', 30);
        $days    = in_array($days, [7, 30, 90, 365]) ? $days : 30;
        $since   = now()->subDays($days);

        $filterKeyword = trim((string) $request->query('keyword', ''));
        $filterModule  = $request->query('module', '');

        // Base query scope
        $base = SearchQuery::where('created_at', '>=', $since)
            ->when($filterKeyword, fn($q) => $q->where('keyword', 'like', '%' . $filterKeyword . '%'))
            ->when($filterModule,  fn($q) => $q->where('module', $filterModule));

        $totalSearches = (clone $base)->count();

        $byModule = (clone $base)
            ->select('module', DB::raw('COUNT(*) as total'))
            ->groupBy('module')
            ->orderByDesc('total')
            ->get();

        $topKeywords = (clone $base)
            ->select('keyword', DB::raw('COUNT(*) as total'))
            ->whereNotNull('keyword')
            ->where('keyword', '!=', '')
            ->groupBy('keyword')
            ->orderByDesc('total')
            ->limit(20)
            ->get();

        $trend = (clone $base)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $trendLabels = [];
        $trendData   = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $trendLabels[] = now()->subDays($i)->format('M j');
            $trendData[]   = $trend[$date]->total ?? 0;
        }

        $sortable  = ['module', 'keyword', 'created_at'];
        $sortCol   = in_array($request->query('sort'), $sortable) ? $request->query('sort') : 'created_at';
        $sortDir   = $request->query('direction') === 'asc' ? 'asc' : 'desc';

        $recentSearches = (clone $base)
            ->with('user:id,name,email')
            ->orderBy($sortCol, $sortDir)
            ->limit(50)
            ->get();

        $allModules = SearchQuery::select('module')
            ->distinct()
            ->orderBy('module')
            ->pluck('module');

        return view('admin.reports.searches', compact(
            'sortCol',
            'sortDir',
            'days',
            'filterKeyword',
            'filterModule',
            'allModules',
            'totalSearches',
            'byModule',
            'topKeywords',
            'trendLabels',
            'trendData',
            'recentSearches',
        ));
    }
}
