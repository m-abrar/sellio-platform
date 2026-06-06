@extends('frontend._layouts._app')
@section('title', 'Interactive Marketplace')
@push('styles')
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">

    <style>
    /* Base Styles */
    :root {
        --bs-body-font-family: 'Inter', sans-serif;
        --bs-heading-font-family: 'Poppins', sans-serif;
        --bg-light: #F9FAFB;
        --bg-secondary-light: #F3F4F6;
        --color-indigo: #4F46E5; /* Primary Brand Color (Properties) */
        --color-cyan: #22D3EE; /* Autos Color */
        --color-green: #10B981; /* Jobs Color */
        --color-orange: #F97316; /* Services Color */
        --color-teal: #14B8A6; /* Classifieds Color */
        --color-red: #EF4444; /* Events Color */
        --color-violet: #8B5CF6; /* CTA Gradient Secondary */
        --button-height: 2.5rem; 
        --card-button-height: 2.25rem; 
    }
    </style>
@endpush
    @section('content')

    <section class="hero-section mb-5 bg-white">
        <div class="container py-5 position-relative z-1">
            <div class="row align-items-center">
                <div class="col-lg-7">
                    <h1 class="display-2 fw-bold mb-4 hero-headline text-dark">
                        {!! page_content('home.hero.heading', 'The Dynamic <span class="text-indigo-hero">Marketplace</span> Reimagined') !!}
                    </h1>
                    <p class="lead mb-4 fs-4 text-secondary">
                        {{ page_content('home.hero.subheading', 'Engage, Explore, and Interact with Your next great find. Experience listings like never before.') }}
                    </p>
                    <div class="d-flex gap-3">
                        <a href="#categories" class="btn btn-primary-interactive btn-interactive hero-cta-btn btn-lg rounded-0 px-5">{{ page_content('home.hero.button', 'Explore Listings') }}</a>
                        <a href="{{route('dashboard.partner.welcome')}}" class="btn btn-secondary-interactive btn-interactive hero-cta-btn btn-lg rounded-0 px-5">{{ page_content('home.hero.button2', 'Post a Listing') }}</a>
                    </div>
                </div>
                <div class="col-lg-5 d-none d-lg-block">
                    <img src="{{ page_content('home.hero.image', 'https://picsum.photos/1200/400?random=1&blur=2') }}" class="img-fluid rounded-0" alt="{{ page_content('home.hero.image_alt', 'Hero Image' ) }}">
                </div>
            </div>
        </div>
    </section>

    <section id="categories" class="container py-5">
        <h2 class="text-center mb-5 display-5">{{ page_content('home.categories.heading', 'Select Your Interactive Experience') }}</h2>
        <div class="row g-4 justify-content-center">
            
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('properties.index')}}" class="category-tile tile-properties text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-house-door-fill"></i></div>
                    <p class="h5 mb-0 fw-bold">Properties</p>
                </a>
            </div>
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('autos.index')}}" class="category-tile tile-autos text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-car-front-fill"></i></div>
                    <p class="h5 mb-0 fw-bold">Autos</p>
                </a>
            </div>
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('jobs.index')}}" class="category-tile tile-jobs text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-briefcase-fill"></i></div>
                    <p class="h5 mb-0 fw-bold">Jobs</p>
                </a>
            </div>
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('services.index')}}" class="category-tile tile-services text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-tools"></i></div>
                    <p class="h5 mb-0 fw-bold">Services</p>
                </a>
            </div>
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('classifieds.index')}}" class="category-tile tile-classifieds text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-tags-fill"></i></div>
                    <p class="h5 mb-0 fw-bold">Classifieds</p>
                </a>
            </div>
            <div class="col-6 col-md-4 col-lg-3 col-xl-2">
                <a href="{{route('events.index')}}" class="category-tile tile-events text-center rounded-0">
                    <div class="icon-wrapper rounded-0"><i class="bi bi-calendar-event-fill"></i></div>
                    <p class="h5 mb-0 fw-bold">Events</p>
                </a>
            </div>
        </div>
    </section>

    <section id="properties" class="container module-section module-properties">
        <div class="module-header">
            <h2 class="display-5 fw-bold text-dark">
                <i class="bi bi-house-door me-2"></i> {{ page_content('home.properties.heading', 'Premium Properties') }}
            </h2>
            <a href="{{route('properties.index')}}" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.properties.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row">
            @foreach($propertiesFeatured->random(4) as $property)
            <div class="col-lg-3 col-md-6">
                <div class="card interactive-card rounded-0">
                    <div class="position-relative card-img-container {{ $property->is_rental ?? card-property-rent }}">
                        <img src="{{$property->primary_image_url}}" class="card-img-top rounded-0" alt="{{$property->title}}">
                        @if($property->is_featured)
                            <span class="status-badge rounded-0">FEATURED</span>
                        @endif
                        @if($property->is_sale)
                            <span class="type-badge rounded-0">FOR SALE</span>
                        @elseif($property->is_rental)
                            <span class="type-badge rounded-0">FOR RENT</span>
                        @endif
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-dark fs-5 fw-bold">{{ str_limit($property->title, 20) }}</h3>
                        <p class="card-text mb-2 text-muted small">
                            <i class="bi bi-geo-alt-fill me-1"></i> {{ str_limit($property->address ?? $property?->location?->title ?? '', 20) }}
                        </p>
                        <div class="d-flex justify-content-between small text-secondary mb-3">
                            <span><i class="bi bi-bed-fill me-1"></i> {{$property->number_of_bedrooms}} Beds</span>
                            <span><i class="bi bi-bathtub-fill me-1"></i> {{$property->number_of_bathrooms}} Baths</span>
                            <span><i class="bi bi-arrows-fullscreen me-1"></i> {{$property->area_formatted}}</span>
                        </div>
                        <p class="fw-bold text-success fs-5 mb-3">{{$property->price_formatted_k}}</p>
                        <a href="{{route('properties.show', $property)}}" class="btn btn-sm btn-view-item rounded-0">View Listing</a>
                    </div>
                </div>
            </div>
            @endforeach
            

        </div>
    </section>

    <section id="autos" class="module-section module-autos rounded-0 mt-5">
        <div class="container">
            <div class="module-header">
                <h2 class="display-5 fw-bold text-dark">
                    <i class="bi bi-car-front me-2"></i> {{ page_content('home.autos.heading', 'Dynamic Autos') }}
                </h2>
                <a href="#" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.autos.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
            </div>
            <div class="row">
                @foreach($autosFeatured->take(4) as $auto)
                <div class="col-lg-3 col-md-6">
                    <div class="card interactive-card rounded-0">
                        <div class="position-relative card-img-container">
                            <img src="{{$auto->primary_image_url}}" class="card-img-top rounded-0" alt="{{$auto->title}}">
                        </div>
                        <div class="card-body">
                            <h3 class="card-title text-dark fs-5 fw-bold">{{$auto->title}}</h3>
                            <div class="d-flex justify-content-between small text-muted mb-2">
                                <span><i class="bi bi-calendar-event me-1"></i> {{$auto->year}}</span>
                                <span><i class="bi bi-speedometer2 me-1"></i> {{$auto->mileage_formatted}}</span>
                            </div>
                            <p class="card-text mb-3 small text-cyan">
                                <i class="bi bi-speedometer2 me-1"></i> {{$auto->transmission}} | 
                                <i class="bi bi-gear-wide-connected me-1"></i> {{$auto->engine_type}} | 
                                <i class="bi bi-truck-front-fill me-1"></i> {{$auto->drivetrain}}
                            </p>
                            <p class="fw-bold text-dark fs-5 mb-3">{{$auto->price_formatted}}</p>
                            <a href="{{ route('autos.show', $auto) }}" class="btn btn-sm btn-view-item rounded-0">View Listing</a>
                        </div>
                    </div>
                </div>
                @endforeach
                
                
            </div>
        </div>
    </section>


    <section id="jobs" class="container module-section module-jobs">
        <div class="module-header d-flex justify-content-between align-items-center">
            <h2 class="display-5 fw-bold text-dark">
                <i class="bi bi-briefcase me-2"></i> {{ page_content('home.jobs.heading', 'Top Tier Job Listings') }}
            </h2>
            <a href="#" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.jobs.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
        </div>

        <div class="d-grid gap-3">

            <!-- Job Card -->
             @foreach($jobsFeatured->take(3) as $job)
            <div class="interactive-card rounded-0 text-decoration-none p-3">
                <div class="job-card-content d-flex flex-column h-100 w-100">
                    
                    <!-- Title + Price row -->
                    <div class="d-flex justify-content-between align-items-center mb-1 w-100">
                        <h3 class="text-dark fs-5 fw-bold mb-0">{{ $job->title }}</h3>
                        <small class="fw-bold fs-6 text-success">{{ $job->salary_range_full_formatted }}</small>
                    </div>

                    <p class="mb-1 small text-muted w-100">
                        <i class="bi bi-building me-1"></i> {{ $job->user->company ?? $job->user->name }} | 
                        <i class="{{ $job->category?->icon ?? 'fas fa-tag'}} me-1"></i> {{ $job->category?->title }} | 
                        <i class="{{ $job->type?->icon ?? 'bi bi-briefcase-fill'}} me-1"></i> {{ $job->type?->title }}
                    </p>
                    <small class="text-secondary d-block mb-2 w-100">Design and oversee scalable microservices architecture. Must have 10+ years experience.</small>

                    <!-- Bottom row: Dates + Button -->
                    <div class="d-flex justify-content-between align-items-center mt-auto w-100">
                        <div class="small text-muted">
                            <span class="me-3"><i class="bi bi-calendar-check me-1 text-success"></i><strong>Deadline:</strong> {{ $job->application_deadline->format('M j, Y') }}</span>
                            <span><i class="bi bi-calendar-event me-1"></i><strong>Posted:</strong> {{ $job->created_at->diffForHumans() }}</span>
                        </div>
                        <a href="{{ route('jobs.show', $job) }}" class="btn btn-sm btn-apply-now btn-interactive rounded-0 px-4">Apply Now <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
            @endforeach


        </div>
    </section>



    <section id="services" class="container module-section module-services">
        <div class="module-header">
            <h2 class="display-5 fw-bold text-dark">
                <i class="bi bi-tools me-2"></i> {{ page_content('home.services.heading', 'Professional Services') }}
            </h2>
            <a href="{{ route('services.index') }}" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.services.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row">
            @foreach($servicesFeatured->take(3) as $service)
            <div class="col-lg-4 col-md-6">
                <div class="card interactive-card rounded-0">
                    <div class="position-relative card-img-container">
                        <img src="{{$service->primary_image_url}}" class="card-img-top rounded-0" alt="{{$service->title}}">
                        @if ($service->is_featured)
                        <span class="status-badge rounded-0">TOP PICK</span>
                        @endif
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-dark fs-5 fw-bold"><i class="{{ $service->category?->icon ?? 'fas fa-tag'}} me-1"></i> {{$service->title}}</h3>
                        <p class="card-text mb-2 small text-muted text-orange-service">
                            <i class="bi bi-building me-1"></i> {{ str_limit( $service->user->company ?? $service->user->name ?? 'Unknown', 20 ) }} | Starting at ${{ number_format($service->sale_price, 0) }}
                        </p>
                        <p class="small text-secondary mb-3">{{$service->short_description??''}}</p>
                        <a href="{{ route('services.show', $service) }}" class="btn btn-sm btn-view-item rounded-0">
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
            </div>
            @endforeach


        </div>
    </section>
    
    <section id="classifieds" class="container module-section module-classifieds">
        <div class="module-header">
            <h2 class="display-5 fw-bold text-dark">
                <i class="bi bi-tags me-2"></i> {{ page_content('home.classifieds.heading', 'Local Classifieds') }}
            </h2>
            <a href="#" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.classifieds.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row">
            @foreach($classifiedsFeatured->take(4) as $classified)
            <div class="col-lg-3 col-md-6">
                <div class="card interactive-card rounded-0">
                    <div class="position-relative card-img-container">
                        <img src="{{$classified->primary_image_url}}" class="card-img-top rounded-0" alt="{{$classified->title}}">
                        @if($classified->is_featured)<span class="status-badge rounded-0">URGENT/FEATURED</span>@endif
                    </div>
                    <div class="card-body">
                        <h3 class="card-title text-dark fs-5 fw-bold">{{$classified->title}}</h3>
                        <p class="card-text mb-2 small text-teal-classified">
                            <i class="{{ $classified->category?->icon ?? 'fas fa-tag'}} me-1"></i>{{$classified->category?->title}} | {{$classified->condition_label}}
                        </p>
                        <p class="fw-bold text-dark fs-5 mb-3">{{$classified->price_formatted}}</p>
                        <a href="{{ route('classifieds.show', $classified) }}" class="btn btn-sm btn-view-item rounded-0">View Listing</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    <section class="cta-section py-5 my-5">
        <div class="container text-center py-5">
            <h2 class="display-4 fw-bold mb-4 text-white">
                <i class="bi bi-lightning-charge-fill me-2"></i> {{ page_content('home.cta.heading', 'Join the Interaction Revolution') }}
            </h2>
            <p class="lead mb-5 fs-4 text-light">
                {{ page_content('home.cta.subheading', 'Ready to list your item or find your next opportunity? Get started in seconds.') }}
            </p>
            <a href="#" class="btn btn-cta-interactive btn-lg rounded-0 px-5">{{ page_content('home.cta.button', 'Engage Now') }} <i class="bi bi-arrow-right"></i></a>
        </div>
    </section>
    
    <section id="events" class="container module-section module-events">
        <div class="module-header">
            <h2 class="display-5 fw-bold text-dark">
                <i class="bi bi-calendar-event me-2"></i> {{ page_content('home.events.heading', 'Local Events') }}
            </h2>
            <a href="#" class="btn btn-sm btn-view-all rounded-0">{{ page_content('home.events.button', 'View All') }} <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row">
            @foreach($eventsFeatured->take(3) as $event)
            <div class="col-lg-4 col-md-6">
                <div class="card interactive-card rounded-0 p-0">
                    <div class="position-relative">
                        <img src="{{$event->primary_image_url}}" class="card-img-top rounded-0 event-card-img" alt="{{$event->title}}">
                        <span class="status-badge position-absolute text-white event-badge-live">{{$event->category?->title}}</span>
                        <div class="event-card-date">
                            <small>{{$event->start_date_time->format('M')}}</small>{{$event->start_date_time->format('d')}}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex w-100 justify-content-between align-items-center mb-3">
                            <div>
                                <h3 class="mb-0 text-dark fs-5 fw-bold">{{$event->title}}</h3>
                                <small class="text-muted"><i class="bi bi-geo-alt me-1"></i> {{ $event->address ?? $event?->location?->title ?? '' }} | {{$event->price_formatted}}</small>
                            </div>
                            <img src="{{$event->user?->avatar_url}}" alt="{{$event->user?->name}}" class="host-profile shadow-sm">
                        </div>
                        <a href="{{ route('events.show', $event) }}" class="btn btn-sm btn-view-item rounded-0">Get Tickets</a>
                    </div>
                </div>
            </div>
            @endforeach

            
        </div>
    </section>

    @endsection
