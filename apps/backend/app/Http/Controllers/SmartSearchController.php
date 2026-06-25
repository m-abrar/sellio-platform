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

Available modules and their exact filter parameters:

properties:
  q (keyword), location (slug), category (slug), property_type (sale|rental),
  min_price (number), max_price (number), bedrooms (number), bathrooms (number),
  guests (number), check_in (YYYY-MM-DD), check_out (YYYY-MM-DD)

autos:
  make (brand name), model (model name), location (slug), category (slug),
  type (selling|lease), transmission (Automatic|Manual),
  price_min (number), price_max (number), year_min (number), year_max (number)

events:
  search (keyword), location (slug), category (slug), type (slug), tag (slug),
  date (YYYY-MM-DD), sort (latest|oldest|date_asc|date_desc)

services:
  search (keyword), location (slug), category_id (slug), type (slug),
  min_price (number), max_price (number),
  expertise (1=beginner|2=intermediate|3=expert|4=master)

classifieds:
  search (keyword), location (slug), category (slug), type (slug), tag (slug),
  min_price (number), max_price (number), sort (latest|oldest|price_low|price_high)

jobs:
  search (keyword), location (slug), category (slug), type (slug), tag (slug),
  workplace_type (remote|hybrid|on-site), experience_level (text),
  sort (latest|oldest|salary_high|salary_low)

products:
  q (keyword), location (slug), category (slug), brand (slug), type (slug),
  min_price (number), max_price (number), sort_by (latest|price_low|price_high|rating)

blogs:
  search (keyword), category (slug), tag (slug), sort (latest|popular|oldest)

Rules:
- Pick the single most appropriate module
- Only include filters clearly implied by the query — omit everything else
- Convert prices: "$500k" → 500000, "1.2 million" → 1200000, "3 lac" → 300000
- Slugs must be lowercase, hyphenated (e.g. "karachi", "toyota-corolla", "real-estate")
- For properties/autos use "q"/"make" as the keyword field; for all others use "search"
- Return ONLY valid JSON, no explanation

Response format:
{
  "module": "<module_name>",
  "filters": { "<param>": "<value>" },
  "confidence": <0.0-1.0>,
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
