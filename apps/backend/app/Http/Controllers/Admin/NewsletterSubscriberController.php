<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterSubscriberController extends Controller
{
    public function index()
    {
        $subscribers = NewsletterSubscriber::latest()->paginate(15);

        return view('admin.newsletter-subscribers.index', compact('subscribers'));
    }

    public function export()
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=subscribers_" . date('Y-m-d') . ".csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $subscribers = NewsletterSubscriber::all();

        $callback = function() use ($subscribers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Email', 'Source', 'Confirmed', 'Created At']);

            foreach ($subscribers as $subscriber) {
                fputcsv($file, [
                    $subscriber->id,
                    $subscriber->email,
                    $subscriber->source ?? 'Main Website',
                    $subscriber->is_confirmed ? 'Yes' : 'No',
                    $subscriber->created_at ? $subscriber->created_at->format('Y-m-d H:i:s') : ''
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function create()
    {
        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('info', 'Newsletter subscribers are added via the front-end only.');
    }

    public function store(Request $request)
    {
        // Intentionally left blank as subscribers are typically created via the front-end
    }

    public function show(NewsletterSubscriber $newsletterSubscriber)
    {
        return view('admin.newsletter-subscribers.show', compact('newsletterSubscriber'));
    }

    public function edit(NewsletterSubscriber $newsletterSubscriber)
    {
        return view('admin.newsletter-subscribers.form', compact('newsletterSubscriber'));
    }

    public function update(Request $request, NewsletterSubscriber $newsletterSubscriber)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|unique:newsletter_subscribers,email,' . $newsletterSubscriber->id,
            'is_confirmed' => 'sometimes|boolean',
            'source' => 'nullable|string|max:255',
        ]);

        $newsletterSubscriber->update($validatedData);

        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('success', 'Subscriber updated successfully.');
    }

    public function destroy(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->delete();

        return redirect()->route('admin.newsletter-subscribers.index')
                         ->with('success', 'Subscriber deleted successfully.');
    }
}
