<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
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
        $contentPages = PageContent::select('page', 'theme_key')
            ->distinct()
            ->orderBy('page')
            ->orderBy('theme_key')
            ->get();

        $themeKeys = PageContent::select('theme_key')->distinct()->pluck('theme_key');

        return view('admin.content.index', [
            'contentPages' => $contentPages,
            'themeKeys'    => $themeKeys,
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
        
        // Build the Primary Section Sorting CASE (Groups 1: Top, 2: Middle, 3: Bottom)
        $sectionCaseSql = "CASE 
            WHEN section IN ('" . implode("','", self::TOP_SECTIONS) . "') THEN 1
            WHEN section IN ('" . implode("','", self::BOTTOM_SECTIONS) . "') THEN 3
            ELSE 2
        END";

        // Build the Content Key Sorting CASE based on semantic patterns (Heading -> Subheading -> Paragraph)
        $keyCaseClauses = [];
        foreach (self::KEY_ORDER_PATTERNS as $orderValue => $pattern) {
            $keyCaseClauses[] = "WHEN `content_key` LIKE '{$pattern}' THEN {$orderValue}";
        }
        $keyCaseSql = "CASE " . implode(' ', $keyCaseClauses) . " ELSE 999 END";

        $settings = PageContent::where('theme_key', $activeTheme)
            ->where('page', $page)
            ->orderByRaw($sectionCaseSql) 
            ->orderByRaw("FIELD(section, 'header', 'hero', 'footer')") 
            ->orderByRaw($keyCaseSql)
            ->orderBy('section') 
            ->orderBy('content_key')
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
    public function bulkUpdate(Request $request, ContentService $contentService): RedirectResponse
    {
        foreach ($request->input('values', []) as $id => $newValue) {
            $setting = PageContent::find($id);

            if ($setting && $setting->value !== $newValue) {
                // Exclude media fields from bulk text update
                if ($setting->input_type !== 'file' && $setting->input_type !== 'image') {
                    $setting->value = $newValue;
                    $setting->save();
                    
                    // Clear runtime cache to reflect changes immediately
                    $contentService->forgetCache($setting);
                }
            }
        }
        
        return redirect()->back()->with('success', __('Content saved successfully!'));
    }
}
