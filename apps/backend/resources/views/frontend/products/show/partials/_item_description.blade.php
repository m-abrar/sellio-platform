<h4 class="fw-bold mt-4 mb-3">Item Description</h4>
{{-- The full description is generally one field, use line breaks to separate paragraphs --}}
<p class="text-muted">{!! nl2br(e($classified->description)) !!}</p>

{{-- Key Details List --}}
<h4 class="fw-bold mt-5 mb-3">Key Details</h4>
<ul class="list-group list-group-flush small mb-4">
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">Condition:</span> 
        {{ $classified->item_condition ?? 'N/A' }} / 10 
        ({{ ['Used', 'Fair', 'Good', 'Very Good', 'Excellent', 'Mint'][$classified->item_condition / 2] ?? 'N/A' }})
    </li>
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">Category:</span> 
        {{ $classified->category->title ?? 'N/A' }}
    </li>
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">Brand:</span> 
        {{ $classified->brand->title ?? 'Not Specified' }}
    </li>
    @if ($classified->item_year_age)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">Year/Age:</span> 
            {{ $classified->item_year_age }} years old
        </li>
    @endif
    @if ($classified->item_quantity > 1)
        <li class="list-group-item bg-transparent">
            <span class="fw-semibold me-2">Quantity:</span> 
            {{ $classified->item_quantity }} available
        </li>
    @endif
    <li class="list-group-item bg-transparent">
        <span class="fw-semibold me-2">Shipping:</span> 
        {{ $classified->is_shipping ? 'Available (Inquire for details)' : 'Not available; Local Pickup Only' }}
    </li>
</ul>

<hr>

{{-- Safety Tip Alert --}}
<div class="alert alert-info small mt-4" alert-primary-theme" role="alert">
    <i class="bi bi-shield-lock-fill me-2 text-primary"></i>
    **Safety Tip:** Always meet in a public location and inspect the item before finalizing the purchase.
</div>
