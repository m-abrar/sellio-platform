<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Language;
use Illuminate\Support\Facades\File;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $languages = Language::all();
        return view('admin.languages.index', compact('languages'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.languages.form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:languages',
            'flag_icon' => 'nullable|string|max:255',
        ]);

        $language = Language::create($request->all());

        // Clone en.json to the new language file
        $enPath = base_path('lang/en.json');
        $newPath = $language->getTranslationFilePath();

        if (File::exists($enPath)) {
            File::copy($enPath, $newPath);
        } else {
            File::put($newPath, json_encode([], JSON_PRETTY_PRINT));
        }

        return redirect()->route('admin.languages.index')->with('success', 'Language created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Language $language)
    {
        return view('admin.languages.form', compact('language'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Language $language)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:languages,code,' . $language->id,
            'flag_icon' => 'nullable|string|max:255',
        ]);

        $oldPath = $language->getTranslationFilePath();
        $language->update($request->all());
        $newPath = $language->getTranslationFilePath();

        if ($oldPath !== $newPath && File::exists($oldPath)) {
            File::move($oldPath, $newPath);
        }

        return redirect()->route('admin.languages.index')->with('success', 'Language updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Language $language)
    {
        if ($language->is_default) {
            return redirect()->back()->with('error', 'Cannot delete the default language.');
        }

        $path = $language->getTranslationFilePath();
        if (File::exists($path)) {
            File::delete($path);
        }

        $language->delete();
        return redirect()->route('admin.languages.index')->with('success', 'Language deleted successfully.');
    }

    /**
     * Show translations for the language.
     */
    public function translations(Language $language)
    {
        $translations = $language->getTranslations();
        return view('admin.languages.translations', compact('language', 'translations'));
    }

    /**
     * Update translations for the language.
     */
    public function updateTranslations(Request $request, Language $language)
    {
        $translations = $request->input('translations', []);
        $path = $language->getTranslationFilePath();

        File::put($path, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return redirect()->back()->with('success', 'Translations updated successfully.');
    }
}
