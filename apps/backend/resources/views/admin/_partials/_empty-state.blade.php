{{--
    Premium Empty State Table Row
    
    This partial renders a high-fidelity "No Data" visual for administrative tables.
    It encapsulates the logic for spans, iconography, and quick-action buttons
    to maintain a polished experience even when registries are unpopulated.
    
    @param int $colspan The number of columns to span across.
    @param string $icon (Optional) FontAwesome icon class.
    @param string $title (Optional) Primary headline text.
    @param string $description (Optional) Supporting subtext.
    @param string $button_text (Optional) CTA button label.
    @param string $button_link (Optional) CTA button destination URL.
--}}
<tr class="empty-state-container">
    <td colspan="{{ $colspan ?? 10 }}" class="py-5">
        <x-premium-empty-state 
            :icon="$icon ?? 'fas fa-database'"
            :title="$title ?? 'No records found.'"
            :description="$description ?? 'There are currently no items in this registry. Initialize your first entry to get started.'"
            :actionText="$button_text ?? null"
            :actionUrl="$button_link ?? null"
        />
    </td>
</tr>

<style>
    .empty-state-container {
        border: none !important;
    }
    .empty-state-container td {
        border: none !important;
        background: transparent !important;
    }
</style>
