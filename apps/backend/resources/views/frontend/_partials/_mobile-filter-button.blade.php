@php
    $label = $label ?? __('Filters');
    $targetId = $targetId ?? 'filterSidebar';
    $active = (bool) ($active ?? false);
    $activeCount = $activeCount ?? null;
    $icon = $icon ?? 'bi-sliders2';
@endphp

<div class="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3">
    <button class="btn btn-dark rounded-2 px-4 py-2 shadow-lg fw-semibold d-flex align-items-center"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#{{ $targetId }}"
            aria-controls="{{ $targetId }}">
        <i class="bi {{ $icon }} me-2"></i>
        {{ $label }}

        @if($activeCount)
            <span class="ms-2 badge rounded-2 bg-primary">{{ $activeCount }}</span>
        @elseif($active)
            <span class="ms-2 badge rounded-2 bg-primary">!</span>
        @endif
    </button>
</div>
