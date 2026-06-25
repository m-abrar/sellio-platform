<?php

namespace App\Http\Controllers;

use App\Models\SearchQuery;
use App\Services\SmartSearchUrlBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmartSearchController extends Controller
{
    private const MODEL     = 'gemini-2.5-flash';
    private const CACHE_TTL = 600; // 10 minutes
    private const API_URL   = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are a search parser for a marketplace platform. Parse natural language queries into structured JSON.

Available modules and their filter parameters:
- properties: q, location, category, max_price, min_price, property_type (sale|rental), bedrooms
- autos: make, location, category, type (selling|lease), transmission (Automatic|Manual), max_price, min_price
- events: search, location, category, date (YYYY-MM-DD)
- services: search, location, category_id, min_price, max_price
- classifieds: search, location, category, min_price, max_price
- jobs: search, location, category, workplace_type (remote|hybrid|on-site)
- products: q, location, category, min_price, max_price
- blogs: search, category, sort (latest|popular)

Rules:
- Pick the single most appropriate module
- Only include filters that are clearly implied by the query
- Convert price mentions like "$500k" to 500000, "$1.2k" to 1200
- For properties/autos, "q" or "make" is the main search text; for others use "search"
- Return ONLY valid JSON, no explanation

Response format:
{
  "module": "<module_name>",
  "filters": { "<param>": "<value>", ... },
  "confidence": <0.0-1.0>,
  "summary": "<one sentence of what was understood>"
}
PROMPT;

    public function __construct(private SmartSearchUrlBuilder $urlBuilder) {}

    public function parse(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:3', 'max:500'],
        ]);

        $query    = trim($validated['q']);
        $cacheKey = 'smart_search:' . md5(strtolower($query));

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json($cached);
        }

        try {
            $url = sprintf(self::API_URL, self::MODEL);

            $prompt = self::SYSTEM_PROMPT . "\n\nUser query: " . $query;

            $response = Http::timeout(15)
                ->withQueryParameters(['key' => config('services.gemini.key')])
                ->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $prompt]]],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens'   => 512,
                        'temperature'       => 0,
                        'response_mime_type' => 'application/json',
                    ],
                ]);

            if ($response->failed()) {
                $errorMsg = $response->json('error.message') ?? $response->status();
                Log::warning('SmartSearch Gemini error', ['status' => $response->status(), 'error' => $errorMsg]);
                return response()->json(['error' => 'Search service temporarily unavailable. Please try again.'], 503);
            }

            $text = $response->json('candidates.0.content.parts.0.text') ?? '';

            $parsed = json_decode(trim($text), true);

            if (! is_array($parsed) || empty($parsed['module'])) {
                throw new \RuntimeException('Invalid JSON response from Gemini');
            }

            $module   = strtolower($parsed['module']);
            $filters  = is_array($parsed['filters'] ?? null) ? $parsed['filters'] : [];

            $redirectUrl = $this->urlBuilder->build($module, $filters);

            $result = [
                'module'       => $module,
                'filters'      => $filters,
                'confidence'   => (float) ($parsed['confidence'] ?? 0.8),
                'summary'      => $parsed['summary'] ?? '',
                'redirect_url' => $redirectUrl,
            ];

            Cache::put($cacheKey, $result, self::CACHE_TTL);

            SearchQuery::create([
                'module'     => $module,
                'keyword'    => $query,
                'filters'    => $filters ?: null,
                'user_id'    => request()->user()?->id,
                'ip_address' => $request->ip(),
                'created_at' => now(),
            ]);

            return response()->json($result);
        } catch (\Throwable $e) {
            Log::error('SmartSearch error', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to parse your query. Please try again.'], 500);
        }
    }
}
