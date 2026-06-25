<?php

namespace App\Http\Middleware;

use App\Models\SearchQuery;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogPublicSearch
{
    // Which query param carries the main keyword per module
    private const KEYWORD_PARAM = [
        'properties' => 'q',
        'autos'      => 'make',
        'events'     => 'search',
        'services'   => 'search',
        'classifieds'=> 'search',
        'jobs'       => 'search',
        'products'   => 'q',
        'blogs'      => 'search',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        // Only log successful GET searches (200 OK)
        if (! $request->isMethod('GET') || $response->getStatusCode() !== 200) {
            return;
        }

        $routeName = $request->route()?->getName() ?? '';
        $module = $this->moduleFromRoute($routeName);

        if (! $module) {
            return;
        }

        $keywordParam = self::KEYWORD_PARAM[$module];
        $keyword = $request->query($keywordParam);
        if ($keyword !== null) {
            $keyword = mb_substr(trim((string) $keyword), 0, 255) ?: null;
        }

        // All other non-empty query params become filters
        $filters = collect($request->query())
            ->except([$keywordParam, 'page'])
            ->filter(fn($v) => $v !== null && $v !== '')
            ->toArray();

        // Skip if neither keyword nor any filter was provided
        if ($keyword === null && empty($filters)) {
            return;
        }

        SearchQuery::create([
            'module'     => $module,
            'keyword'    => $keyword,
            'filters'    => $filters ?: null,
            'user_id'    => auth()->id(),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);
    }

    private function moduleFromRoute(string $routeName): ?string
    {
        // e.g. "properties.search" → "properties"
        $prefix = explode('.', $routeName)[0];
        return isset(self::KEYWORD_PARAM[$prefix]) ? $prefix : null;
    }
}
