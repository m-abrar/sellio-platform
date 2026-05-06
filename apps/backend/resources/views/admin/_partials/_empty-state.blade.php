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
