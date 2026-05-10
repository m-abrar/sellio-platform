<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkUpdateContentRequest;
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
}
