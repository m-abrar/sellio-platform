@extends('frontend._layouts._app')

@section('hero')
<section class="page-hero-strip hero-section--dark">
    <div class="container text-center">

        <div class="mb-4 mx-auto d-flex align-items-center justify-content-center rounded-3 overflow-hidden"
             style="width:72px;height:72px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.15)">
            @if($brand->primary_image_url)
                <img src="{{ $brand->primary_image_url }}" class="object-fit-contain w-100 h-100 p-1" alt="{{ $brand->title }}">
            @else
                <i class="bi bi-tags fs-2" style="color:rgba(255,255,255,.8)"></i>
            @endif
        </div>

        <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
            {{ __('Brand') }}
        </p>

        <h1 class="page-hero-title">{{ $brand->title }}</h1>

        <p class="page-hero-subtitle mx-auto">
            @if(($brand->listings_count ?? 0) > 0)
                {{ number_format($brand->listings_count) }} {{ __('listings') }} &middot;
            @endif
            {{ __('Since') }} {{ $brand->created_at->format('M Y') }}
        </p>

    </div>
</section>
@endsection

@section('body_class', 'bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="brand">
    <div class="row g-4">

        {{-- Left Column: Content --}}
        <div class="col-lg-8">

            {{-- About --}}
            @if($brand->description)
            <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-up">
                <h5 class="fw-800 mb-3 text-dark">{{ __('About') }} {{ $brand->title }}</h5>
                <p class="text-muted lh-base mb-0">{!! nl2br(e($brand->description)) !!}</p>
            </div>
            @endif

            {{-- Tabs --}}
            @php
                $collections = [
                    ['data' => $brand->properties,  'title' => __('Properties'), 'icon' => 'bi-house',          'route' => 'properties.show'],
                    ['data' => $brand->autos,        'title' => __('Vehicles'),   'icon' => 'bi-car-front',      'route' => 'autos.show'],
                    ['data' => $brand->jobs,         'title' => __('Jobs'),        'icon' => 'bi-briefcase',      'route' => 'jobs.show'],
                    ['data' => $brand->services,     'title' => __('Services'),    'icon' => 'bi-tools',          'route' => 'services.show'],
                    ['data' => $brand->events,       'title' => __('Events'),      'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                    ['data' => $brand->classifieds,  'title' => __('Classifieds'), 'icon' => 'bi-megaphone',      'route' => 'classifieds.show'],
                ];
            @endphp

            <div class="card detail-sidebar-card overflow-hidden" data-aos="fade-up">
                <div class="px-4 pt-4 pb-0 border-bottom" style="border-color:rgba(15,23,42,.07)!important">
                    <ul class="nav" id="brandTab" role="tablist">
                        <li class="nav-item">
                            <button class="detail-tab-btn active fw-semibold"
                                    data-bs-toggle="tab" data-bs-target="#tab-inventory">
                                <i class="bi bi-grid me-2"></i>{{ __('Inventory') }}
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="detail-tab-btn fw-semibold"
                                    data-bs-toggle="tab" data-bs-target="#tab-reviews">
                                <i class="bi bi-chat-square-quote me-2"></i>{{ __('Reviews') }}
                                @if($brand->reviews?->count())
                                    <span class="ms-1 badge rounded-2 fw-semibold" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color);font-size:.7rem">{{ $brand->reviews->count() }}</span>
                                @endif
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="tab-content p-4">

                    {{-- Inventory --}}
                    <div class="tab-pane fade show active" id="tab-inventory">
                        @foreach($collections as $col)
                            @if($col['data']->count())
                                <div class="mb-5">
                                    <div class="d-flex align-items-center mb-3">
                                        <i class="bi {{ $col['icon'] }} me-2 fs-5" style="color:var(--primary-color)"></i>
                                        <h5 class="fw-800 mb-0 text-dark">{{ $col['title'] }}</h5>
                                        <span class="ms-2 badge rounded-2 fw-semibold small" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">{{ $col['data']->count() }}</span>
                                    </div>
                                    <div class="d-flex flex-column gap-3">
                                        @foreach($col['data'] as $item)
                                            @php
                                                $displayTitle = $item->title
                                                    ?: collect([$item->year ?? null, $item->make ?? null, $item->model ?? null])->filter()->implode(' ');
                                                $displayPrice = $item->price_formatted
                                                    ?? $item->base_price_formatted
                                                    ?? null;
                                            @endphp
                                            <a href="{{ route($col['route'], $item->slug) }}" class="text-decoration-none">
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

                        @if(collect($collections)->every(fn($c) => $c['data']->count() === 0))
                            <div class="text-center py-5 text-muted">
                                <i class="bi bi-inbox display-4 d-block mb-2" style="color:rgba(var(--primary-color-rgb),.25)"></i>
                                <p class="mb-0">{{ __('No listings for this brand yet.') }}</p>
                            </div>
                        @endif
                    </div>

                    {{-- Reviews --}}
                    <div class="tab-pane fade" id="tab-reviews">
                        @include('frontend._partials._reviews', ['reviewable' => $brand, 'type' => 'brands'])
                    </div>

                </div>
            </div>
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top:100px">

                {{-- CTA --}}
                <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-left">
                    <a href="{{ setting('url_partner', '#') }}?brand={{ $brand->slug }}"
                       class="btn btn-primary btn-header-cta w-100">
                        <i class="bi bi-plus-circle me-2"></i>{{ __('Post for this brand') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>

                {{-- Details --}}
                <div class="card detail-sidebar-card p-4" data-aos="fade-left" data-aos-delay="100">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="small text-muted">{{ __('Slug') }}</span>
                        <span class="small fw-semibold text-dark">/{{ $brand->slug }}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small text-muted">{{ __('Since') }}</span>
                        <span class="small fw-semibold text-dark">{{ $brand->created_at->format('M Y') }}</span>
                    </div>
                </div>

            </div>
        </div>

    </div>
</x-frontend.listing-shell>
@endsection

@push('styles')
<style>
.detail-tab-btn {
    background: transparent;
    border: 0;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    color: #6b7280;
    font-size: .875rem;
    cursor: pointer;
    padding: .75rem 0;
    margin-right: 2rem;
    margin-bottom: -1px;
    transition: color .15s ease, border-color .15s ease;
}
.detail-tab-btn:hover { color: var(--text-dark); }
.detail-tab-btn.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}
</style>
@endpush
