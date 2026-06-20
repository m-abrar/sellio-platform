<div class="listing-description-container">
    @if(!empty($auto->description))
        <div class="description-content text-muted lh-lg" id="descriptionText">
            {{-- Using nl2br to preserve dealer formatting while sanitizing --}}
            {!! nl2br(e($auto->description)) !!}
        </div>

        {{-- If the description is very long, we can add a 'Read More' fade --}}
        @if(strlen($auto->description) > 800)
            <div class="mt-3">
                <button class="btn btn-link text-primary-color fw-bold p-0 text-decoration-none small"
                        type="button"
                        data-action="expand-description">
                    {{ __('+ Read Full Dealer Comments') }}
                </button>
            </div>
        @endif
    @else
        <div class="p-4 rounded-4 bg-light border border-dashed text-center">
            <i class="bi bi-chat-left-text text-muted fs-2 mb-2 d-block"></i>
            <p class="text-muted mb-0 small">{{ __('No additional dealer comments provided for this vehicle.') }}</p>
        </div>
    @endif
</div>

@push('scripts')
<script>
    document.querySelectorAll('[data-action="expand-description"]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const desc = document.getElementById('descriptionText');
            if (desc) {
                desc.style.display = 'block';
                desc.style.webkitLineClamp = 'unset';
                this.style.display = 'none';
            }
        });
    });
</script>
@endpush
