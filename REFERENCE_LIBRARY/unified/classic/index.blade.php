{{-- resources/views/frontend/themes/unifieds/classic/index.blade.php --}}
@extends('frontend._layouts._app')
@section('title', 'Universal Classic')


@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">

<style>
:root {
    --color-primary: #4A4E69; /* Muted Deep Blue/Gray */
    --color-accent: #9A8C98; /* Muted Rose */
    --color-background: #F4F3EE; /* Subtle Off-White/Cream */
    --color-card-bg: #FFFFFF;
    --color-text-dark: #222222;
    --color-text-light: #777777;
    --font-serif: 'Playfair Display', serif;
    --font-sans: 'Roboto', sans-serif;
    --shadow-subtle: 0 2px 5px rgba(0, 0, 0, 0.08); /* Slightly stronger shadow */
    --shadow-hover: 0 5px 15px rgba(0, 0, 0, 0.15);

}
</style>
@endpush


@section('content')
<main>
        <section class="hero">
            <div class="container">
                <h1>{{ page_content('home.hero.heading', 'Find Your Next Classic Treasure') }}</h1>
                <p>{{ page_content('home.hero.subheading', 'Browse local properties, vehicles, services, and classifieds in your area.') }}</p>
                <a href="{{route('properties.index')}}" class="btn">{{ page_content('home.hero.button', 'Start Exploring') }}</a>
            </div>
        </section>
        
        <div class="container">

            <section id="properties">
                <div class="section-header-row">
                    <h2 class="section-heading">{{ page_content('home.properties.heading', 'Properties') }}</h2>
                    <a href="{{route('properties.index')}}" class="btn-link">{{ page_content('home.properties.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="grid-layout properties-grid">
                    
                    @foreach($propertiesFeatured->take(3) as $property)
                    <div class="card">
                        <div class="card-image" style="background-image: url('{{$property->primary_image_url}}')">
                            <span class="badge badge-price">{{$property->price_formatted_k}}</span>
                            @if($property->is_sale)
                                <span class="badge badge-new">For Sale</span>
                            @elseif($property->is_rental)
                                <span class="badge badge-new" style="background-color: #38A3A5;">Rental</span>
                            @endif
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">{{$property->title}}</h3>
                            <p class="card-detail">
                                <span title="Location"><i class="fas fa-map-marker-alt card-icon"></i> {{ str_limit($property->address ?? $property?->location?->title ?? '', 20) }}</span>
                                <span title="Bedrooms"><i class="fas fa-bed card-icon"></i> {{$property->number_of_bedrooms}} Bed</span>
                                <span title="Bathrooms"><i class="fas fa-shower card-icon"></i> {{$property->number_of_bathrooms}} Bath</span>
                            </p>
                            <a href="{{route('properties.show', $property)}}" class="btn">View Details</a>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
            </section>
            
            <div class="section-separator"></div>

            <section id="events">

                <div class="section-header-row">
                    <h2 class="section-heading">{{ page_content('home.events.heading', 'Events') }}</h2>
                    <a href="/events" class="btn-link">{{ page_content('home.events.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="grid-layout events-grid">
                    
                    @foreach($eventsFeatured->take(3) as $event)
                    <div class="card event-card">
                        <div class="event-banner" style="background-image: url('{{$event->primary_image_url}}');"></div>
                        <div class="event-content">
                            <h3 class="card-title">{{$event->title}}</h3>
                            <p class="event-date"><i class="far fa-calendar-alt card-icon"></i> {{ $event->start_date_time->format('l, F jS') }}</p>
                            <p class="event-location"><i class="fas fa-map-pin card-icon"></i> {{ $event->address ?? $event?->location?->title ?? '' }}</p>
                            <a href="{{route('events.show', $event)}}" class="btn">Get Tickets</a>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
            </section>
            
            <div class="section-separator"></div>

            <section id="autos">

                <div class="section-header-row">
                    <h2 class="section-heading">{{ page_content('home.autos.heading', 'Autos') }}</h2>
                    <a href="{{ route('autos.index') }}" class="btn-link">{{ page_content('home.autos.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>


                <div class="grid-layout autos-grid">
                    
                    @foreach($autosFeatured->take(3) as $auto)
                    <div class="card">
                        <div class="card-image" style="background-image: url('{{$auto->primary_image_url}}')">
                            <span class="badge badge-price">{{$auto->price_formatted_k}}</span>
                            @if($auto->is_new)
                            <span class="badge badge-new">New Listing</span>
                            @endif
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">{{$auto->title}} - {{$auto->drivetrain}}</h3>
                            <p class="card-detail">
                                <span title="Mileage"><i class="fas fa-tachometer-alt card-icon"></i> {{$auto->mileage_formatted}}</span> 
                                <span title="Fuel Type"><i class="fas fa-bolt card-icon"></i> {{$auto->engine_type}}</span>
                                <span title="Transmission"><i class="fas fa-cogs card-icon"></i> {{$auto->transmission}}</span>
                            </p>
                            <a href="{{ route('autos.show', $auto) }}" class="btn">Quick View</a>
                        </div>
                    </div>
                    @endforeach
                    
                    
                </div>
            </section>
            
            <div class="section-separator"></div>

            <section id="services">

                <div class="section-header-row">
                    <h2 class="section-heading">{{ page_content('home.services.heading', 'Services') }}</h2>
                    <a href="{{ route('services.index') }}" class="btn-link">{{ page_content('home.services.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>


                <div class="grid-layout services-grid">
                    
                    @foreach($servicesFeatured->take(4) as $service)
                    <div class="card service-card">
                        <div class="card-content">
                            <h3 class="card-title"><i class="{{ $service?->category?->icon ?? 'fas fa-wrench' }} card-icon"></i> {{$service->title}}</h3>
                            
                            
                            <p class="card-detail">
                                <span><i class="fas fa-map-marker-alt card-icon"></i> {{ $service?->location?->title }}</span>
                                <span><i class="fas fa-star card-icon" style="color: gold;"></i> {{$service->rating_average ?? '5'}} Rating</span>
                            </p>
                            <p class="card-detail">
                                <span>{{ $service?->category?->title }}</span> | <span> {{ str_limit($service?->type?->title,20) }}</span>
                            </p>
                            <a href="{{ route('services.show', $service) }}" class="btn">
                                @if ($service->is_project_based)
                                    Call for Quote
                                @elseif ($service->is_subscription)
                                    View Schedule
                                @else
                                    Book Now
                                @endif
                            </a>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
            </section>
            
            <div class="section-separator"></div>

            <section id="jobs">
                <div class="section-header-row d-flex justify-content-between align-items-center mb-4">
                    <h2 class="section-heading mb-0">{{ page_content('home.jobs.heading', 'Jobs') }}</h2>
                    <a href="{{ route('jobs.index') }}" class="btn-link">{{ page_content('home.jobs.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>

                <div class="job-list">
                    @foreach($jobsFeatured->take(3) as $job)
                    <div class="card job-card p-3 mb-3 d-flex flex-row justify-content-between align-items-center">
                        <div class="job-info">
                            <div class="job-title fw-bold mb-1">
                            <i class="{{ $job->category?->icon ?? 'fas fa-user' }}  card-icon me-2"></i> {{ $job->title }}
                            </div>
                            <div class="job-company mb-1">
                            {{ $job->user->company ?? $job->user->name }} <span class="job-location ms-2 text-muted"><i class="fas fa-map-pin me-1"></i> {{ $job->address ?? $job->location?->title }}</span>
                            </div>
                            <div class="job-details text-muted small">
                            <span class="me-3"><i class="fas fa-sack-dollar me-1"></i> {{ $job->salary_range_formatted }}</span>
                            <span class="me-3"><i class="fas fa-briefcase me-1"></i> {{ $job->category?->title }}</span>
                            <span class="me-3"><i class="fas fa-clock me-1"></i> {{ $job->type?->title }}</span>
                            <span><i class="fas fa-calendar-alt me-1"></i> Posted {{ $job->created_at->diffForHumans() }}</span>
                            </div>
                        </div>
                        <a href="{{ route('jobs.show', $job) }}" class="btn apply-btn ms-3">Apply Now</a>
                    </div>
                    @endforeach

                </div>
            </section>

            
            <div class="section-separator"></div>

            <section id="classifieds">

                <div class="section-header-row">
                    <h2 class="section-heading">{{ page_content('home.classifieds.heading', 'Classifieds') }}</h2>
                    <a href="{{route('classifieds.index')}}" class="btn-link">{{ page_content('home.classifieds.button', 'View More') }} <i class="fas fa-arrow-right"></i></a>
                </div>


                <div class="grid-layout classifieds-grid">
                    @foreach($classifiedsFeatured->take(3) as $classified)
                    <div class="card">
                        <div class="card-image" style="background-image: url('{{$classified->primary_image_url}}')">
                            <span class="badge badge-price">{{$classified->price_formatted_k}}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">{{$classified->title}}</h3>
                            <p class="card-detail">
                                <i class="fas fa-user card-icon"></i> Seller: {{ str_limit( $classified->user->company ?? $classified->user->name ?? 'Unknown', 20 ) }}<br/>
                                <i class="fas fa-tag card-icon"></i> {{$classified->category?->title}}
                            </p>
                            <a href="{{ route('classifieds.show', $classified) }}" class="btn">View Item</a>
                        </div>
                    </div>
                    @endforeach
                    
                </div>
                
            </section>
            
        </div>
        
    </main>
@endsection