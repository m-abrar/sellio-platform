@php
    $title = $title ?? __('Filters');
    $targetId = $targetId ?? 'filterSidebar';
@endphp

<aside class="col-12 col-lg-3">
    <div class="offcanvas-lg offcanvas-start rounded-4 border-0 shadow filter-offcanvas"
         tabindex="-1"
         id="{{ $targetId }}"
         aria-labelledby="{{ $targetId }}Label">
        <div class="offcanvas-header bg-white d-lg-none border-bottom">
            <h5 class="offcanvas-title fw-bold" id="{{ $targetId }}Label">{{ $title }}</h5>
            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#{{ $targetId }}"
                    aria-label="{{ __('Close filters') }}"></button>
        </div>

        <div class="offcanvas-body p-0">
            {{ $slot }}
        </div>
    </div>
</aside>
