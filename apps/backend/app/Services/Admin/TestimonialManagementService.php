<?php

namespace App\Services\Admin;

use App\Models\Testimonial;

class TestimonialManagementService
{
    public function saveTestimonial(array $data, ?Testimonial $testimonial = null): Testimonial
    {
        $themeAssignments = $data['themes'] ?? [];
        unset($data['themes']);

        $testimonial = $testimonial ?? new Testimonial();
        $testimonial->fill($data);
        $testimonial->save();

        $testimonial->themes()->sync($this->normalizeThemeAssignments($themeAssignments));

        return $testimonial;
    }

    protected function normalizeThemeAssignments(array $themeAssignments): array
    {
        $sync = [];

        foreach ($themeAssignments as $themeId => $assignment) {
            if (empty($assignment['enabled'])) {
                continue;
            }

            $sync[(int) $themeId] = [
                'priority' => (int) ($assignment['priority'] ?? 0),
                'is_featured' => ! empty($assignment['is_featured']),
            ];
        }

        return $sync;
    }
}
