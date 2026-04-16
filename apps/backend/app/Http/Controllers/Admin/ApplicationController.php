<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Application, Setting};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Cache};

class ApplicationController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Application::class);
        $applications = Application::all();
        return view('admin.applications.index', compact('applications'));
    }

    public function edit(Application $application)
    {
        $this->authorize('update', $application);
        return view('admin.applications.edit', compact('application'));
    }

    public function update(Request $request, Application $application)
    {
        $this->authorize('update', $application);
        
        $data = $request->validate([
            'vertical' => 'nullable|string',
            'variables' => 'nullable|array',
            'config' => 'nullable|array',
        ]);

        $application->update($data);

        Cache::forget('active_app_data');

        return redirect()->route('admin.applications.index')
            ->with('success', __('Application updated.'));
    }

    public function activate(Application $application)
    {
        $this->authorize('activate', $application);

        DB::transaction(function () use ($application) {
            Application::query()->update(['is_active' => false]);
            $application->update(['is_active' => true]);

            Setting::updateOrCreate(
                ['key' => 'site_home'],
                ['value' => $application->app_key]
            );
        });

        Cache::forget('active_app_data');

        return redirect()->route('admin.applications.index')
            ->with('success', __('Application activated.'));
    }
}
