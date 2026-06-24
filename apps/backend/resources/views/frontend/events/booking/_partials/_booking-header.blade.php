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

<div class="booking-header mb-4 mb-lg-5">

    @if($showTitle)
        {{-- ── Full-width dark hero strip ───────────────────────────────── --}}
        <div class="booking-hero">
            <div class="booking-hero__inner">

                {{-- Back link inside the strip --}}
                @if($backUrl)
                    <a href="{{ $backUrl }}" class="booking-hero__nav-link mb-3">
                        <i class="bi bi-arrow-left-short fs-5"></i>{{ $backLabel }}
                    </a>
                @endif

                {{-- Content: thumbnail (if context) + title/step --}}
                <div class="{{ ($event && $showContext) ? 'd-flex align-items-center gap-4 flex-wrap' : 'text-center' }}">

                    @if($event && $showContext)
                        <img src="{{ $event->primary_image_url }}"
                             class="booking-hero__preview-img"
                             alt="{{ $event->title }}">
                    @endif

                    <div>
                        <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
                            <i class="bi bi-ticket-perforated me-1"></i>{{ $eyebrow }}
                        </p>
                        <h1 class="fw-800 tracking-tight mb-1" style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.5rem);color:#fff;letter-spacing:-0.03em">
                            {{ $title }}@if($step !== null)<span style="color:rgba(224,95,44,.8)"> · {{ __('Step :step of :total', ['step' => $step, 'total' => $totalSteps]) }}</span>@endif
                        </h1>
                        @if($subtitle)
                            <p class="booking-hero__subtitle {{ (!$event || !$showContext) ? 'mx-auto' : '' }} mb-0">{{ $subtitle }}</p>
                        @endif
                    </div>
                </div>

            </div>
        </div>

    @else
        {{-- Confirmation page: no hero, just a standalone back link --}}
        @if($backUrl)
            <div class="mb-3">
                <a href="{{ $backUrl }}" class="booking-header__back booking-header__back--inline">
                    <i class="bi bi-arrow-left"></i>
                    <span>{{ $backLabel }}</span>
                </a>
            </div>
        @endif
    @endif

</div>
