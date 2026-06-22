@extends('frontend._layouts._app')

@section('hero')
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden"
     style="background: url('{{ $user->cover_url }}') center center / cover no-repeat;">
    <div class="header-overlay"></div>

    <div class="container position-relative z-index-1 text-center py-4">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <img src="{{ $user->avatar_url }}" class="rounded-circle shadow-lg border border-4 border-white object-fit-cover"
                 width="140" height="140" alt="{{ $user->name }}">
            @if($user->is_verified)
                <div class="verified-badge text-white shadow-sm" style="background:var(--primary-color)">
                    <i class="bi bi-patch-check-fill"></i>
                </div>
            @endif
        </div>

        <h1 class="fw-800 display-5 text-white mb-2" data-aos="fade-up">{{ $user->name }}</h1>

        <div class="d-flex justify-content-center flex-wrap gap-3 mt-2" data-aos="fade-up" data-aos-delay="100">
            @if($user->location)
                <span class="badge text-white fw-semibold px-3 py-2" style="background:rgba(255,255,255,.15);backdrop-filter:blur(4px)">
                    <i class="bi bi-geo-alt-fill me-1"></i>{{ $user->location }}
                </span>
            @endif
            <span class="badge text-white fw-semibold px-3 py-2" style="background:rgba(255,255,255,.15);backdrop-filter:blur(4px)">
                <i class="bi bi-shield-lock-fill me-1"></i>{{ $user->roles->pluck('name')->join(', ') ?: __('Member') }}
            </span>
            @if($user->created_at)
                <span class="badge text-white fw-semibold px-3 py-2" style="background:rgba(255,255,255,.15);backdrop-filter:blur(4px)">
                    <i class="bi bi-calendar3 me-1"></i>{{ __('Member since :year', ['year' => $user->created_at->format('Y')]) }}
                </span>
            @endif
        </div>
    </div>
</div>
@endsection
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="partner" class="mt-n5 position-relative z-index-2">
    <div class="row g-4">
        {{-- Left Column: Content --}}
        <div class="col-lg-8">
            {{-- About Section --}}
            <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-up">
                <h4 class="fw-800 mb-3"><i class="bi bi-person-lines-fill me-2" style="color:var(--primary-color)"></i>{{ __('About') }}</h4>
                <p class="text-muted lh-lg mb-0">
                    {{ $user->bio ?: __('This user prefers to keep their bio a mystery.') }}
                </p>
            </div>

            {{-- Listings + Reviews Tabs --}}
            <div class="card detail-sidebar-card overflow-hidden" data-aos="fade-up">
                <div class="p-4 border-bottom" style="border-color:rgba(15,23,42,.07)!important">
                    <ul class="nav gap-2" id="userTab" role="tablist">
                        <li class="nav-item">
                            <button class="partner-tab-btn active rounded-3 px-4 py-2 fw-semibold border-0"
                                    data-bs-toggle="tab" data-bs-target="#tab-all">
                                <i class="bi bi-grid me-2"></i>{{ __('Activity') }}
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="partner-tab-btn rounded-3 px-4 py-2 fw-semibold border-0"
                                    data-bs-toggle="tab" data-bs-target="#tab-reviews">
                                <i class="bi bi-chat-square-quote me-2"></i>{{ __('Reviews') }}
                                @if($user->reviews?->count())
                                    <span class="ms-1 badge rounded-pill fw-semibold" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color);font-size:.7rem">{{ $user->reviews->count() }}</span>
                                @endif
                            </button>
                        </li>
                    </ul>
                </div>

                <div class="tab-content p-4">
                    <div class="tab-pane fade show active" id="tab-all">
                        @php
                            $collections = [
                                ['data' => $user->properties, 'title' => __('Properties'), 'icon' => 'bi-house-fill', 'route' => 'properties.show'],
                                ['data' => $user->autos,      'title' => __('Vehicles'),   'icon' => 'bi-car-front-fill', 'route' => 'autos.show'],
                                ['data' => $user->jobs,       'title' => __('Jobs'),        'icon' => 'bi-briefcase-fill', 'route' => 'jobs.show'],
                                ['data' => $user->services,   'title' => __('Services'),    'icon' => 'bi-tools', 'route' => 'services.show'],
                                ['data' => $user->events,     'title' => __('Events'),      'icon' => 'bi-calendar-event-fill', 'route' => 'events.show'],
                            ];
                        @endphp

                        @foreach($collections as $col)
                            @if($col['data']->count())
                                <div class="mb-5">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="me-2 rounded-2 d-flex align-items-center justify-content-center" style="width:32px;height:32px;background:rgba(var(--primary-color-rgb),.08)">
                                            <i class="bi {{ $col['icon'] }}" style="color:var(--primary-color)"></i>
                                        </span>
                                        <h5 class="fw-800 mb-0 text-dark">{{ $col['title'] }}</h5>
                                        <span class="ms-2 badge rounded-pill fw-semibold small" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">{{ $col['data']->count() }}</span>
                                    </div>
                                    <div class="d-flex flex-column gap-3">
                                        @foreach($col['data'] as $item)
                                            <a href="{{ route($col['route'], $item->slug) }}" class="text-decoration-none">
                                                <div class="d-flex align-items-center gap-3 p-3 rounded-4 transition-up" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                                                    <img src="{{ $item->primary_image_url }}" class="rounded-3 object-fit-cover flex-shrink-0" width="76" height="76" alt="">
                                                    <div class="flex-grow-1 min-w-0">
                                                        <h6 class="fw-800 mb-1 text-dark text-truncate">{{ $item->title ?? ($item->make . ' ' . $item->model) }}</h6>
                                                        @if(isset($item->category) && $item->category)
                                                            <span class="badge rounded-2 fw-semibold mb-1" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color);font-size:.7rem">{{ $item->category->title }}</span>
                                                        @endif
                                                        <div class="text-muted small d-flex align-items-center gap-2 flex-wrap">
                                                            @if(isset($item->price))
                                                                <span class="fw-800" style="color:var(--primary-color)">{{ $item->price_formatted }}</span>
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

                        @if($collections->every(fn($c) => $c['data']->count() === 0))
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
                <div class="card detail-sidebar-card p-4 mb-4" data-aos="fade-left">
                    <h4 class="fw-800 mb-4">{{ __('Contact Details') }}</h4>

                    <div class="d-flex align-items-center gap-3 mb-3">
                        <span class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                            <i class="bi bi-envelope-fill" style="color:var(--primary-color)"></i>
                        </span>
                        <div>
                            <small class="text-muted d-block">{{ __('Email') }}</small>
                            <span class="fw-semibold text-dark">{{ $user->email }}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-center gap-3 mb-4">
                        <span class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center" style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                            <i class="bi bi-telephone-fill" style="color:var(--primary-color)"></i>
                        </span>
                        <div>
                            <small class="text-muted d-block">{{ __('Phone') }}</small>
                            <span class="fw-semibold text-dark">{{ $user->phone ?: __('Not Shared') }}</span>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <a href="{{ route('conversation.start', $user) }}" class="btn btn-primary btn-header-cta w-100">
                            <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Send Message') }}<i class="bi bi-arrow-right ms-2"></i>
                        </a>
                        <button class="btn btn-outline-secondary w-100 fw-semibold">
                            <i class="bi bi-person-plus me-2"></i>{{ __('Follow Profile') }}
                        </button>
                    </div>

                    <p class="text-center small text-muted mt-3 mb-0">{{ __('We protect your personal information.') }}</p>
                </div>

                {{-- Trust Score Card --}}
                <div class="card detail-sidebar-card p-4" data-aos="fade-left" data-aos-delay="100">
                    <h4 class="fw-800 mb-4"><i class="bi bi-shield-fill-check me-2" style="color:var(--primary-color)"></i>{{ __('Trust Score') }}</h4>

                    <div class="d-flex justify-content-between align-items-center mb-3 pb-3" style="border-bottom:1.5px solid rgba(15,23,42,.07)">
                        <span class="small fw-semibold text-dark">{{ __('Identity Verified') }}</span>
                        <i class="bi bi-check-circle-fill" style="color:var(--primary-color)"></i>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3 pb-3" style="border-bottom:1.5px solid rgba(15,23,42,.07)">
                        <span class="small fw-semibold text-dark">{{ __('Response Rate') }}</span>
                        <span class="fw-800 small" style="color:var(--primary-color)">98%</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="small fw-semibold text-dark">{{ __('Member Since') }}</span>
                        <span class="fw-semibold small text-dark">{{ $user->created_at->format('M Y') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.listing-shell>

@push('styles')
<style>
.partner-tab-btn {
    background: transparent;
    color: #6b7280;
    font-size: .875rem;
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
}
.partner-tab-btn:hover {
    background: rgba(var(--primary-color-rgb), .06);
    color: var(--primary-color);
}
.partner-tab-btn.active {
    background: rgba(var(--primary-color-rgb), .1);
    color: var(--primary-color);
}
</style>
@endpush
@endsection
