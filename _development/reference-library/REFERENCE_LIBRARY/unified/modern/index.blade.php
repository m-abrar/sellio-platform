@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Poppins:wght@700;900&display=swap" rel="stylesheet">

<style>
:root {
    /* Theme Colors */
    --color-bg-page: #21212B; 
    --color-bg-header-nav: #282A36; 
    --color-bg-content-wrapper: #373A47; 
    --color-bg-main-content: #1E1E28; 
    
    --color-bg-search-bar-transparent: rgba(255, 255, 255, 0.1); 
    --color-bg-list-card: #F2F2F2; 
    
    --color-text-dark: #2C3E50; 
    --color-text-light: #F8F8F2; 
    --color-text-secondary-dark: #555555; 
    --color-text-footer: rgba(248, 248, 242, 0.7); 
    
    /* Accent Colors */
    --color-accent-home: #5F636F; 
    --color-accent-events: #50B3E6; 
    --color-accent-autos: #FFAC41; 
    --color-accent-services: #6CBE5E; 
    --color-accent-jobs: #B27BFF; 
    --color-accent-classifieds: #F56565; /* Used for Ads now */
    
    /* Radius */
    --radius-card: 10px;
    --radius-image: 8px; 
    --radius-small: 6px;

    /* Transitions for Hover/Animations */
    --transition-speed: 0.2s ease-out;
}
</style>
@endpush

@section('content')
<div class="content-wrapper">
    <div class="container container-xl main-container">
        <main class="py-section">
            
            <section class="mb-section">
                <div class="section-header">
                    <h2 class="section-title">{{ page_content('home.properties.heading', 'Properties') }}</h2>
                    <a href="{{ route('properties.index') }}" class="text-decoration-none">
                    <button class="btn rounded-pill btn-view-all">{{ page_content('home.properties.button', 'View All') }} <i class="bi bi-arrow-right"></i></button>
                    </a>
                </div>
                <div class="section-divider"></div>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    @foreach($propertiesFeatured->take(3) as $property)
                    <div class="col">
                        <div class="card">
                            <div class="card-img-container">
                                <img src="{{$property->primary_image_url}}" alt="{{$property->title}}" class="w-100">
                                <span class="price-tag" style="background-color: var(--color-accent-events);">{{$property->price_formatted_k}}</span>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title-subtle">{{$property->title}}</h5>
                                <p class="card-subtitle-small mb-3">{{ $property->address ?? $property?->location?->title ?? '' }} - {{$property->number_of_bedrooms}} Bed, {{$property->number_of_bathrooms}} Bath</p>
                                <a href="{{ route('properties.show', $property) }}" class="btn btn-small-square rounded-pill" style="background-color: var(--color-accent-events);">View Details</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </section>
            <section class="mb-section">
                <div class="section-header">
                    <h2 class="section-title">{{ page_content('home.autos.heading', 'Autos') }}</h2>
                    <a href="{{ route('autos.index') }}" class="text-decoration-none">
                    <button class="btn rounded-pill btn-view-all">{{ page_content('home.autos.button', 'View All') }} <i class="bi bi-arrow-right"></i></button>
                    </a>
                </div>
                <div class="section-divider"></div>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    @foreach($autosFeatured->take(3) as $auto)
                    <div class="col">
                        <div class="card">
                            <div class="card-img-container">
                                <img src="{{$auto->primary_image_url}}" alt="{{$auto->title}}" class="w-100">
                                <span class="price-tag" style="background-color: var(--color-accent-autos);">{{$auto->price_formatted_k}}</span>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title-subtle">{{$auto->title}}</h5>
                                <p class="card-subtitle-small mb-3">{{ $auto->address ?? $auto?->location?->title ?? '' }}<br/>{{$auto->transmission}} - Driven: {{$auto->mileage_formatted}}, {{$auto->engine_type}}</p>
                                <a href="{{ route('autos.show', $auto) }}" class="btn btn-small-square rounded-pill" style="background-color: var(--color-accent-autos);">View Details</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </section>

            <section class="mb-section">
                <div class="section-header">
                    <h2 class="section-title">{{ page_content('home.events.heading', 'Events') }}</h2>
                    <a href="{{ route('events.index') }}" class="text-decoration-none">
                        <button class="btn rounded-pill btn-view-all">
                            {{ page_content('home.events.button', 'View All') }} <i class="bi bi-arrow-right"></i>
                        </button>
                    </a>
                </div>
                <div class="section-divider"></div>
                <div class="row row-cols-1 row-cols-md-3 g-4">
                    @foreach($eventsFeatured->take(3) as $event)
                    <div class="col">
                        <div class="card">
                            <div class="card-img-container">
                                <img src="{{$event->primary_image_url}}" alt="{{$event->title}}" class="w-100">
                                <span class="price-tag" style="background-color: var(--color-accent-events);">{{$event->category?->title}}</span>
                            </div>
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title-subtle">{{$event->title}}</h5>
                                    <p class="card-subtitle-small mb-0">{{$event->start_date_time->format('M d')}} - {{ $event->address ?? $event?->location?->title ?? '' }}</p>
                                </div>
                                <a href="{{ route('events.show', $event) }}" class="btn btn-small-square rounded-pill" style="background-color: var(--color-accent-classifieds);">RSVP</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
            </section>

            <section class="mb-section">
                <div class="section-header">
                    <h2 class="section-title">{{ page_content('home.services.heading', 'Services')}}</h2>
                    <a href="{{route('services.index')}}" class="btn btn-more rounded-pill">{{ page_content('home.services.button', 'More')}} <i class="bi bi-arrow-right"></i></a>
                </div>
                <div class="section-divider"></div>
                <div class="row row-cols-1 row-cols-md-2 g-3">
                    
                    @foreach($servicesFeatured->take(2) as $service)
                    <div class="col">
                        <div class="list-card d-flex align-items-center">
                            <div class="list-thumbnail me-3">
                                <img src="{{$service->primary_image_url}}" alt="{{$service->title}}" style="height:80px; width:80px; object-fit: cover;">
                            </div>
                            <div class="classified-info">
                                <p class="classified-title mb-0">{{$service->title}}</p>
                                <p class="card-subtitle-small mb-1">{{$service->category?->title}} — {{$service->type?->title ?? 'Other'}}</p>

                                <span class="badge text-bg-success">
                                    <i class="bi bi-currency-dollar me-1"></i> 
                                    @if ($service->base_price && $service->sale_price)
                                        Starting at ${{ number_format($service->sale_price, 0) }} (Est. Max ${{ number_format($service->base_price, 0) }})
                                    @elseif ($service->sale_price)
                                        Min Fee: ${{ number_format($service->sale_price, 0) }}
                                    @elseif ($service->base_price)
                                        Avg. Price: ${{ number_format($service->base_price, 0) }}
                                    @else
                                        Custom Quote Required
                                    @endif
                                </span>
                                
                            </div>
                            <a href="{{ route('services.show', $service) }}" class="btn btn-small-square ms-auto rounded-pill" style="background-color: var(--color-accent-autos); color: var(--color-text-light);">
                                    @if ($service->is_project_based)
                                        Hire
                                    @elseif ($service->is_subscription)
                                        Subscribe
                                    @else
                                        Consult
                                    @endif
                            </a>
                        </div>
                    </div>
                    @endforeach
                </div>
            </section>

            <section class="mb-section">
                <div class="section-header">
                    <h2 class="section-title">{{ page_content('home.ads.heading', 'Ads')}}</h2>
                    <a href="{{route('classifieds.index')}}" class="btn btn-more rounded-pill">{{ page_content('home.ads.button', 'More')}} <i class="bi bi-arrow-right"></i></a>
                </div>
                <div class="section-divider"></div>
                <div class="row row-cols-1 row-cols-md-3 g-3">
                    
                    
                    @foreach($jobsFeatured->take(1) as $job)
                    <div class="col">
                        <div class="list-card d-flex align-items-center">
                            <div class="list-thumbnail me-3">
                                <img src="{{$job->primary_image_url}}" alt="{{$job->title}}" style="height:80px; width:80px; object-fit: cover;">
                            </div>
                            <div class="classified-info">
                                <p class="classified-title mb-0">{{$job->title}}</p>
                                <p class="card-subtitle-small mb-1">— {{$job->category?->title}}</p>
                                <p class="card-subtitle-small mb-0">{{ str_limit( $job->user->company ?? $job->user->name ?? 'Admin', 20 ) }} - {{$job->type?->title}}</p>
                            </div>
                            <a href="{{ route('jobs.show', $job) }}" class="btn btn-small-square ms-auto rounded-pill" style="background-color: var(--color-accent-jobs); color: var(--color-text-light);">Apply</a>
                        </div>
                    </div>
                    @endforeach

                    @foreach($classifiedsFeatured->take(2) as $classified)
                    <div class="col">
                        <div class="list-card d-flex align-items-center">
                            <div class="list-thumbnail me-3">
                                <img src="{{$classified->primary_image_url}}" alt="{{$classified->title}}" style="height:80px; width:80px; object-fit: cover;">
                            </div>
                            <div class="classified-info">
                                <p class="classified-title mb-0">{{$classified->title}}</p>
                                <p class="card-subtitle-small mb-1">{{$classified->category?->title}} — {{$classified->type?->title ?? 'Other'}} <span class="badge {{ $classified->condition_badge_class }}">{{ $classified->condition_label }}</span></p>
                                <p class="card-subtitle-small mb-0">Seller: {{ str_limit( $job->user->company ?? $job->user->name ?? 'Unknown', 20 ) }}</p>
                            </div>
                            <a href="{{ route('classifieds.show', $classified) }}" class="btn btn-small-square ms-auto rounded-pill" style="background-color: var(--color-accent-services); color: var(--color-text-light);">View</a>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
            </section>
        </main>
    </div>
</div>
@endsection