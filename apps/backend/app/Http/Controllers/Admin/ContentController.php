<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkUpdateContentRequest;
use App\Models\PageContent;
use App\Models\Theme;
use App\Services\ContentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class ContentController
 * Orchestrates the administrative CMS interface, managing theme-specific content locations, 
 * bulk updates, and sophisticated section-based ordering.
 */
class ContentController extends Controller
{
    /** @var string The media collection identifier for page assets. */
    protected const FILE_COLLECTION = 'page_content'; 

    /** @var array Section identifiers prioritized for the top of the interface. */
    protected const TOP_SECTIONS = ['header', 'hero'];

    /** @var array Section identifiers prioritized for the bottom of the interface. */
    protected const BOTTOM_SECTIONS = ['footer'];

    /** 
     * @var array Priority mapping for content key ordering. 
     * Lower values indicate higher priority.
     */
    protected const KEY_ORDER_PATTERNS = [
        10 => '%brand%',
        20 => '%logo%',
        30 => '%heading%',
        31 => '%subheading%',
        32 => '%sub_heading%',
        40 => '%paragraph%',
        50 => '%button%',
        55 => '%link%',
    ];
    
    /**
     * Display a listing of all manageable content locations (Pages x Themes).
     *
     * @return \Illuminate\View\View
     */
    public function index(Request $request): View
    {
        foreach (['properties_classic', 'events_music', 'ecommerce_fashion', 'services_marketplace', 'autos_luxury', 'jobs_startup', 'classifieds_general', 'events_classic', 'autos_classic', 'autos_modern', 'autos_used', 'events_creative', 'events_festival', 'autos_electric', 'events_corporate', 'jobs_tech', 'jobs_corporate', 'ecommerce_default', 'ecommerce_electronics', 'ecommerce_luxury'] as $themeKey) {
            $this->ensureStructuredSlots($themeKey, 'home');
        }

        $selectedThemeKey = $request->query('theme_key');

        $contentPages = PageContent::select('page', 'theme_key')
            ->selectRaw('COUNT(*) as slots_count')
            ->selectRaw('MAX(updated_at) as latest_update')
            ->distinct()
            ->groupBy('page', 'theme_key')
            ->orderBy('page')
            ->orderBy('theme_key')
            ->get();

        if (is_string($selectedThemeKey) && $selectedThemeKey !== '') {
            $contentPages = $contentPages->where('theme_key', $selectedThemeKey)->values();
        }

        $themeKeys = $contentPages->pluck('theme_key')->unique()->values();
        $themes = Theme::whereIn('theme_key', $themeKeys)->get()->keyBy('theme_key');

        return view('admin.content.index', [
            'contentPages' => $contentPages,
            'themeKeys'    => $themeKeys,
            'themes'       => $themes,
            'selectedThemeKey' => $selectedThemeKey,
        ]);
    }
    
    /**
     * Show the edit interface for a specific page and theme, applying custom section ordering.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $page
     * @param  string|null  $theme_key
     * @return \Illuminate\View\View
     */
    public function editPage(Request $request, string $page, ?string $theme_key = null): View
    {
        $activeTheme = $theme_key ?? $request->query('themeKey');

        $this->ensureStructuredSlots($activeTheme, $page);
        
        $settings = PageContent::where('theme_key', $activeTheme)
            ->where('page', $page)
            ->ordered()
            ->get();
            
        return view('admin.content.edit-page', [
            'page'      => $page,
            'theme_key' => $activeTheme,
            'settings'  => $settings->groupBy('section'),
        ]);
    }

    /**
     * Handle bulk updates for text-based content settings.
     * Note: Media-based settings are managed via specialized AJAX endpoints.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\ContentService  $contentService
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkUpdate(BulkUpdateContentRequest $request, ContentService $contentService): RedirectResponse
    {
        $values = $request->validated()['values'];
        
        // Eager load settings to prevent N+1 during the loop
        $settings = PageContent::whereIn('id', array_keys($values))->get();

        foreach ($settings as $setting) {
            $newValue = $values[$setting->id] ?? null;

            if ($setting->value !== $newValue) {
                if (!in_array($setting->input_type, ['file', 'image', 'logo'])) {
                    $setting->value = $newValue;
                    $setting->save();
                    
                    $contentService->forgetCache($setting);
                }
            }
        }
        
        return redirect()->back()->with('success', __('Content saved successfully!'));
    }

    private function ensureStructuredSlots(?string $themeKey, string $page): void
    {
        if (! $themeKey || $page !== 'home') {
            return;
        }

        if (! Theme::where('theme_key', $themeKey)->exists()) {
            return;
        }

        $slots = $this->structuredSlotDefaults($themeKey);

        foreach ($slots as $slot) {
            PageContent::firstOrCreate([
                'theme_key' => $themeKey,
                'page' => $page,
                'section' => $slot['section'],
                'content_key' => $slot['content_key'],
            ], [
                'input_type' => $slot['input_type'],
                'value' => $slot['value'],
            ]);
        }
    }

    private function structuredSlotDefaults(string $themeKey): array
    {
        if ($themeKey === 'properties_classic') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'ESTATE & HERITAGE'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'Global Registry // Vol. 2026'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "The Heritage\nRegistry."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and manorial integrity."],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/properties/classic/7.webp'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'DISCOVER'],
                ['section' => 'collection', 'content_key' => 'heading', 'input_type' => 'text', 'value' => 'The Collection.'],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Current distribution includes verified manorial rights and significant historical provenance.'],
                ['section' => 'testimonials', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'Patron Feedback'],
                ['section' => 'testimonials', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Voices of Trust.'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "A curated distribution of the world's most distinguished historic properties. Every acquisition is verified for architectural provenance and legacy value."],
                ['section' => 'footer', 'content_key' => 'subscribe_text', 'input_type' => 'text', 'value' => 'Subscribe to our global heritage distribution protocol.'],
            ];
        }

        if ($themeKey === 'events_music') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'PULSE'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'PULSE // LIVE TRANSMISSION'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "FEEL THE\nMUSIC LIVE."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Discover elite concerts and underground music festivals across the global sonic network. High-fidelity experiences for the modern listener.'],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/events/music/10.webp'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Get Your Tickets'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Explore Lineup'],
                ['section' => 'metrics', 'content_key' => 'left_text', 'input_type' => 'text', 'value' => 'SYSTEM: OPTIMIZED | AUDIO: 120DB LIMIT | SYNC: VERIFIED'],
                ['section' => 'metrics', 'content_key' => 'right_text', 'input_type' => 'text', 'value' => 'BPM TRACKER: 128 (HOUSE)'],
                ['section' => 'lineup', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'Elite Headliners'],
                ['section' => 'lineup', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'The Core Lineup.'],
                ['section' => 'support', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'Underground Nodes'],
                ['section' => 'support', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Sonic Support.'],
                ['section' => 'experience', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'THE EXPERIENCE'],
                ['section' => 'experience', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Absolute\nSound."],
                ['section' => 'experience', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "PULSE is the definitive destination for high-velocity music culture. We don't just sell tickets; we provide verified access to the most immersive audio experiences on the planet."],
                ['section' => 'experience', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/events/music/15.webp'],
                ['section' => 'experience', 'content_key' => 'callout', 'input_type' => 'text', 'value' => 'NEXT_UP: IBIZA_MESH'],
                ['section' => 'gallery', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Sonic Recaps.'],
                ['section' => 'cta', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Join the\nPulse."],
                ['section' => 'cta', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Initialize your access for the world's most immersive music distribution network. High-fidelity experiences, verified by the PULSE sonic registry."],
                ['section' => 'cta', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Reserve Access'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The heartbeat of live music. Access the world's most immersive sonic distribution network. Verified high-fidelity experiences."],
            ];
        }

        if ($themeKey === 'ecommerce_fashion') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'ATELIERRunway'],
                ['section' => 'header', 'content_key' => 'season_label', 'input_type' => 'text', 'value' => 'AUTUMN_WINTER_26'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'FALL_WINTER_2026_COLLECTION'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Silent\nLuxury."],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Explore Editorial'],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/ecommerce/fashion/17.webp'],
                ['section' => 'hero', 'content_key' => 'side_image_1', 'input_type' => 'image', 'value' => '/themes/ecommerce/fashion/18.webp'],
                ['section' => 'hero', 'content_key' => 'side_image_1_label', 'input_type' => 'text', 'value' => 'ACCESSORIES_01'],
                ['section' => 'hero', 'content_key' => 'side_image_2', 'input_type' => 'image', 'value' => '/themes/ecommerce/fashion/19.webp'],
                ['section' => 'hero', 'content_key' => 'side_image_2_label', 'input_type' => 'text', 'value' => 'READY_TO_WEAR_04'],
                ['section' => 'collection', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'THE_AUTUMN_CAPSULE_V8'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Lookbook 26.'],
                ['section' => 'diagnostics', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Atelier Node Connection Alert'],
                ['section' => 'diagnostics', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback. Loading high-fidelity local catalog backups...'],
                ['section' => 'philosophy', 'content_key' => 'quote', 'input_type' => 'textarea', 'value' => 'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.'],
                ['section' => 'philosophy', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'ATELIER_PHILOSOPHY_SYNC'],
                ['section' => 'footer', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'ATELIER'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'We do not build garments. We architect confidence through the precision of silhouette and the purity of material.'],
            ];
        }

        if ($themeKey === 'services_marketplace') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'ServiceConnect'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Find Trusted Services Near You'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Connecting you with skilled professionals, fast and reliably.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Browse Services'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Become a Provider'],
                ['section' => 'search', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => 'Search for services...'],
                ['section' => 'categories', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Popular Categories'],
                ['section' => 'providers', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Top Rated Professionals'],
                ['section' => 'how_it_works', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'How It Works'],
                ['section' => 'how_it_works', 'content_key' => 'step_1_title', 'input_type' => 'text', 'value' => '1. Search Services'],
                ['section' => 'how_it_works', 'content_key' => 'step_1_description', 'input_type' => 'textarea', 'value' => 'Easily search through thousands of verified local professionals.'],
                ['section' => 'how_it_works', 'content_key' => 'step_2_title', 'input_type' => 'text', 'value' => '2. Compare Options'],
                ['section' => 'how_it_works', 'content_key' => 'step_2_description', 'input_type' => 'textarea', 'value' => 'Read reviews, compare prices, and check provider portfolios.'],
                ['section' => 'how_it_works', 'content_key' => 'step_3_title', 'input_type' => 'text', 'value' => '3. Hire Securely'],
                ['section' => 'how_it_works', 'content_key' => 'step_3_description', 'input_type' => 'textarea', 'value' => 'Book and pay securely through our trusted platform.'],
                ['section' => 'testimonials', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'What Our Clients Say'],
                ['section' => 'cta', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Ready to Hire or Offer Services?'],
                ['section' => 'cta', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Join our growing community today and connect with thousands of users.'],
                ['section' => 'cta', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Find Services'],
                ['section' => 'cta', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Offer Your Services'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Your trusted marketplace for local services. Connecting quality professionals with clients who need them.'],
                ['section' => 'footer', 'content_key' => 'email', 'input_type' => 'text', 'value' => 'support@serviceconnect.com'],
            ];
        }

        if ($themeKey === 'autos_luxury') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'Velvet Wheels'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Experience the Luxury You Deserve'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Your journey into unparalleled elegance and performance starts here. Discover hand-picked masterpieces.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Explore Collection'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Book Now'],
                ['section' => 'search', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Search'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Featured Masterpieces'],
                ['section' => 'collection', 'content_key' => 'view_all_label', 'input_type' => 'text', 'value' => 'View All Inventory'],
                ['section' => 'showcase', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Exclusive Showcase'],
                ['section' => 'showcase', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/autos/luxury/ferrari.png'],
                ['section' => 'showcase', 'content_key' => 'heading', 'input_type' => 'text', 'value' => 'The Crimson Legend'],
                ['section' => 'showcase', 'content_key' => 'subtitle', 'input_type' => 'text', 'value' => '1963 Ferrari 250 GTO'],
                ['section' => 'showcase', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'A one-of-a-kind vintage masterpiece, meticulously restored. This vehicle represents automotive history and unparalleled exclusivity.'],
                ['section' => 'showcase', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Inquire About Price'],
                ['section' => 'brands', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Our Curated Brands'],
                ['section' => 'testimonials', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Client Experiences'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Curating the world's finest automobiles for the most discerning clientele."],
            ];
        }

        if ($themeKey === 'jobs_startup') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'GROWTH_NODE.'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'SYNCHRONIZE_TALENT_V5'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Join the\nHypergrowth."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The high-fidelity distribution node for venture-backed talent. Connect your career node to the world's most innovative startup network."],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'EXPLORE_VENTURES'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'VENTURE_CAPITAL_ACCESS'],
                ['section' => 'trust', 'content_key' => 'left_text', 'input_type' => 'text', 'value' => 'VENTURE_FUNDING_SYNC: ACTIVE'],
                ['section' => 'trust', 'content_key' => 'right_text', 'input_type' => 'text', 'value' => 'EQUITY_VERIFIED: TRUE'],
                ['section' => 'trust', 'content_key' => 'network_text', 'input_type' => 'text', 'value' => 'NETWORK_NODE: 5.0_ELITE'],
                ['section' => 'stats', 'content_key' => 'startups_value', 'input_type' => 'text', 'value' => '450+'],
                ['section' => 'stats', 'content_key' => 'startups_label', 'input_type' => 'text', 'value' => 'VERIFIED_STARTUPS'],
                ['section' => 'stats', 'content_key' => 'equity_value', 'input_type' => 'text', 'value' => '$1.2B+'],
                ['section' => 'stats', 'content_key' => 'equity_label', 'input_type' => 'text', 'value' => 'TOTAL_EQUITY_VALUE'],
                ['section' => 'stats', 'content_key' => 'connections_value', 'input_type' => 'text', 'value' => '12k+'],
                ['section' => 'stats', 'content_key' => 'connections_label', 'input_type' => 'text', 'value' => 'NODAL_CONNECTIONS'],
                ['section' => 'mission', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'MISSION_CONTROL'],
                ['section' => 'mission', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Operational\nExcellence."],
                ['section' => 'mission', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Every startup node in our network is verified for mission-readiness. We track real-time funding status, equity structures, and team logic to ensure you join only the highest-fidelity high-growth opportunities.'],
                ['section' => 'mission', 'content_key' => 'image', 'input_type' => 'image', 'value' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'],
                ['section' => 'mission', 'content_key' => 'metric_1_value', 'input_type' => 'text', 'value' => '$4.2B'],
                ['section' => 'mission', 'content_key' => 'metric_1_label', 'input_type' => 'text', 'value' => 'TOTAL_VC_LIQUIDITY'],
                ['section' => 'mission', 'content_key' => 'metric_2_value', 'input_type' => 'text', 'value' => '12.4%'],
                ['section' => 'mission', 'content_key' => 'metric_2_label', 'input_type' => 'text', 'value' => 'AVG_EQUITY_POOL'],
                ['section' => 'cta', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Accelerate\nYour Future."],
                ['section' => 'cta', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Initialize your professional growth node and gain access to high-fidelity equity structures and mission-critical roles.'],
                ['section' => 'cta', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'INITIALIZE_GROWTH_NODE'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's most advanced high-fidelity startup distribution node. Synchronizing talent with high-growth capital."],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '(c) 2026 GROWTH_NODE_SYSTEMS. ALL_SYSTEMS_GO.'],
                ['section' => 'footer', 'content_key' => 'version_label', 'input_type' => 'text', 'value' => 'v.4.2_ELITE_VC'],
            ];
        }

        if ($themeKey === 'classifieds_general') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'CLASAFIND'],
                ['section' => 'search', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => 'Search for anything...'],
                ['section' => 'sidebar', 'content_key' => 'categories_title', 'input_type' => 'text', 'value' => 'Explore Categories'],
                ['section' => 'sidebar', 'content_key' => 'filters_title', 'input_type' => 'text', 'value' => 'Filters'],
                ['section' => 'filters', 'content_key' => 'pickup_label', 'input_type' => 'text', 'value' => 'Local pickup only'],
                ['section' => 'filters', 'content_key' => 'delivery_label', 'input_type' => 'text', 'value' => 'Includes delivery'],
                ['section' => 'filters', 'content_key' => 'price_limit_label', 'input_type' => 'text', 'value' => 'Price Limit:'],
                ['section' => 'filters', 'content_key' => 'clear_label', 'input_type' => 'text', 'value' => 'Clear all filters'],
                ['section' => 'collection', 'content_key' => 'all_title', 'input_type' => 'text', 'value' => 'All Recommended Listings'],
                ['section' => 'collection', 'content_key' => 'category_suffix', 'input_type' => 'text', 'value' => 'Showcase'],
                ['section' => 'collection', 'content_key' => 'sort_label', 'input_type' => 'text', 'value' => 'Sort:'],
                ['section' => 'collection', 'content_key' => 'load_more_label', 'input_type' => 'text', 'value' => 'Load More Listings'],
                ['section' => 'collection', 'content_key' => 'loading_more_label', 'input_type' => 'text', 'value' => 'Syncing Classifieds...'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No Listings Found'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "We couldn't find items that match your current sidebar filters or search tags."],
                ['section' => 'empty', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Reset Settings'],
                ['section' => 'chat', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => 'Type your offer or ask questions...'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => '2026 ClasaFind Classifieds Suite. All rights reserved. Engineered to Elite Standards.'],
            ];
        }

        if ($themeKey === 'events_classic') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'LEGACYArts'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Cultural\nHeritage."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "A curated distribution of the world's most significant cultural repertoire. Authenticated experiences for the discerning patron."],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Explore Repertoire'],
                ['section' => 'trust', 'content_key' => 'items', 'input_type' => 'textarea', 'value' => 'AUTHENTIC_INSTITUTIONAL_NODES|CURATED_ARTISTIC_PROTOCOL|GLOBAL_CULTURAL_EXCHANGE|PATRON_PRIVACY_SECURED'],
                ['section' => 'collection', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'OFFICIAL_CULTURAL_REGISTRY'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "The\nRepertoire."],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Our unified protocol synchronizes performance availability from the world's most significant institutional nodes."],
                ['section' => 'patron', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'PATRON_CIRCLE_PROTOCOL'],
                ['section' => 'patron', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "The Patron's\nCircle."],
                ['section' => 'patron', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Join an exclusive network of cultural institutions and patrons. Support the arts through the Sellio Legacy protocol and gain early access to premieres.'],
                ['section' => 'patron', 'content_key' => 'perks', 'input_type' => 'textarea', 'value' => 'Priority_Box|Private_Galas|Voting_Rights|Archive_Access'],
                ['section' => 'patron', 'content_key' => 'card_title', 'input_type' => 'text', 'value' => 'Become a Patron.'],
                ['section' => 'patron', 'content_key' => 'card_description', 'input_type' => 'textarea', 'value' => 'Institutional inquiry nodes are currently active for the 2026/27 cycle. Submit your credentials for evaluation.'],
                ['section' => 'patron', 'content_key' => 'card_cta_label', 'input_type' => 'text', 'value' => 'Request Institutional Access'],
                ['section' => 'footer', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'LEGACY'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's most significant archive of cultural repertoire. Synchronizing institutional archives with global patron nodes."],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '(c) 2026 SELLIO_LEGACY_ARTS // ARCHIVE_STABLE'],
            ];
        }

        if ($themeKey === 'autos_classic') {
            return [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'CLASSIC MOTORS'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => "The Collector's Choice"],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Discover Timeless Classics'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Your journey into automotive history begins here. Find, bid, or sell the world's most desired vintage automobiles."],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Browse Showcase'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Live Auctions'],
                ['section' => 'filters', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Find Your Dream Classic'],
                ['section' => 'filters', 'content_key' => 'clear_label', 'input_type' => 'text', 'value' => 'Clear Filters'],
                ['section' => 'filters', 'content_key' => 'make_label', 'input_type' => 'text', 'value' => 'Make / Manufacturer'],
                ['section' => 'filters', 'content_key' => 'model_label', 'input_type' => 'text', 'value' => 'Model Series'],
                ['section' => 'filters', 'content_key' => 'year_label', 'input_type' => 'text', 'value' => 'Era / Year'],
                ['section' => 'filters', 'content_key' => 'price_label', 'input_type' => 'text', 'value' => 'Valuation Bracket'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Featured Classics for Sale'],
                ['section' => 'collection', 'content_key' => 'count_label', 'input_type' => 'text', 'value' => 'Masterpieces'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No Classics Found'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'No vintage automobiles matched your current search filters.'],
                ['section' => 'empty', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Reset Refinements'],
                ['section' => 'auctions', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Live Auction Spotlight'],
                ['section' => 'about', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Why Collect Classic Cars?'],
                ['section' => 'about', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'More than just vehicles, classic cars are rolling investments, passionate hobbies, and tangible links to history.'],
                ['section' => 'about', 'content_key' => 'secondary_description', 'input_type' => 'textarea', 'value' => 'Each curve, engine note, and stitch of leather tells a story of innovation, design, and a bygone era. We connect discerning collectors with meticulously curated classics, ensuring authenticity, provenance, and investment quality.'],
                ['section' => 'about', 'content_key' => 'image', 'input_type' => 'image', 'value' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600'],
                ['section' => 'about', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Read Our Story'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's premier destination for buying and selling vintage and collector automobiles."],
                ['section' => 'footer', 'content_key' => 'email', 'input_type' => 'text', 'value' => 'info@classicmotors.com'],
                ['section' => 'footer', 'content_key' => 'phone', 'input_type' => 'text', 'value' => '+1 (555) CLASSIC'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '2026 Classic Motors. All rights reserved.'],
            ];
        }

        $additionalThemeSlots = [
            'autos_modern' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'MODERN AUTOS'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Drive the Future Today'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Explore revolutionary vehicles and redefine your journey.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Browse Cars'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Compare Models'],
                ['section' => 'search', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => 'Search by Keyword...'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Featured Electric & Modern Autos'],
                ['section' => 'compare', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Compare Top Models Head-to-Head'],
                ['section' => 'compare', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Start Your Custom Comparison'],
                ['section' => 'brands', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Driving Innovation with Top Brands'],
                ['section' => 'tech', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Experience Next-Generation Technology'],
                ['section' => 'tech', 'content_key' => 'feature_1_title', 'input_type' => 'text', 'value' => 'Autonomous AI Driving'],
                ['section' => 'tech', 'content_key' => 'feature_1_description', 'input_type' => 'textarea', 'value' => 'Our vehicles are equipped with cutting-edge Level 3+ Autonomy, allowing for supervised self-driving on major highways. Experience a safer, more relaxed commute.'],
                ['section' => 'tech', 'content_key' => 'feature_1_secondary', 'input_type' => 'textarea', 'value' => 'Advanced sensor fusion, real-time mapping, and predictive algorithms ensure unparalleled safety and performance in various conditions.'],
                ['section' => 'tech', 'content_key' => 'feature_1_image', 'input_type' => 'image', 'value' => '/themes/autos/modern/16.webp'],
                ['section' => 'tech', 'content_key' => 'feature_2_title', 'input_type' => 'text', 'value' => 'Hybrid & Electric Powertrains'],
                ['section' => 'tech', 'content_key' => 'feature_2_description', 'input_type' => 'textarea', 'value' => 'Choose from a selection of the most efficient Electric and Hybrid engines. Maximum performance meets minimal environmental impact.'],
                ['section' => 'tech', 'content_key' => 'feature_2_secondary', 'input_type' => 'textarea', 'value' => 'Innovative battery technology provides faster charging, longer range, and a dynamic driving feel, all backed by comprehensive warranties.'],
                ['section' => 'tech', 'content_key' => 'feature_2_image', 'input_type' => 'image', 'value' => '/themes/autos/modern/17.webp'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The future of mobility is here. Driven by technology, fueled by vision.'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '2026 Modern Autos, Inc. All rights reserved.'],
            ],
            'autos_used' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'DriveHub'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Find Your Perfect Used Car Today'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Trusted listings, verified sellers, and transparent pricing. Your next drive starts here.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Browse Catalog'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'How It Works'],
                ['section' => 'filters', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Search Filters'],
                ['section' => 'filters', 'content_key' => 'clear_label', 'input_type' => 'text', 'value' => 'Clear All'],
                ['section' => 'filters', 'content_key' => 'make_label', 'input_type' => 'text', 'value' => 'Make / Brand'],
                ['section' => 'filters', 'content_key' => 'price_label', 'input_type' => 'text', 'value' => 'Price Budget'],
                ['section' => 'filters', 'content_key' => 'mileage_label', 'input_type' => 'text', 'value' => 'Odometer Mileage'],
                ['section' => 'filters', 'content_key' => 'location_label', 'input_type' => 'text', 'value' => 'Location / City'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Featured Listings'],
                ['section' => 'collection', 'content_key' => 'count_label', 'input_type' => 'text', 'value' => 'Vehicles'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No Vehicles Found'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "We couldn't find any used cars matching your current search parameters."],
                ['section' => 'empty', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Reset Filters'],
                ['section' => 'deal', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Deal of the Week!'],
                ['section' => 'deal', 'content_key' => 'badge', 'input_type' => 'text', 'value' => 'SAVE $3,000!'],
                ['section' => 'deal', 'content_key' => 'vehicle_title', 'input_type' => 'text', 'value' => '2021 Hyundai Elantra Limited'],
                ['section' => 'deal', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Low Mileage, Single Owner, Full Service History.'],
                ['section' => 'deal', 'content_key' => 'price', 'input_type' => 'text', 'value' => '$21,995'],
                ['section' => 'deal', 'content_key' => 'original_price', 'input_type' => 'text', 'value' => '$24,995'],
                ['section' => 'deal', 'content_key' => 'image', 'input_type' => 'image', 'value' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600'],
                ['section' => 'deal', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Browse Available Showroom'],
                ['section' => 'dealers', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Trusted Dealers'],
                ['section' => 'dealers', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'We partner with top-rated, verified dealerships to ensure a safe transaction.'],
                ['section' => 'how_it_works', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'How It Works: 3 Simple Steps'],
                ['section' => 'how_it_works', 'content_key' => 'step_1_title', 'input_type' => 'text', 'value' => '1. Search & Filter'],
                ['section' => 'how_it_works', 'content_key' => 'step_1_description', 'input_type' => 'textarea', 'value' => 'Easily find your dream car with our powerful, intuitive search tools.'],
                ['section' => 'how_it_works', 'content_key' => 'step_2_title', 'input_type' => 'text', 'value' => '2. Contact & Schedule'],
                ['section' => 'how_it_works', 'content_key' => 'step_2_description', 'input_type' => 'textarea', 'value' => 'Pick your preferred dealer, schedule a dynamic test-drive with direct financing.'],
                ['section' => 'how_it_works', 'content_key' => 'step_3_title', 'input_type' => 'text', 'value' => '3. Drive Away Happy'],
                ['section' => 'how_it_works', 'content_key' => 'step_3_description', 'input_type' => 'textarea', 'value' => 'Take a test drive, finalize the digital deal, and hit the open road!'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Your trusted marketplace for quality used vehicles.'],
                ['section' => 'footer', 'content_key' => 'email', 'input_type' => 'text', 'value' => 'info@drivehub.com'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '2026 DriveHub Marketplace. All rights reserved.'],
            ],
            'autos_electric' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'EVOLVE'],
                ['section' => 'header', 'content_key' => 'brand_highlight', 'input_type' => 'text', 'value' => 'OLVE'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'The Future is Electric'],
                ['section' => 'hero', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Electric'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Explore revolutionary vehicles and sustainable living. Experience peak performance with zero emissions.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Browse EVs'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Locate Charging'],
                ['section' => 'filters', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Quick Search'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Featured EV Models'],
                ['section' => 'collection', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'EV Models'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No EV Models Match Search'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Adjust price filters or clear the brand search to return to our electric grid.'],
                ['section' => 'empty', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Reset Refinements'],
                ['section' => 'compare', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Compare The Top EVs'],
                ['section' => 'compare', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Top EVs'],
                ['section' => 'charging', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'An Expansive Charging Network'],
                ['section' => 'charging', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Charging Network'],
                ['section' => 'charging', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Never worry about range anxiety. Our marketplace integrates with thousands of Level 2 and DC Fast Charging stations globally. Find, reserve, and pay--all in one app.'],
                ['section' => 'charging', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'View Live Map'],
                ['section' => 'sustainability', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Sustainability Highlights'],
                ['section' => 'sustainability', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Highlights'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Driving the future of sustainable mobility, one electric vehicle at a time.'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '2026 EVOLVE Marketplace. All rights reserved. Powering the electric revolution.'],
            ],
            'events_creative' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'CREATIVENode'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'SYNTHETIC_CULTURE_EXCHANGE // 2026'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Creative\nPulses."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'A curated decentralized architecture for experimental audio-visual modules and algorithmic community assemblies.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Launch Labs'],
                ['section' => 'collection', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'EXPERIMENTAL_EVENT_REGISTRY'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Registry.'],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Our unified decentralized distribution node synchronizes experimental availability from the world's most vibrant hubs."],
                ['section' => 'lab', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'LABORATORY_MANIFESTO'],
                ['section' => 'lab', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Synthetic\nArtistry."],
                ['section' => 'lab', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'We operate on the boundary of bio-digital synthesis. Elevating community interactions through raw algorithmic installations and real-time auditory sync.'],
                ['section' => 'lab', 'content_key' => 'capabilities', 'input_type' => 'textarea', 'value' => 'Synthetizers|Generators|Decentralizers|Transmitters'],
                ['section' => 'sync', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Node Sync Request'],
                ['section' => 'sync', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Transmission pathways are currently active for the autumn cluster. Submit your digital signature for synchronized resonance.'],
                ['section' => 'sync', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Initiate Synchronous Wave'],
                ['section' => 'footer', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'CREATIVE'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's most vibrant distribution node for experimental event modules. Synchronizing creative pulses with global community nodes."],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '(c) 2026 SELLIO_CREATIVE_NODE // PULSE_STABLE'],
            ],
            'events_festival' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'NEONPulse'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'THE_GLOBAL_COLLECTIVE_V8'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Neon\nPulse."],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The most immersive festival experiences on the planet. Curated, authenticated, and distributed via the Sellio Neon network.'],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/events/festival/10.webp'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Explore Lineup'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'Join_The_Pulse'],
                ['section' => 'collection', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'OFFICIAL_FESTIVAL_REGISTRY'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Neon\nStages."],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Our unified protocol synchronizes high-vibe environments across the world's most significant neon nodes."],
                ['section' => 'cta', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'READY_TO_LOSE_CONTROL'],
                ['section' => 'cta', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'The Season is Live.'],
                ['section' => 'cta', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Season'],
                ['section' => 'cta', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The 2026/27 season is officially live. Secure your access to the world's most exclusive high-vibe environments before the node capacity is reached."],
                ['section' => 'cta', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Secure Tickets Now'],
                ['section' => 'footer', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'NEON'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's most immersive distribution node for high-vibe environments. Synchronizing collective pulses with global neon nodes."],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '(c) 2026 SELLIO_NEON_NODE // VIBE_STABLE'],
            ],
            'events_corporate' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'FORUM26'],
                ['section' => 'header', 'content_key' => 'brand_highlight', 'input_type' => 'text', 'value' => '26'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'WORLD_ENGINEERING_SUMMIT // 2026'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "The Future of\nStructural Excellence."],
                ['section' => 'hero', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Structural'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'GET DELEGATE PASS'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'VIEW FULL SCHEDULE'],
                ['section' => 'catalog', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'CONVENTIONS_CATALOG // DIRECTORY'],
                ['section' => 'catalog', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Active Summits & Expos'],
                ['section' => 'speakers', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'FACULTY_SYNC // 2026'],
                ['section' => 'speakers', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Distinguished Speakers'],
                ['section' => 'agenda', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'CURATED_SCHEDULE // DAY_01'],
                ['section' => 'agenda', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'The Agenda'],
                ['section' => 'agenda', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Four tracks of intense technical exploration, ranging from core infrastructure to product design philosophy.'],
                ['section' => 'agenda', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'DOWNLOAD FULL PROGRAM PDF'],
                ['section' => 'cta', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Secure Your\nSeat in History."],
                ['section' => 'cta', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Seat in History.'],
                ['section' => 'cta', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Registration closes September 30. Join 5,000+ industry leaders for the most influential engineering event of the year.'],
                ['section' => 'cta', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'RESERVE MY FORUM PASS'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The premier global assembly for architectural engineering and distributed systems. Shaping the future of technical infrastructure.'],
                ['section' => 'footer', 'content_key' => 'email', 'input_type' => 'text', 'value' => 'support@forum26.com'],
                ['section' => 'footer', 'content_key' => 'location', 'input_type' => 'text', 'value' => 'San Francisco, CA'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 SELLIO_EVENTS_GRP'],
            ],
            'jobs_tech' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'dev_jobs_'],
                ['section' => 'header', 'content_key' => 'brand_prefix', 'input_type' => 'text', 'value' => '>'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Find the best tech jobs\nfor your stack."],
                ['section' => 'hero', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'best tech jobs'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Connecting world-class developers with top-tier tech companies. Skip the recruiters and apply directly to the engineering team.'],
                ['section' => 'search', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => "grep -i 'React OR Go OR Rust'"],
                ['section' => 'search', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Search'],
                ['section' => 'diagnostics', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Recruiting Registry Offline // Engaging Local Backup'],
                ['section' => 'diagnostics', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'A network latency exception was encountered while querying the active recruiting databases. dev_jobs_ has activated localized mock seeds to guarantee uninterrupted professional routing.'],
                ['section' => 'filters', 'content_key' => 'stack_title', 'input_type' => 'text', 'value' => 'Tech Stack'],
                ['section' => 'filters', 'content_key' => 'type_title', 'input_type' => 'text', 'value' => 'Job Type'],
                ['section' => 'filters', 'content_key' => 'location_title', 'input_type' => 'text', 'value' => 'Location'],
                ['section' => 'collection', 'content_key' => 'count_label', 'input_type' => 'text', 'value' => 'developer opportunities'],
                ['section' => 'collection', 'content_key' => 'refresh_label', 'input_type' => 'text', 'value' => './refresh_catalog.sh'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No Developer Jobs Found'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Adjust your grep filters or tags to search alternative developer channels.'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The #1 job board for software engineers, product managers, and data scientists.'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 DevJobs. All rights reserved.'],
            ],
            'jobs_corporate' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'TalentCorp'],
                ['section' => 'header', 'content_key' => 'brand_highlight', 'input_type' => 'text', 'value' => 'Talent'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Advance Your Corporate Career'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Discover premium opportunities at Fortune 500 companies and high-growth enterprises worldwide.'],
                ['section' => 'search', 'content_key' => 'keyword_placeholder', 'input_type' => 'text', 'value' => 'Job title, keywords, or company'],
                ['section' => 'search', 'content_key' => 'location_placeholder', 'input_type' => 'text', 'value' => 'City, state, or Remote'],
                ['section' => 'search', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'Search Jobs'],
                ['section' => 'filters', 'content_key' => 'job_type_title', 'input_type' => 'text', 'value' => 'Job Type'],
                ['section' => 'filters', 'content_key' => 'experience_title', 'input_type' => 'text', 'value' => 'Experience Level'],
                ['section' => 'filters', 'content_key' => 'work_model_title', 'input_type' => 'text', 'value' => 'Work Model'],
                ['section' => 'dashboard', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Get Discovered by Top Employers'],
                ['section' => 'dashboard', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Upload your resume and let recruiters come to you. Track applications in real-time.'],
                ['section' => 'dashboard', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Upload Resume'],
                ['section' => 'dashboard', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'View Tracker'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Recommended for You'],
                ['section' => 'collection', 'content_key' => 'sort_relevant_label', 'input_type' => 'text', 'value' => 'Sort by: Most Relevant'],
                ['section' => 'collection', 'content_key' => 'sort_recent_label', 'input_type' => 'text', 'value' => 'Sort by: Most Recent'],
                ['section' => 'collection', 'content_key' => 'sort_salary_label', 'input_type' => 'text', 'value' => 'Sort by: Salary (High to Low)'],
                ['section' => 'collection', 'content_key' => 'load_more_label', 'input_type' => 'text', 'value' => 'Load More Results'],
                ['section' => 'sync', 'content_key' => 'offline_kicker', 'input_type' => 'text', 'value' => 'Job Sync Offline'],
                ['section' => 'sync', 'content_key' => 'offline_title', 'input_type' => 'text', 'value' => 'Recommended jobs could not be loaded.'],
                ['section' => 'empty', 'content_key' => 'kicker', 'input_type' => 'text', 'value' => 'Empty Job Registry'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No live jobs are published yet.'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Add job records in the backend and this corporate listing will hydrate automatically.'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Empowering professionals and leading enterprises to connect seamlessly.'],
                ['section' => 'footer', 'content_key' => 'subscribe_title', 'input_type' => 'text', 'value' => 'Subscribe'],
                ['section' => 'footer', 'content_key' => 'subscribe_description', 'input_type' => 'textarea', 'value' => 'Get daily job alerts.'],
                ['section' => 'footer', 'content_key' => 'email_placeholder', 'input_type' => 'text', 'value' => 'Email'],
                ['section' => 'footer', 'content_key' => 'subscribe_button_label', 'input_type' => 'text', 'value' => 'Subscribe'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 TalentCorp Inc. All rights reserved.'],
            ],
            'ecommerce_default' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'SELLIOShop'],
                ['section' => 'header', 'content_key' => 'brand_highlight', 'input_type' => 'text', 'value' => 'Shop'],
                ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'SUMMER_COLLECTION_2026_V8'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Refined\nEssentials for\nModern Life."],
                ['section' => 'hero', 'content_key' => 'highlight', 'input_type' => 'text', 'value' => 'Modern Life.'],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Discover a curated selection of premium garments designed with a focus on silhouette, material, and enduring quality.'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Shop Collection'],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/ecommerce/default/9.webp'],
                ['section' => 'hero', 'content_key' => 'feature_eyebrow', 'input_type' => 'text', 'value' => 'FEATURED_NODE'],
                ['section' => 'hero', 'content_key' => 'feature_title', 'input_type' => 'text', 'value' => 'Technical_Shell_v4'],
                ['section' => 'collection', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'CURATED_PRODUCT_REGISTRY'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "New\nArrivals."],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "Our unified protocol synchronizes product availability from the world's most significant garment nodes."],
                ['section' => 'sync', 'content_key' => 'offline_kicker', 'input_type' => 'text', 'value' => 'PRODUCT_SYNC_OFFLINE'],
                ['section' => 'sync', 'content_key' => 'offline_title', 'input_type' => 'text', 'value' => 'Products could not be synchronized.'],
                ['section' => 'empty', 'content_key' => 'kicker', 'input_type' => 'text', 'value' => 'EMPTY_PRODUCT_REGISTRY'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No live products are available yet.'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Add product records in the backend and this collection will hydrate automatically.'],
                ['section' => 'newsletter', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'JOIN_THE_COLLECTIVE'],
                ['section' => 'newsletter', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "Stay In\nThe Loop."],
                ['section' => 'newsletter', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Join our collective and be the first to know about new collection drops, exclusive events, and seasonal sales.'],
                ['section' => 'newsletter', 'content_key' => 'placeholder', 'input_type' => 'text', 'value' => 'ENTER_EMAIL_NODE'],
                ['section' => 'newsletter', 'content_key' => 'button_label', 'input_type' => 'text', 'value' => 'SUBSCRIBE'],
                ['section' => 'footer', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'SELLIO'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => "The world's most advanced transaction protocol for high-fidelity retail. Synchronizing refined essentials with global distribution nodes."],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 SELLIO_SHOP // TRANSACTION_SYNC_STABLE'],
            ],
            'ecommerce_electronics' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'NEURALGEAR'],
                ['section' => 'header', 'content_key' => 'brand_highlight', 'input_type' => 'text', 'value' => 'GEAR'],
                ['section' => 'header', 'content_key' => 'search_placeholder', 'input_type' => 'text', 'value' => 'Search components, devices...'],
                ['section' => 'hero', 'content_key' => 'badge', 'input_type' => 'text', 'value' => 'NEXT GEN RELEASE'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "QUANTUM\nPERFORMANCE"],
                ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Experience untethered speed with the all-new line of RTX 50-Series Architecture. Built for the creators of tomorrow.'],
                ['section' => 'hero', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/ecommerce/electronics/29.webp'],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Shop Now'],
                ['section' => 'hero', 'content_key' => 'secondary_cta_label', 'input_type' => 'text', 'value' => 'View Specs'],
                ['section' => 'diagnostics', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'DATABASE CONNECTION WARNING'],
                ['section' => 'diagnostics', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'The dynamic Laravel API database is currently offline. Activating premium local node resilience fallback.'],
                ['section' => 'trending', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'TRENDING HARDWARE'],
                ['section' => 'promo', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'BUILD YOUR DREAM PC'],
                ['section' => 'promo', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Use our interactive 3D configurator to ensure 100% compatibility and visualize your custom rig before you buy.'],
                ['section' => 'promo', 'content_key' => 'image', 'input_type' => 'image', 'value' => '/themes/ecommerce/electronics/30.webp'],
                ['section' => 'promo', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Launch Configurator'],
                ['section' => 'peripherals', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'PRO PERIPHERALS'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Next-generation hardware for builders, gamers, and creators. Power your future.'],
                ['section' => 'footer', 'content_key' => 'newsletter_title', 'input_type' => 'text', 'value' => 'Newsletter'],
                ['section' => 'footer', 'content_key' => 'newsletter_description', 'input_type' => 'textarea', 'value' => 'Get updates on latest drops and tech news.'],
                ['section' => 'footer', 'content_key' => 'email_placeholder', 'input_type' => 'text', 'value' => 'Email Address'],
                ['section' => 'footer', 'content_key' => 'subscribe_label', 'input_type' => 'text', 'value' => '→'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 NeuralGear Electronics. All rights reserved.'],
            ],
            'ecommerce_luxury' => [
                ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => 'AURELIA'],
                ['section' => 'hero', 'content_key' => 'subtitle', 'input_type' => 'text', 'value' => 'The High Jewelry Collection'],
                ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'textarea', 'value' => "CELESTIAL\nELEGANCE"],
                ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Discover the Collection'],
                ['section' => 'collection', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Signature Creations'],
                ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Exquisite craftsmanship meets timeless design'],
                ['section' => 'collection', 'content_key' => 'product_cta_label', 'input_type' => 'text', 'value' => 'View Piece'],
                ['section' => 'collection', 'content_key' => 'view_all_label', 'input_type' => 'text', 'value' => 'View All Masterpieces'],
                ['section' => 'sync', 'content_key' => 'offline_kicker', 'input_type' => 'text', 'value' => 'Collection Sync Offline'],
                ['section' => 'sync', 'content_key' => 'offline_title', 'input_type' => 'text', 'value' => 'Signature creations could not be loaded.'],
                ['section' => 'empty', 'content_key' => 'kicker', 'input_type' => 'text', 'value' => 'Private Catalog'],
                ['section' => 'empty', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'No live masterpieces are published yet.'],
                ['section' => 'empty', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Add product records in the backend and this showcase will hydrate automatically.'],
                ['section' => 'story', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Artistry in Every Detail'],
                ['section' => 'story', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'For over a century, our master artisans have poured their passion into every facet. We source only the rarest gems, setting them in designs that transcend time and trend. Experience the weight of true luxury.'],
                ['section' => 'story', 'content_key' => 'cta_label', 'input_type' => 'text', 'value' => 'Explore Our Heritage'],
                ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Subscribe to receive updates on exclusive collections, private events, and our latest creations.'],
                ['section' => 'footer', 'content_key' => 'email_placeholder', 'input_type' => 'text', 'value' => 'Email Address'],
                ['section' => 'footer', 'content_key' => 'subscribe_label', 'input_type' => 'text', 'value' => 'Subscribe'],
                ['section' => 'footer', 'content_key' => 'copyright', 'input_type' => 'text', 'value' => '© 2026 Aurelia Maison. All Rights Reserved.'],
            ],
        ];

        if (isset($additionalThemeSlots[$themeKey])) {
            return $additionalThemeSlots[$themeKey];
        }

        return [
            ['section' => 'header', 'content_key' => 'brand_label', 'input_type' => 'text', 'value' => config('app.name', 'Sellio')],
            ['section' => 'hero', 'content_key' => 'eyebrow', 'input_type' => 'text', 'value' => 'Featured Marketplace'],
            ['section' => 'hero', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'Discover What Matters'],
            ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'A curated storefront experience powered by Sellio.'],
            ['section' => 'hero', 'content_key' => 'primary_cta_label', 'input_type' => 'text', 'value' => 'Explore'],
            ['section' => 'collection', 'content_key' => 'heading', 'input_type' => 'text', 'value' => 'Featured Listings'],
            ['section' => 'collection', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Browse the latest verified marketplace records.'],
            ['section' => 'testimonials', 'content_key' => 'title', 'input_type' => 'text', 'value' => 'What Customers Say'],
            ['section' => 'footer', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'A premium marketplace storefront powered by Sellio.'],
        ];
    }
}
