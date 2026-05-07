<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * Class EmailTemplateController
 * Manages the administrative oversight and customization of system-wide 
 * transactional email templates (e.g., Welcome emails, Order confirmations).
 */
class EmailTemplateController extends Controller
{
    /**
     * Display a listing of all system-registered email templates.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $templates = EmailTemplate::all();
        return view('admin.email-templates.index', compact('templates'));
    }

    /**
     * Show the form for editing a specific system email template.
     *
     * @param  \App\Models\EmailTemplate  $emailTemplate
     * @return \Illuminate\View\View
     */
    public function edit(EmailTemplate $emailTemplate): View
    {
        return view('admin.email-templates.edit', ['template' => $emailTemplate]);
    }

    /**
     * Update the content and configuration of a system email template.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\EmailTemplate  $emailTemplate
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, EmailTemplate $emailTemplate): RedirectResponse
    {
        $request->validate([
            'subject'   => 'required|string|max:255',
            'body'      => 'required|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $emailTemplate->update([
            'subject'   => $request->input('subject'),
            'body'      => $request->input('body'),
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()->route('admin.email-templates.index')
                         ->with('success', __('Email template updated successfully.'));
    }

    /**
     * Prohibited: Manual creation of system email templates is restricted.
     */
    public function create(): never { abort(404); }

    /**
     * Prohibited: Manual storage of system email templates is restricted.
     */
    public function store(Request $request): never { abort(404); }

    /**
     * Prohibited: Standalone display of system email templates is restricted.
     */
    public function show(EmailTemplate $emailTemplate): never { abort(404); }

    /**
     * Prohibited: Deletion of system-critical email templates is restricted.
     */
    public function destroy(EmailTemplate $emailTemplate): never { abort(404); }
}
