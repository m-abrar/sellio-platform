@php
    $step = $step ?? null;
    $totalSteps = $totalSteps ?? 3;
    $subtitle = $subtitle ?? null;
    $event = $event ?? null;
    $showContext = $showContext ?? true;
    $showTitle = $showTitle ?? true;
    $backUrl = $backUrl ?? ($event ? route('events.show', $event->slug) : null);
    $backLabel = $backLabel ?? __('Back to event');
@endphp

<div class="booking-header page-title-section mb-4 mb-lg-5">
    @if($event && $showContext)
        <div class="booking-header__context glass-surface mb-4">
            <div class="booking-header__property">
                <img src="{{ $event->primary_image_url }}"
                     class="booking-header__thumb"
                     alt="{{ $event->title }}">

                <div class="booking-header__property-copy">
                    <span class="metric-label">{{ __('Reserved Event') }}</span>
                    <h2 class="booking-header__property-title">{{ $event->title }}</h2>
                    <p class="booking-header__property-meta mb-0">
                        <i class="bi bi-calendar-event text-primary-color me-1"></i>
                        {{ $event->start_date_time?->format('M j, Y') ?? __('Date TBD') }}
                        @if($event->location?->title)
                            <span class="mx-1">·</span>
                            <i class="bi bi-geo-alt-fill text-primary-color me-1"></i>{{ $event->location->title }}
                        @endif
                    </p>
                </div>
            </div>

            @if($backUrl)
                <a href="{{ $backUrl }}" class="booking-header__back">
                    <i class="bi bi-arrow-left"></i>
                    <span>{{ $backLabel }}</span>
                </a>
            @endif
        </div>
    @elseif($backUrl)
        <div class="mb-4">
            <a href="{{ $backUrl }}" class="booking-header__back booking-header__back--inline">
                <i class="bi bi-arrow-left"></i>
                <span>{{ $backLabel }}</span>
            </a>
        </div>
    @endif

    @if($showTitle)
        <div class="text-center">
            <span class="metric-label mx-auto">{{ $eyebrow }}</span>
            <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
                {{ $title }}@if($step !== null)<span class="text-primary-color">: {{ __('Step :step of :total', ['step' => $step, 'total' => $totalSteps]) }}</span>@endif
            </h1>

            @if($subtitle)
                <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">{{ $subtitle }}</p>
            @endif
        </div>
    @endif
</div>
