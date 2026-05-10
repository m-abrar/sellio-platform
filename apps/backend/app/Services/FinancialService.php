<?php

namespace App\Services;

use App\Models\LineItem;
use Illuminate\Database\Eloquent\Collection;

class FinancialService
{
    /**
     * Retrieve all active line item templates ordered by preference.
     *
     * @return Collection
     */
    public function getActiveTemplates(): Collection
    {
        return LineItem::where('status', 'active')
            ->orderBy('order')
            ->get();
    }

    /**
     * Create a new line item template.
     *
     * @param array $data
     * @return LineItem
     */
    public function createTemplate(array $data): LineItem
    {
        return LineItem::create($data);
    }

    /**
     * Update an existing line item template.
     *
     * @param LineItem $lineItem
     * @param array $data
     * @return bool
     */
    public function updateTemplate(LineItem $lineItem, array $data): bool
    {
        return $lineItem->update($data);
    }

    /**
     * Delete a line item template.
     *
     * @param LineItem $lineItem
     * @return bool|null
     */
    public function deleteTemplate(LineItem $lineItem): ?bool
    {
        return $lineItem->delete();
    }
}
