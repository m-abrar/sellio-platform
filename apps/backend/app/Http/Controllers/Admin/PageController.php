<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index($type = 'page')
    {
        $pages = Page::where('type', $type)->latest()->paginate(10);
        return view('admin.pages.index', compact('pages', 'type'));
    }

    public function create()
    {
        $page = new Page();
        $headers = Page::where('type', 'header')->get();
        $footers = Page::where('type', 'footer')->get();
        return view('admin.pages.form', compact('page', 'headers', 'footers'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:pages,title',
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'type' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'header_id' => 'nullable|exists:pages,id',
            'footer_id' => 'nullable|exists:pages,id',
            'status' => 'required|in:active,inactive',
        ]);

        $page = Page::create($request->all());

        return redirect()->route('admin.pages.edit', $page->id)->with('success', 'Page added successfully.');
    }

    public function edit(Page $page)
    {
        $headers = Page::where('type', 'header')->get();
        $footers = Page::where('type', 'footer')->get();
        return view('admin.pages.form', compact('page', 'headers', 'footers'));
    }

    public function update(Request $request, Page $page)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:pages,title,' . $page->id,
            'slug' => 'nullable|string|max:255|regex:/^[a-z0-9-]+$/',
            'type' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'header_id' => 'nullable|exists:pages,id',
            'footer_id' => 'nullable|exists:pages,id',
            'status' => 'required|in:active,inactive',
        ]);

        $page->update($request->all());

        return redirect()->route('admin.pages.index')->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return redirect()->route('admin.pages.index')->with('success', 'Page deleted successfully.');
    }
}
