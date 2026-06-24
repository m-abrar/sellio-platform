@extends('frontend._layouts._app')

@section('hero')
<section class="page-hero-strip hero-section--dark">
    <div class="container text-center">

        <div class="mb-4 mx-auto position-relative d-inline-block">
            <img src="{{ $user->avatar_url }}"
                 class="rounded-circle object-fit-cover"
                 style="width:88px;height:88px;border:3px solid rgba(255,255,255,.2)"
                 alt="{{ $user->name }}">
            @if($user->is_verified)
                <span class="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center rounded-circle"
                      style="width:26px;height:26px;background:var(--primary-color);border:2px solid #1C1917">
                    <i class="bi bi-patch-check-fill" style="font-size:.7rem;color:#fff"></i>
                </span>
            @endif
        </div>

        <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
            {{ $user->roles->pluck('name')->first() ? ucfirst($user->roles->pluck('name')->first()) : __('Member') }}
        </p>

        <h1 class="page-hero-title">{{ $user->name }}</h1>

        <p class="page-hero-subtitle mx-auto">
            @if($user->location)
                <i class="bi bi-geo-alt-fill me-1"></i>{{ $user->location }} &middot;
            @endif
            {{ __('Member since :year', ['year' => $user->created_at->format('Y')]) }}
            @if($user->bio)
                <span class="d-block mt-1">{{ Str::limit($user->bio, 120) }}</span>
            @endif
        </p>

    </div>
</section>
@endsection

@section('body_class', 'bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="partner">
    <div class="row g-4">
        {{-- Left Column: Content --}}
        <div class="col-lg-8">

            {{-- Listings + Reviews Tabs --}}
            <div class="card detail-sidebar-card overflow-hidden" data-aos="fade-up">
                <div class="px-4 pt-4 pb-0 border-bottom" style="border-color:rgba(15,23,42,.07)!important">
                    <ul class="nav" id="userTab" role="tablist">
                        <li class="nav-item">
                            <button class="partner-tab-btn active fw-semibold"
                                    data-bs-toggle="tab" data-bs-target="#tab-all">
                                <i class="bi bi-grid me-2"></i>{{ __('Activity') }}
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="partner-tab-btn fw-semibold"
                                    data-bs-toggle="tab" data-bs-target="#tab-reviews">
                                <i class="bi bi-chat-square-quote me-2"></i>{{ __('Reviews') }}
                                @if($user->reviews?->count())
                                    <span class="ms-1 badge rounded-2 fw-semibold" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color);font-size:.7rem">{{ $user->reviews->count() }}</span>
                                @endif
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="tab-content p-4">
                    <div class="tab-pane fade show active" id="tab-all">
                        @php
                            $collections = [
                                ['data' => $user->properties, 'title' => __('Properties'), 'icon' => 'bi-house-fill',          'route' => 'properties.show'],
                                ['data' => $user->autos,      'title' => __('Vehicles'),   'icon' => 'bi-car-front-fill',      'route' => 'autos.show'],
                                ['data' => $user->jobs,       'title' => __('Jobs'),        'icon' => 'bi-briefcase-fill',      'route' => 'jobs.show'],
                                ['data' => $user->services,   'title' => __('Services'),    'icon' => 'bi-tools',               'route' => 'services.show'],
                                ['data' => $user->events,     'title' => __('Events'),      'icon' => 'bi-calendar-event-fill', 'route' => 'events.show'],
                            ];
                        @endphp

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
                                                    <img src="{{ $item->primary_image_url }}" class="rounded-3 object-fit-cover flex-shrink-0" width="80" height="80" alt="">
                                                    <div class="flex-grow-1 min-w-0">
                                                        <h6 class="fw-800 mb-1 text-dark text-truncate">{{ $displayTitle }}</h6>
                                                        @if(isset($item->category) && $item->category)
                                                            <span class="badge rounded-2 fw-semibold mb-1" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color);font-size:.7rem">{{ $item->category->title }}</span>
                                                        @endif
                                                        <div class="text-muted small d-flex align-items-center gap-2 flex-wrap">
                                                            @if($displayPrice)
                                                                <span class="fw-800" style="color:var(--primary-color)">{{ $displayPrice }}</span>
                                                                <span class="text-muted">·</span>
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
                                {{ __('No active listings yet.') }}
                            </div>
                        @endif
                    </div>

                    <div class="tab-pane fade" id="tab-reviews">
                        @include('frontend._partials._reviews', ['reviewable' => $user, 'type' => 'users'])
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top:100px">

                {{-- Contact Card --}}
                @php
                    $totalListings = $user->properties->count()
                        + $user->autos->count()
                        + $user->jobs->count()
                        + $user->services->count()
                        + $user->events->count();
                @endphp
                <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-4">{{ __('Contact') }}</h5>

                    <div class="mb-3">
                        <small class="text-muted d-block mb-1">{{ __('Email') }}</small>
                        <a href="mailto:{{ $user->email }}" class="fw-semibold text-dark text-decoration-none">{{ $user->email }}</a>
                    </div>

                    @if($user->phone)
                    <div class="mb-4">
                        <small class="text-muted d-block mb-1">{{ __('Phone') }}</small>
                        <a href="tel:{{ $user->phone }}" class="fw-semibold text-dark text-decoration-none">{{ $user->phone }}</a>
                    </div>
                    @endif

                    <div class="d-grid gap-2">
                        <a href="{{ route('conversation.start', $user) }}" class="btn btn-primary btn-header-cta w-100">
                            <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Send Message') }}<i class="bi bi-arrow-right ms-2"></i>
                        </a>
                        <button class="btn btn-outline-secondary w-100 fw-semibold">
                            <i class="bi bi-person-plus me-2"></i>{{ __('Follow') }}
                        </button>
                    </div>

                    <div class="mt-4 pt-4" style="border-top:1.5px solid rgba(15,23,42,.07)">
                        @if($totalListings > 0)
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small text-muted">{{ __('Listings') }}</span>
                            <span class="small fw-semibold text-dark">{{ $totalListings }}</span>
                        </div>
                        @endif
                        @if($user->is_verified)
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="small text-muted">{{ __('Identity') }}</span>
                            <span class="small fw-semibold" style="color:var(--primary-color)"><i class="bi bi-patch-check-fill me-1"></i>{{ __('Verified') }}</span>
                        </div>
                        @endif
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="small text-muted">{{ __('Member since') }}</span>
                            <span class="small fw-semibold text-dark">{{ $user->created_at->format('M Y') }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-frontend.listing-shell>

@push('styles')
<style>
.partner-meta-row span + span::before {
    content: '·';
    display: inline-block;
    margin: 0 .5rem;
    opacity: .35;
}
.partner-tab-btn {
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
.partner-tab-btn:hover {
    color: var(--text-dark);
}
.partner-tab-btn.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}
</style>
@endpush
@endsection
