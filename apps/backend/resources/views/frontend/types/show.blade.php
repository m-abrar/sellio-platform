@extends('frontend._layouts._app')

@section('hero')
{{-- Premium Hero Header for Listing Type --}}
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden" 
     style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('{{ $type->primary_image_url ?? asset('images/default-cover.jpg') }}') center center / cover no-repeat;">
    <div class="header-overlay"></div>
    
    <div class="container position-relative z-index-1 text-center py-4">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <div class="d-inline-block bg-white p-1 rounded-circle shadow-lg">
                <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white shadow-inner" 
                     style="width: 130px; height: 130px; overflow: hidden;">
                    @if($type->primary_image_url)
                        <img src="{{ $type->primary_image_url }}" width="130" height="130" class="object-fit-cover">
                    @else
                        <i class="bi bi-tag-fill display-4"></i>
                    @endif
                </div>
            </div>
        </div>
        
        <h1 class="fw-800 display-5 text-white mb-2" data-aos="fade-up">{{ $type->title }}</h1>
        <div class="d-flex justify-content-center gap-3 text-white-50 fw-500" data-aos="fade-up" data-aos-delay="100">
            <span><i class="bi bi-bookmark-fill me-1 text-primary"></i> {{ __('Listing Category') }}</span>
            <span>•</span>
            <span><i class="bi bi-layers me-1 text-primary"></i> {{ $type->listings_count ?? 0 }} {{ __('Total Items') }}</span>
        </div>
    </div>
</div>
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="type" class="mt-n5 position-relative z-index-2">
    <div class="row g-4">
        {{-- MAIN CONTENT --}}
        <div class="col-lg-8">
            {{-- About Section --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-3 mb-4" data-aos="fade-up">
                <div class="card-body">
                    <h4 class="fw-800 mb-3"><i class="bi bi-info-circle-fill me-2 text-primary"></i> {{ __('About') }} {{ $type->title }}</h4>
                    <p class="description text-muted lh-lg">
                        {{ $type->description ?: __('Explore the wide range of listings and opportunities available under this category.') }}
                    </p>
                </div>
            </div>

            {{-- Activity / Listing Sections --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-2" data-aos="fade-up">
                <div class="card-body">
                    @php
                        $sections = [
                            ['data' => $type->properties, 'title' => 'Properties', 'icon' => 'bi-house-door', 'route' => 'properties.show'],
                            ['data' => $type->events, 'title' => 'Events', 'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                            ['data' => $type->jobs, 'title' => 'Job Listings', 'icon' => 'bi-briefcase', 'route' => 'jobs.show'],
                            ['data' => $type->services, 'title' => 'Services', 'icon' => 'bi-tools', 'route' => 'services.show'],
                            ['data' => $type->autos, 'title' => 'Vehicles', 'icon' => 'bi-car-front', 'route' => 'autos.show'],
                            ['data' => $type->classifieds, 'title' => 'Classified Ads', 'icon' => 'bi-bullhorn', 'route' => 'classifieds.show'],
                        ];
                    @endphp

                    @foreach($sections as $section)
                        @if($section['data']->count())
                            <div class="mb-5">
                                <h5 class="fw-800 mb-4 text-dark d-flex align-items-center">
                                    <i class="{{ $section['icon'] }} me-2 text-primary"></i> {{ $section['title'] }}
                                    <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill fs-7">{{ $section['data']->count() }}</span>
                                </h5>
                                
                                <div class="list-group list-group-flush gap-3">
                                    @foreach($section['data'] as $item)
                                        <a href="{{ route($section['route'], $item->slug) }}" class="list-group-item list-group-item-action rounded-4 border p-3 hover-lift shadow-sm bg-white">
                                            <div class="d-flex align-items-center">
                                                <div class="position-relative me-3">
                                                    <img src="{{ $item->primary_image_url ?? asset('images/placeholder.png') }}" 
                                                         class="rounded-3 shadow-sm object-fit-cover" width="85" height="85">
                                                </div>
                                                
                                                <div class="flex-grow-1">
                                                    <h6 class="fw-800 mb-1 text-dark">{{ $item->title }}</h6>
                                                    <div class="text-muted small d-flex flex-wrap gap-3 mt-1">
                                                        @if(isset($item->price_formatted))
                                                            <span class="text-primary fw-bold">{{ $item->price_formatted }}</span>
                                                        @endif
                                                        <span><i class="bi bi-geo-alt me-1"></i> {{ Str::limit($item->address ?? $item->location?->title ?? 'Location Pending', 35) }}</span>
                                                        
                                                        @if($section['title'] == 'Properties' && isset($item->number_of_bedrooms))
                                                            <span><i class="bi bi-door-open me-1"></i>{{ $item->number_of_bedrooms }} Bed</span>
                                                        @endif
                                                    </div>
                                                </div>
                                                <div class="ms-2">
                                                    <div class="icon-box-sm bg-light text-primary rounded-circle shadow-sm">
                                                        <i class="bi bi-chevron-right"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>

        {{-- SIDEBAR --}}
        <div class="col-lg-4">
            <div class="sticky-top" sticky-100>
                
                {{-- Quick Actions Card --}}
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-4">{{ __('Quick Navigation') }}</h5>
                    
                    <div class="d-grid gap-2 mb-4">
                        @foreach($sections as $section)
                            @if($section['data']->count())
                                <a href="{{ route(str_replace('.show', '.search', $section['route']), ['type' => $type->id]) }}" 
                                   class="btn btn-light text-start rounded-pill px-4 fw-600 border-0 shadow-sm py-2">
                                    <i class="{{ $section['icon'] }} me-2 text-primary"></i> Search {{ $section['title'] }}
                                </a>
                            @endif
                        @endforeach
                    </div>

                    <a href="{{ setting('url_partner', '#') }}?type={{ $type->slug }}" class="btn btn-primary btn-lg w-100 rounded-pill fw-800 mb-3 shadow-lg">
                        <i class="bi bi-plus-circle me-2"></i> {{ __('Post New Listing') }}
                    </a>
                    
                    <p class="text-center text-muted small px-3">
                        Want to promote your business in this category? <a href="#" class="text-primary text-decoration-none fw-600">Upgrade to Partner</a>
                    </p>
                </div>

                {{-- Trust Signals / Category Stats --}}
                <div class="card bg-dark text-white rounded-5 border-0 shadow-lg p-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-primary">{{ __('Category Insight') }}</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Verified Listings') }}</span>
                        <i class="bi bi-patch-check-fill text-success"></i>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Demand Level') }}</span>
                        <span class="text-warning">{{ __('High') }}</span>
                    </div>
                    <div class="mt-3 pt-3 border-top border-secondary">
                        <small class="text-muted d-block mb-1">{{ __('Last Item Added') }}</small>
                        <span class="fw-600 small">{{ now()->format('M d, Y') }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.listing-shell>
@endsection
