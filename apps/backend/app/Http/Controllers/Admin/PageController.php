<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class PageController
 * Orchestrates the administrative lifecycle of CMS pages, managing metadata, 
 * layout associations (Headers/Footers), and publishing states across the platform.
 */
class PageController extends Controller
{
    /**
     * Display a filtered listing of CMS pages by type (page, header, footer).
     *
     * @param  string  $type
     * @return \Illuminate\View\View
     */
    public function index(string $type = 'page'): View
    {
        $pages = Page::where('type', $type)->latest()->paginate(10);
        return view('admin.pages.index', compact('pages', 'type'));
    }

    /**
     * Show the form for creating a new CMS page or layout component.
     *
     * @return \Illuminate\View\View
     */
    public function create(): View
    {
        $page = new Page();
        $headers = Page::where('type', 'header')->get();
        $footers = Page::where('type', 'footer')->get();
        
        return view('admin.pages.form', compact('page', 'headers', 'footers'));
    }

    /**
     * Store a newly created CMS page and its layout associations.
     *
     * @param  \App\Http\Requests\Admin\PageRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(PageRequest $request): RedirectResponse
    {
        $page = Page::create($request->validated());

        return redirect()->route('admin.pages.edit', $page->id)
            ->with('success', __('Page created successfully.'));
    }

    /**
     * Show the form for editing an existing CMS page.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\View\View
     */
    public function edit(Page $page): View
    {
        $headers = Page::where('type', 'header')->get();
        $footers = Page::where('type', 'footer')->get();
        
        return view('admin.pages.form', compact('page', 'headers', 'footers'));
    }

    /**
     * Update an existing CMS page configuration and its layout mapping.
     *
     * @param  \App\Http\Requests\Admin\PageRequest  $request
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(PageRequest $request, Page $page): RedirectResponse
    {
        $page->update($request->validated());

        return redirect()->route('admin.pages.index')
            ->with('success', __('Page updated successfully.'));
    }

    /**
     * Remove a CMS page or layout component from the database.
     *
     * @param  \App\Models\Page  $page
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();
        
        return redirect()->route('admin.pages.index')
            ->with('success', __('Page deleted successfully.'));
    }
}
