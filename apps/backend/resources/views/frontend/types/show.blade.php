@extends('frontend._layouts._app')

@section('hero')
<section class="py-5 border-bottom" style="background:#F4F0EC;border-color:rgba(15,23,42,.07)!important;">
    <div class="container">
        <div class="d-flex flex-column flex-sm-row align-items-start gap-4">

            @if($type->primary_image_url)
            <div class="flex-shrink-0">
                <img src="{{ $type->primary_image_url }}"
                     class="rounded-3 object-fit-cover"
                     style="width:72px;height:72px;border:1.5px solid rgba(15,23,42,.1)"
                     alt="">
            </div>
            @else
            <div class="flex-shrink-0 rounded-3 d-flex align-items-center justify-content-center"
                 style="width:72px;height:72px;background:rgba(var(--primary-color-rgb),.08);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
                <i class="bi bi-tag-fill fs-2" style="color:var(--primary-color)"></i>
            </div>
            @endif

            <div class="pt-sm-1">
                <h1 class="mb-2 lh-1" style="font-family:var(--font-heading);font-size:clamp(1.75rem,3vw,2.25rem);color:var(--text-dark)">{{ $type->title }}</h1>
                <div class="d-flex flex-wrap gap-3 align-items-center small text-muted">
                    @if(($type->listings_count ?? 0) > 0)
                        <span>{{ number_format($type->listings_count) }} {{ __('listings') }}</span>
                    @endif
                </div>
            </div>

        </div>
    </div>
</section>
@endsection

@section('body_class', 'bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="type">
    <div class="row g-4">

        {{-- Left Column: Content --}}
        <div class="col-lg-8">

            @if($type->description)
            <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-up">
                <h5 class="fw-800 mb-3 text-dark">{{ __('About') }} {{ $type->title }}</h5>
                <p class="text-muted lh-base mb-0">{{ $type->description }}</p>
            </div>
            @endif

            @php
                $sections = [
                    ['data' => $type->properties,  'key' => 'properties',  'title' => __('Properties'), 'icon' => 'bi-house',          'route' => 'properties.show'],
                    ['data' => $type->events,       'key' => 'events',      'title' => __('Events'),     'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                    ['data' => $type->jobs,         'key' => 'jobs',         'title' => __('Jobs'),        'icon' => 'bi-briefcase',      'route' => 'jobs.show'],
                    ['data' => $type->services,     'key' => 'services',    'title' => __('Services'),    'icon' => 'bi-tools',          'route' => 'services.show'],
                    ['data' => $type->autos,        'key' => 'autos',        'title' => __('Vehicles'),    'icon' => 'bi-car-front',      'route' => 'autos.show'],
                    ['data' => $type->classifieds,  'key' => 'classifieds', 'title' => __('Classifieds'), 'icon' => 'bi-megaphone',      'route' => 'classifieds.show'],
                ];
            @endphp

            @foreach($sections as $section)
                @if($section['data']->count())
                    <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-up">
                        <div class="d-flex align-items-center mb-4">
                            <i class="bi {{ $section['icon'] }} me-2 fs-5" style="color:var(--primary-color)"></i>
                            <h5 class="fw-800 mb-0 text-dark">{{ $section['title'] }}</h5>
                            <span class="ms-2 badge rounded-2 fw-semibold small" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">{{ $section['data']->count() }}</span>
                        </div>
                        <div class="d-flex flex-column gap-3">
                            @foreach($section['data'] as $item)
                                @php
                                    $displayTitle = $item->title
                                        ?: collect([$item->year ?? null, $item->make ?? null, $item->model ?? null])->filter()->implode(' ');
                                    $displayPrice = $item->price_formatted
                                        ?? $item->base_price_formatted
                                        ?? null;
                                @endphp
                                <a href="{{ route($section['route'], $item->slug) }}" class="text-decoration-none">
                                    <div class="d-flex align-items-center gap-3 p-3 rounded-4 transition-up bg-white" style="border:1.5px solid rgba(15,23,42,.07)">
                                        <img src="{{ $item->primary_image_url ?? asset('images/placeholder.png') }}"
                                             class="rounded-3 object-fit-cover flex-shrink-0" width="80" height="80" alt="">
                                        <div class="flex-grow-1 min-w-0">
                                            <h6 class="fw-800 mb-1 text-dark text-truncate">{{ $displayTitle }}</h6>
                                            <div class="text-muted small d-flex align-items-center gap-2 flex-wrap">
                                                @if($displayPrice)
                                                    <span class="fw-800" style="color:var(--primary-color)">{{ $displayPrice }}</span>
                                                    <span>·</span>
                                                @endif
                                                <span><i class="bi bi-geo-alt me-1"></i>{{ Str::limit($item->address ?? $item->location?->title ?? __('Location not specified'), 35) }}</span>
                                                @if($section['key'] === 'properties' && isset($item->number_of_bedrooms))
                                                    <span>·</span>
                                                    <span><i class="bi bi-door-open me-1"></i>{{ $item->number_of_bedrooms }} {{ __('Bed') }}</span>
                                                @endif
                                            </div>
                                        </div>
                                        <i class="bi bi-chevron-right text-muted flex-shrink-0"></i>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endif
            @endforeach

            @if(collect($sections)->every(fn($s) => $s['data']->count() === 0))
                <div class="card detail-sidebar-card p-5 text-center text-muted">
                    <i class="bi bi-inbox display-4 d-block mb-2" style="color:rgba(var(--primary-color-rgb),.2)"></i>
                    <p class="mb-0">{{ __('No listings under this type yet.') }}</p>
                </div>
            @endif
        </div>

        {{-- Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top:100px">

                {{-- CTA --}}
                <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-left">
                    <a href="{{ setting('url_partner', '#') }}?type={{ $type->slug }}"
                       class="btn btn-primary btn-header-cta w-100 mb-3">
                        <i class="bi bi-plus-circle me-2"></i>{{ __('Post a listing') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                    <p class="text-center text-muted small mb-0">
                        {{ __('Want to reach more buyers?') }}
                        <a href="#" class="text-decoration-none fw-semibold" style="color:var(--primary-color)">{{ __('Upgrade to Partner') }}</a>
                    </p>
                </div>

                {{-- Quick Navigation --}}
                @if(collect($sections)->contains(fn($s) => $s['data']->count() > 0))
                <div class="card detail-sidebar-card p-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-dark">{{ __('Quick Navigation') }}</h5>
                    <div class="d-flex flex-column gap-2">
                        @foreach($sections as $section)
                            @if($section['data']->count())
                                <a href="{{ route(str_replace('.show', '.index', $section['route'])) }}?types[]={{ $type->id }}"
                                   class="d-flex align-items-center gap-3 p-3 rounded-4 text-decoration-none transition-up bg-white"
                                   style="border:1.5px solid rgba(15,23,42,.07)">
                                    <i class="bi {{ $section['icon'] }} flex-shrink-0" style="color:var(--primary-color)"></i>
                                    <span class="fw-semibold text-dark small flex-grow-1">{{ $section['title'] }}</span>
                                    <span class="small text-muted me-1">{{ $section['data']->count() }}</span>
                                    <i class="bi bi-chevron-right text-muted flex-shrink-0 small"></i>
                                </a>
                            @endif
                        @endforeach
                    </div>
                </div>
                @endif

            </div>
        </div>

    </div>
</x-frontend.listing-shell>
@endsection
