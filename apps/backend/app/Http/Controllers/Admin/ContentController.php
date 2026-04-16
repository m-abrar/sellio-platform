<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Services\ContentService;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    // Define the media collection name used for 'file' or 'image' type content
    protected const FILE_COLLECTION = 'page_content'; 

    // --- Custom Ordering Definitions ---

    // Define the section groups for primary sorting (Group 1: Top, Group 3: Bottom)
    protected const TOP_SECTIONS = ['header', 'hero'];
    protected const BOTTOM_SECTIONS = ['footer'];

    // Define the custom order patterns for specific content keys.
    // The lower the number, the higher the priority.
    // NOTE: This logic now correctly assumes the content key column is named 'content_key'
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
    
    // --- Controller Methods ---

    public function index()
    {
        // Fetch all unique page/theme combinations that have content entries.
        // This acts as the list of "content management locations".
        $contentPages = PageContent::select('page', 'theme_key')
            ->distinct()
            ->orderBy('page')
            ->orderBy('theme_key')
            ->get();

        // Fetch all unique theme keys (helpful for filtering/display)
        $themeKeys = PageContent::select('theme_key')->distinct()->pluck('theme_key');

        return view('admin.content.index', [
            'contentPages' => $contentPages,
            'themeKeys' => $themeKeys,
        ]);
    }
    
    // Fetches all content for the selected page and groups it by section
    public function editPage(Request $request, string $page, string $theme_key = null)
    {
        $activeTheme = $theme_key ?? $request->themeKey;
        
        $topSections = self::TOP_SECTIONS;
        $bottomSections = self::BOTTOM_SECTIONS;
        $keyPatterns = self::KEY_ORDER_PATTERNS;

        // 1. Build the Primary Section Sorting CASE (Groups 1, 2, 3)
        // Groups: 1 (Top), 2 (Middle), 3 (Bottom)
        $sectionCaseSql = "CASE 
            WHEN section IN ('" . implode("','", $topSections) . "') THEN 1
            WHEN section IN ('" . implode("','", $bottomSections) . "') THEN 3
            ELSE 2
        END";

        // 2. Build the Content Key Sorting CASE (Uses LIKE)
        $keyCaseClauses = [];
        foreach ($keyPatterns as $orderValue => $pattern) {
            // *** CORRECTED: Using `content_key` as per the migration ***
            $keyCaseClauses[] = "WHEN `content_key` LIKE '{$pattern}' THEN {$orderValue}";
        }
        
        // Items not matching any pattern will get a high number (999) to appear later.
        $keyCaseSql = "CASE " . implode(' ', $keyCaseClauses) . " ELSE 999 END";


        $settings = PageContent::where('theme_key', $activeTheme)
            ->where('page', $page)
            
            // 1ST LEVEL SORT: Section Grouping (1, 2, 3)
            ->orderByRaw($sectionCaseSql) 
            
            // 2ND LEVEL SORT: Specific Section Order ('header' then 'hero', then everything else, then 'footer')
            ->orderByRaw("FIELD(section, 'header', 'hero', 'footer')") 
            
            // 3RD LEVEL SORT: Content Key Ordering (10, 20, 30, etc.)
            ->orderByRaw($keyCaseSql)
            
            // 4TH LEVEL SORT: Secondary alphabetical sort for any ties or unlisted items (Middle Group 2)
            // *** CORRECTED: Using `content_key` as per the migration ***
            ->orderBy('section') 
            ->orderBy('content_key')
            ->get();
            
        return view('admin.content.edit-page', [
            'page' => $page,
            'theme_key' => $activeTheme,
            'settings' => $settings->groupBy('section'), // Group by section for presentation
        ]);
    }

    // Handles the form submission (Bulk Update)
    public function bulkUpdate(Request $request, ContentService $contentService)
    {
        // 1. Handle Text/Basic Inputs (submitted via name="values[id]")
        foreach ($request->input('values', []) as $id => $newValue) {
            $setting = PageContent::find($id);

            if ($setting && $setting->value !== $newValue) {
                // Only update the value if it's not a file/image field, 
                // assuming those are handled by AJAX components.
                if ($setting->input_type !== 'file' && $setting->input_type !== 'image') {
                    $setting->value = $newValue;
                    $setting->save();
                    $contentService->forgetCache($setting); // Clear cache
                }
            }
        }
        
        // 2. File uploads are skipped entirely, as they are handled by the AJAX component.

        return redirect()->back()->with('success', 'Content saved successfully!');
    }
}
