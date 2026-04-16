<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    public function index()
    {
        $templates = EmailTemplate::all();
        return view('admin.email-templates.index', compact('templates'));
    }

    public function edit(string $id)
    {
        $template = EmailTemplate::findOrFail($id);
        return view('admin.email-templates.edit', compact('template'));
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $template = EmailTemplate::findOrFail($id);
        $template->update([
            'subject' => $request->subject,
            'body' => $request->body,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.email-templates.index')->with('success', 'Email template updated successfully.');
    }

    public function create() { abort(404); }
    public function store(Request $request) { abort(404); }
    public function show(string $id) { abort(404); }
    public function destroy(string $id) { abort(404); }
}
