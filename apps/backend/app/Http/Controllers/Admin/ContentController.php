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
    public function index(): View
    {
        foreach (['properties_classic', 'events_music', 'ecommerce_fashion', 'services_marketplace', 'autos_luxury', 'jobs_startup', 'classifieds_general', 'events_classic', 'autos_classic'] as $themeKey) {
            $this->ensureStructuredSlots($themeKey, 'home');
        }

        $contentPages = PageContent::select('page', 'theme_key')
            ->selectRaw('COUNT(*) as slots_count')
            ->selectRaw('MAX(updated_at) as latest_update')
            ->distinct()
            ->groupBy('page', 'theme_key')
            ->orderBy('page')
            ->orderBy('theme_key')
            ->get();

        $themeKeys = PageContent::select('theme_key')->distinct()->pluck('theme_key');
        $themes = Theme::whereIn('theme_key', $themeKeys)->get()->keyBy('theme_key');

        return view('admin.content.index', [
            'contentPages' => $contentPages,
            'themeKeys'    => $themeKeys,
            'themes'       => $themes,
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
