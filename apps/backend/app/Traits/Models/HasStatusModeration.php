<?php

namespace App\Traits\Models;

use Illuminate\Database\Eloquent\Builder;

/**
 * Trait HasStatusModeration
 * 
 * Provides a standardized way to handle moderation status and UI badge metadata
 * across different marketplace entities.
 */
trait HasStatusModeration
{
    /**
     * Get a standardized status metadata object for UI rendering.
     * 
     * @return array
     */
    public function getStatusMeta(): array
    {
        // Fallback for models using boolean 'is_published' / 'approved_at' logic
        if (!isset($this->status)) {
            if ($this->is_published && $this->approved_at) {
                return ['label' => 'Active', 'color' => 'success', 'icon' => 'check-circle'];
            }
            if ($this->is_published && !$this->approved_at) {
                return ['label' => 'Pending', 'color' => 'warning', 'icon' => 'clock'];
            }
            return ['label' => 'Draft', 'color' => 'secondary', 'icon' => 'pencil-alt'];
        }

        // Standard string-based status logic
        return match ($this->status) {
            'active', 'approved', 'published' => ['label' => ucfirst($this->status), 'color' => 'success', 'icon' => 'check-circle'],
            'pending', 'review', 'scheduled' => ['label' => ucfirst($this->status), 'color' => 'warning', 'icon' => 'clock'],
            'inactive', 'draft', 'closed'    => ['label' => ucfirst($this->status), 'color' => 'secondary', 'icon' => 'pencil-alt'],
            'rejected', 'expired', 'canceled' => ['label' => ucfirst($this->status), 'color' => 'danger', 'icon' => 'times-circle'],
            'premium', 'elite'               => ['label' => ucfirst($this->status), 'color' => 'primary', 'icon' => 'star'],
            default                          => ['label' => ucfirst($this->status), 'color' => 'dark', 'icon' => 'info-circle'],
        };
    }

    /**
     * Scope a query to only include active records.
     */
    public function scopeOnlyActive(Builder $query): Builder
    {
        if (isset($this->status)) {
            return $query->where('status', 'active');
        }
        
        return $query->where('is_published', true)->whereNotNull('approved_at');
    }
}
