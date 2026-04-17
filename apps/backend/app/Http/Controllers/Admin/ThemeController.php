<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Theme, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Cache};

class ThemeController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Theme::class);
        $themes = Theme::orderBy('order')->get();
        return view('admin.themes.index', compact('themes'));
    }

    public function edit(Theme $theme)
    {
        $this->authorize('update', $theme);
        return view('admin.themes.edit', compact('theme'));
    }

    public function update(Request $request, Theme $theme)
    {
        $this->authorize('update', $theme);

        $data = $request->validate([
            'vertical'  => 'nullable|string',
            'variables' => 'nullable|array',
            'config'    => 'nullable|array',
        ]);

        $theme->update($data);

        Cache::forget('active_theme_data');

        return redirect()->route('admin.themes.index')
            ->with('success', __('Theme updated.'));
    }

    public function activate(Theme $theme)
    {
        $this->authorize('activate', $theme);

        DB::transaction(function () use ($theme) {
            Theme::query()->update(['is_active' => false]);
            $theme->update(['is_active' => true]);

            Setting::updateOrCreate(
                ['key' => 'site_home'],
                ['value' => $theme->theme_key]
            );
        });

        Cache::forget('active_theme_data');

        return redirect()->route('admin.themes.index')
            ->with('success', __('Theme activated.'));
    }
}
