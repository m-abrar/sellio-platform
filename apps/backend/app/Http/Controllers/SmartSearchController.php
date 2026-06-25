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
    private const MODEL          = 'gemini-2.5-flash';
    private const CACHE_TTL      = 600;
    private const RECENT_KEY     = 'recent_smart_searches';
    private const RECENT_MAX     = 8;
    private const API_URL   = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    private const SYSTEM_PROMPT = <<<'PROMPT'
You are a search parser for a multi-vertical marketplace. Parse a natural language query into structured JSON.

MODULES AND THEIR ACCEPTED PARAMETERS:

properties  — real estate listings
  q              keyword / address (string)
  location       city or area name (string — system converts to ID)
  category       property type e.g. "Apartment", "Villa" (string — system converts to ID)
  property_type  "sale" or "rental"
  min_price      number
  max_price      number
  bedrooms       number
  bathrooms      number
  guests         number
  check_in       YYYY-MM-DD
  check_out      YYYY-MM-DD

autos  — vehicles for sale or lease
  make           brand name e.g. "Toyota" (string)
  model          model name e.g. "Corolla" (string)
  location       city or area name (string — system converts to ID)
  category       vehicle category e.g. "SUV", "Sedan" (string — system converts to ID)
  type           "selling" or "lease"
  transmission   "Automatic" or "Manual"
  price_min      number
  price_max      number
  year_min       number (4-digit year)
  year_max       number (4-digit year)

events  — concerts, workshops, conferences
  search         keyword (string)
  location       city slug e.g. "karachi", "new-york"
  category       category slug e.g. "music", "tech-conference"
  type           type slug e.g. "online", "in-person"
  tag            tag slug e.g. "free", "family-friendly"
  date           YYYY-MM-DD
  sort           "latest" | "oldest" | "date_asc" | "date_desc"

services  — professional services
  search         keyword (string)
  location       city or area name (string — system converts to ID)
  category_id    category name e.g. "Plumbing", "Web Design" (string — system converts to ID)
  type           type name (string — system converts to ID)
  min_price      number
  max_price      number
  expertise      1 (beginner) | 2 (intermediate) | 3 (expert) | 4 (master)

classifieds  — buy/sell ads
  search         keyword (string)
  location       city slug e.g. "lahore", "dubai"
  category       category slug e.g. "electronics", "furniture"
  type           type slug
  tag            tag slug
  min_price      number
  max_price      number
  sort           "latest" | "oldest" | "price_low" | "price_high"

jobs  — job listings
  search         job title or keyword (string)
  location       city slug e.g. "islamabad", "remote"
  category       category slug e.g. "engineering", "marketing"
  type           type slug e.g. "full-time", "part-time"
  tag            tag slug
  workplace_type "remote" | "hybrid" | "on-site"
  experience_level  e.g. "junior", "senior", "entry-level"
  sort           "latest" | "oldest" | "salary_high" | "salary_low"

products  — marketplace products
  q              keyword / product name (string)
  location       city or area name (string — system converts to ID)
  category       category name e.g. "Electronics", "Clothing" (string — system converts to ID)
  brand          brand name e.g. "Apple", "Samsung" (string — system converts to ID)
  min_price      number
  max_price      number
  sort_by        "latest" | "price_low" | "price_high" | "rating"

blogs  — articles and guides
  search         keyword (string)
  category       category slug e.g. "real-estate-tips", "auto-news"
  tag            tag slug
  sort           "latest" | "popular" | "oldest"

RULES:
- Choose the single most relevant module
- Only include filters explicitly stated or strongly implied — omit everything else
- Price conversion: "$500k" → 500000 | "1.2 million" → 1200000 | "3 lac" → 300000
- Slugs (events, classifieds, jobs, blogs fields) must be lowercase-hyphenated
- Name fields (properties, autos, services, products) use natural capitalised text
- Return ONLY valid JSON — no markdown, no explanation

RESPONSE FORMAT:
{
  "module": "<module_name>",
  "filters": { "<param>": "<value>" },
  "confidence": <0.0–1.0>,
  "summary": "<one sentence describing what was understood>"
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
                ->withOptions(['curl' => [CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4]])
                ->withQueryParameters(['key' => setting('gemini_api_key') ?: config('services.gemini.key')])
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

            $this->pushRecentSearch($request, $query);

            return response()->json($result);
        } catch (\Throwable $e) {
            Log::error('SmartSearch error', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Unable to understand your query. Please try again.'], 500);
        }
    }

    public function recentSearches(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Logged-in: pull from DB so history persists across devices
            $recents = SearchQuery::where('user_id', $user->id)
                ->whereNotNull('keyword')
                ->where('keyword', '!=', '')
                ->orderByDesc('created_at')
                ->pluck('keyword')
                ->unique()
                ->take(self::RECENT_MAX)
                ->values()
                ->all();
        } else {
            $recents = $request->session()->get(self::RECENT_KEY, []);
        }

        return response()->json($recents);
    }

    public function clearRecentSearches(Request $request): JsonResponse
    {
        $query = $request->input('q');
        $user  = $request->user();

        if ($user) {
            $dbQuery = SearchQuery::where('user_id', $user->id);
            if ($query) {
                $dbQuery->where('keyword', $query);
            }
            $dbQuery->delete();
        }

        // Always clear session too (guests + fallback)
        if ($query) {
            $recents = array_values(array_filter(
                $request->session()->get(self::RECENT_KEY, []),
                fn($item) => $item !== $query
            ));
        } else {
            $recents = [];
        }

        $request->session()->put(self::RECENT_KEY, $recents);
        return response()->json(['ok' => true]);
    }

    private function pushRecentSearch(Request $request, string $query): void
    {
        // Guests: session only. Logged-in users: DB is source of truth (already saved via SearchQuery::create in parse())
        if (! $request->user()) {
            $recents = $request->session()->get(self::RECENT_KEY, []);
            $recents = array_values(array_filter($recents, fn($item) => $item !== $query));
            array_unshift($recents, $query);
            $request->session()->put(self::RECENT_KEY, array_slice($recents, 0, self::RECENT_MAX));
        }
    }
}
