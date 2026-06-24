@extends('frontend._layouts._app')

@section('hero')
<section class="page-hero-strip hero-section--dark">
    <div class="container text-center">

        <div class="mb-4 mx-auto d-flex align-items-center justify-content-center rounded-3"
             style="width:72px;height:72px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.15)">
            @if($category->primary_image_url)
                <img src="{{ $category->primary_image_url }}" class="rounded-3 object-fit-cover w-100 h-100" alt="">
            @else
                <i class="bi bi-grid-fill fs-2" style="color:rgba(255,255,255,.8)"></i>
            @endif
        </div>

        <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
            {{ $category->type->title ?? __('Category') }}
        </p>

        <h1 class="page-hero-title">{{ $category->title }}</h1>

        <p class="page-hero-subtitle mx-auto">
            @if($category->description)
                {{ $category->description }}
            @elseif(($category->listings_count ?? 0) > 0)
                {{ number_format($category->listings_count) }} {{ __('listings across all verticals') }}
            @else
                {{ __('Browse listings in this category') }}
            @endif
        </p>

    </div>
</section>
@endsection

@section('body_class', 'bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="category">
    <div class="row g-4">

        {{-- Left Column: Listings --}}
        <div class="col-lg-8">
            @php
                $segments = [
                    ['data' => $category->properties,  'title' => __('Properties'), 'icon' => 'bi-house',          'route' => 'properties.show'],
                    ['data' => $category->events,       'title' => __('Events'),     'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                    ['data' => $category->jobs,         'title' => __('Jobs'),        'icon' => 'bi-briefcase',      'route' => 'jobs.show'],
                    ['data' => $category->services,     'title' => __('Services'),    'icon' => 'bi-tools',          'route' => 'services.show'],
                    ['data' => $category->autos,        'title' => __('Vehicles'),    'icon' => 'bi-car-front',      'route' => 'autos.show'],
                    ['data' => $category->classifieds,  'title' => __('Classifieds'), 'icon' => 'bi-megaphone',      'route' => 'classifieds.show'],
                ];
            @endphp

            @foreach($segments as $segment)
                @if($segment['data']->count())
                    <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-up">
                        <div class="d-flex align-items-center mb-4">
                            <i class="bi {{ $segment['icon'] }} me-2 fs-5" style="color:var(--primary-color)"></i>
                            <h5 class="fw-800 mb-0 text-dark">{{ $segment['title'] }}</h5>
                            <span class="ms-2 badge rounded-2 fw-semibold small" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">{{ $segment['data']->count() }}</span>
                        </div>
                        <div class="d-flex flex-column gap-3">
                            @foreach($segment['data'] as $item)
                                @php
                                    $displayTitle = $item->title
                                        ?: collect([$item->year ?? null, $item->make ?? null, $item->model ?? null])->filter()->implode(' ');
                                    $displayPrice = $item->price_formatted
                                        ?? $item->base_price_formatted
                                        ?? null;
                                @endphp
                                <a href="{{ route($segment['route'], $item->slug) }}" class="text-decoration-none">
                                    <div class="d-flex align-items-center gap-3 p-3 rounded-4 transition-up bg-white" style="border:1.5px solid rgba(15,23,42,.07)">
                                        <img src="{{ $item->primary_image_url ?? $item->company_logo_url ?? asset('images/placeholder.png') }}"
                                             class="rounded-3 object-fit-cover flex-shrink-0" width="80" height="80" alt="">
                                        <div class="flex-grow-1 min-w-0">
                                            <h6 class="fw-800 mb-1 text-dark text-truncate">{{ $displayTitle }}</h6>
                                            <div class="text-muted small d-flex align-items-center gap-2 flex-wrap">
                                                @if($displayPrice)
                                                    <span class="fw-800" style="color:var(--primary-color)">{{ $displayPrice }}</span>
                                                    <span>·</span>
                                                @endif
                                                <span><i class="bi bi-geo-alt me-1"></i>{{ $item->address ?? ($item->location->title ?? __('Multiple Locations')) }}</span>
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

            @if(collect($segments)->every(fn($s) => $s['data']->count() === 0))
                <div class="card detail-sidebar-card p-5 text-center text-muted">
                    <i class="bi bi-inbox display-4 d-block mb-2" style="color:rgba(var(--primary-color-rgb),.2)"></i>
                    <p class="mb-0">{{ __('No listings in this category yet.') }}</p>
                </div>
            @endif
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top:100px">

                {{-- CTA --}}
                <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-left">
                    <a href="{{ setting('url_partner', '#') }}?category={{ $category->slug }}"
                       class="btn btn-primary btn-header-cta w-100">
                        <i class="bi bi-plus-circle me-2"></i>{{ __('Post a listing') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>

                {{-- Metadata --}}
                <div class="card detail-sidebar-card p-4" data-aos="fade-left" data-aos-delay="100">
                    @if($category->type)
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small text-muted">{{ __('Listed under') }}</span>
                        <span class="small fw-semibold text-dark">{{ $category->type->title }}</span>
                    </div>
                    @endif
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small text-muted">{{ __('Since') }}</span>
                        <span class="small fw-semibold text-dark">{{ $category->created_at->format('M Y') }}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center {{ $category->parent_category ? 'mb-2' : '' }}">
                        <span class="small text-muted">{{ __('Slug') }}</span>
                        <span class="small fw-semibold text-dark">/{{ $category->slug }}</span>
                    </div>
                    @if($category->parent_category)
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small text-muted">{{ __('Parent') }}</span>
                        <a href="{{ route('categories.show', $category->parent_category->slug) }}"
                           class="small fw-semibold text-decoration-none" style="color:var(--primary-color)">{{ $category->parent_category->title }}</a>
                    </div>
                    @endif
                </div>

            </div>
        </div>

    </div>
</x-frontend.listing-shell>
@endsection
