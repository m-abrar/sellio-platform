@extends('frontend._layouts._app')

@section('hero')
{{-- Premium Tag Hero Header --}}
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden" 
     style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('{{ $tag->primary_image_url }}') center center / cover no-repeat; min-height: 350px;">
    <div class="header-overlay"></div>
    
    <div class="container position-relative z-index-1 text-center py-4">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <div class="d-inline-flex align-items-center justify-content-center rounded-circle shadow-lg border border-4 border-white bg-white" 
                 style="width: 140px; height: 140px; overflow: hidden;">
                <img src="{{ $tag->primary_image_url }}" width="140" height="140" alt="{{ $tag->title }}" class="object-fit-cover">
            </div>
            <div class="verified-badge bg-primary text-white shadow-sm">
                <i class="bi bi-hash"></i>
            </div>
        </div>
        
        <h1 class="fw-800 display-5 text-white mb-2" data-aos="fade-up">{{ $tag->title }}</h1>
        <div class="d-flex justify-content-center gap-3 text-white-50 fw-500" data-aos="fade-up" data-aos-delay="100">
            <span><i class="bi bi-collection me-1"></i> {{ $tag->listings_count ?? 0 }} {{ __('Items Tagged') }}</span>
            <span>•</span>
            <span><i class="bi bi-calendar3 me-1"></i> {{ __('Created') }} {{ $tag->created_at->format('M Y') }}</span>
        </div>
    </div>
</div>
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="tag" class="mt-n5 position-relative z-index-2">
    
    <div class="row g-4">
        {{-- Left Column: Content --}}
        <div class="col-lg-8">
            {{-- About Section --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-3 mb-4" data-aos="fade-up">
                <div class="card-body">
                    <h4 class="fw-800 mb-3"><i class="bi bi-info-circle-fill me-2 text-primary"></i> {{ __('Tag Description') }}</h4>
                    <p class="description text-muted lh-lg">
                        {{ $tag->description ?: __('Explore a curated collection of listings categorized under the ' . $tag->title . ' tag.') }}
                    </p>
                </div>
            </div>

            {{-- Dynamic Tabs for Listings --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-2" data-aos="fade-up">
                <div class="card-body">
                    <ul class="nav nav-pills nav-justified mb-4 gap-2 p-2 bg-light rounded-pill" id="tagTab" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-all">{{ __('Recent Activity') }}</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-explore">{{ __('Explore Categories') }}</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-all">
                            {{-- Unified Listing Loop --}}
                            @php
                                $collections = [
                                    ['data' => $tag->properties, 'title' => __('Properties'), 'icon' => 'bi-house', 'route' => 'properties.show'],
                                    ['data' => $tag->autos, 'title' => __('Vehicles'), 'icon' => 'bi-car-front', 'route' => 'autos.show'],
                                    ['data' => $tag->jobs, 'title' => __('Jobs'), 'icon' => 'bi-briefcase', 'route' => 'jobs.show'],
                                    ['data' => $tag->services, 'title' => __('Services'), 'icon' => 'bi-tools', 'route' => 'services.show'],
                                    ['data' => $tag->events, 'title' => __('Events'), 'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                                    ['data' => $tag->classifieds, 'title' => __('Classifieds'), 'icon' => 'bi-megaphone', 'route' => 'classifieds.show'],
                                ];
                            @endphp

                            @foreach($collections as $col)
                                @if($col['data']->count())
                                    <div class="mb-5">
                                        <h5 class="fw-800 mb-3 text-dark d-flex align-items-center">
                                            <i class="{{ $col['icon'] }} me-2 text-primary"></i> {{ $col['title'] }}
                                            <span class="badge bg-light text-primary ms-2 rounded-pill fs-7">{{ $col['data']->count() }}</span>
                                        </h5>
                                        <div class="list-group list-group-flush gap-3">
                                            @foreach($col['data'] as $item)
                                                <a href="{{ route($col['route'], $item->slug) }}" class="list-group-item list-group-item-action rounded-4 border p-3 hover-lift shadow-sm">
                                                    <div class="d-flex align-items-center">
                                                        <img src="{{ $item->primary_image_url ?? $item->company_logo_url ?? asset('images/placeholder.png') }}" class="rounded-3 me-3 object-fit-cover" width="80" height="80">
                                                        <div class="flex-grow-1">
                                                            <h6 class="fw-800 mb-1 text-dark">{{ $item->title }}</h6>
                                                            <div class="text-muted small">
                                                                @if(isset($item->price_formatted)) <span class="text-primary fw-bold me-2">{{ $item->price_formatted }}</span> @endif
                                                                <i class="bi bi-geo-alt"></i> {{ $item->address ?? $item->location->title ?? __('Location Not Specified') }}
                                                            </div>
                                                        </div>
                                                        <i class="bi bi-chevron-right text-muted"></i>
                                                    </div>
                                                </a>
                                            @endforeach
                                        </div>
                                    </div>
                                @endif
                            @endforeach
                        </div>

                        <div class="tab-pane fade" id="tab-explore">
                            <div class="p-4 text-center">
                                <h5 class="fw-800 mb-3">{{ __('Search within #') }}{{ $tag->title }}</h5>
                                <p class="text-muted mb-4">{{ __('Filter results by category to find exactly what you need.') }}</p>
                                <div class="row g-3">
                                    @foreach($collections as $col)
                                        <div class="col-md-6">
                                            <a href="{{ route(explode('.', $col['route'])[0] . '.search', ['tag' => $tag->id]) }}" class="btn btn-light w-100 py-3 rounded-4 border hover-lift">
                                                <i class="{{ $col['icon'] }} text-primary me-2"></i> {{ __('View all') }} {{ $col['title'] }}
                                            </a>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" sticky-100>
                {{-- Metadata Sidebar --}}
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-4">{{ __('Tag Details') }}</h5>
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-sm bg-primary-subtle text-primary me-3 rounded-circle"><i class="bi bi-fingerprint"></i></div>
                        <div><small class="text-muted d-block">{{ __('Slug') }}</small><span class="fw-600">{{ $tag->slug }}</span></div>
                    </div>
                    <div class="d-flex align-items-center mb-4">
                        <div class="icon-box-sm bg-info-subtle text-info me-3 rounded-circle"><i class="bi bi-calendar-check"></i></div>
                        <div><small class="text-muted d-block">{{ __('Added On') }}</small><span class="fw-600">{{ $tag->created_at->format('M d, Y') }}</span></div>
                    </div>

                    <a href="{{ setting('url_partner', '#') }}?tag={{ $tag->slug }}" class="btn btn-primary btn-lg w-100 rounded-pill fw-800 mb-3 shadow-sm">
                        <i class="bi bi-plus-circle me-2"></i> {{ __('Submit a Listing') }}
                    </a>
                    
                    <button class="btn btn-outline-dark btn-lg w-100 rounded-pill fw-800 border-2">
                        <i class="bi bi-share me-2"></i> {{ __('Share Tag') }}
                    </button>
                </div>

                {{-- Status Card --}}
                <div class="card bg-dark text-white rounded-5 border-0 shadow-lg p-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-primary">{{ __('Tag Performance') }}</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Global Visibility') }}</span>
                        <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Search Popularity') }}</span>
                        <span class="text-warning">High</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.listing-shell>
@endsection
