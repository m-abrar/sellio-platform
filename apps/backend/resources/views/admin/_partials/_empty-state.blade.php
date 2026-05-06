<tr class="empty-state">
    <td colspan="{{ $colspan ?? 10 }}" class="py-5 text-center">
        <div class="py-5">
            <div class="empty-state-icon-wrapper mb-4">
                <i class="{{ $icon ?? 'fas fa-database' }} fa-4x text-muted opacity-25"></i>
            </div>
            <h5 class="text-dark font-weight-bold mb-2">{{ $title ?? 'No records found.' }}</h5>
            <p class="text-secondary small mb-4 mx-auto" style="max-width: 400px;">{{ $description ?? 'There are currently no items in this registry. Initialize your first entry to get started.' }}</p>
            @if(isset($button_link) && isset($button_text))
                <a href="{{ $button_link }}" class="btn btn-primary btn-premium px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-1"></i> {{ $button_text }}
                </a>
            @endif
        </div>
    </td>
</tr>

<style>
.empty-state-icon-wrapper {
    position: relative;
    display: inline-block;
}
.empty-state-icon-wrapper:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, rgba(255,255,255,0) 70%);
    z-index: -1;
}
</style>
