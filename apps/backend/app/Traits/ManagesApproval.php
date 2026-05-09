<?php

namespace App\Traits;

use Illuminate\Http\RedirectResponse;
use Carbon\Carbon;

trait ManagesApproval
{
    /**
     * Approve the listing.
     * Assumes the model has 'approved_at' and 'is_published' fields.
     */
    public function approve($id): RedirectResponse
    {
        // SECURITY: Critical Authorization Check
        if (!auth()->check() || !auth()->user()->hasRole('super-admin')) {
            abort(403, __('Unauthorized: You do not have permission to moderate listings.'));
        }

        $model = $this->resolveModel($id);

        if (!$model) {
            return back()->with('error', __('Listing not found.'));
        }

        $model->update([
            'approved_at'  => Carbon::now(),
            'is_published' => true,
        ]);

        return back()->with('success', __('Listing #:id has been approved and published.', ['id' => $id]));
    }

    /**
     * Disapprove the listing (send back to pending).
     */
    public function disapprove($id): RedirectResponse
    {
        // SECURITY: Critical Authorization Check
        if (!auth()->check() || !auth()->user()->hasRole('super-admin')) {
            abort(403, __('Unauthorized: You do not have permission to moderate listings.'));
        }

        $model = $this->resolveModel($id);

        if (!$model || !$model->approved_at) {
            return back()->with('error', __('Listing not found or already in pending status.'));
        }

        $model->update([
            'approved_at'  => null,
            'is_published' => false,
        ]);

        return back()->with('success', __('Listing #:id has been moved to pending status.', ['id' => $id]));
    }

    /**
     * Helper to resolve the model instance.
     * Each controller can override this if needed.
     */
    protected function resolveModel($id)
    {
        // Try to find the model based on the controller's main model property
        // or by guessing the model name from the controller name.
        if (property_exists($this, 'modelClass')) {
            return ($this->modelClass)::find($id);
        }

        // Fallback: This requires the controller or the model to be resolved via Route Model Binding
        // usually, but here we treat it manually for generic action routing.
        return null;
    }
}
