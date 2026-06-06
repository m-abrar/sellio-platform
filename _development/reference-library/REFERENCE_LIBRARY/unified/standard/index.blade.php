<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MegaHub - Pixel Perfect Layout</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        /* BASE & TYPOGRAPHY */
        :root {
            --bs-primary: #0d6efd;
            --color-properties: #008080; /* Teal */
            --color-events: #F97316; /* Orange */
            --color-autos: #1E3A8A; /* Dark Blue */
            --color-services: #16A34A; /* Green */
            --color-jobs: #7C3AED; /* Purple */
            --color-classifieds: #DC2626; /* Red */
        }
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5; /* Slightly off-white background to match mockup */
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
        }
        .text-teal { color: var(--color-properties) !important; }
        .text-orange { color: var(--color-events) !important; }
        .text-darkblue { color: var(--color-autos) !important; }
        .text-green { color: var(--color-services) !important; }
        .text-purple { color: var(--color-jobs) !important; }
        .text-red { color: var(--color-classifieds) !important; }

        /* NAVBAR */
        .navbar-brand { font-weight: 700; font-size: 1.5rem; }
        .category-nav .nav-link {
            border-radius: 50px;
            padding: 5px 15px;
            font-size: 0.9rem;
            font-weight: 500;
            margin-right: 5px;
            color: #495057;
            border: 1px solid transparent;
            transition: all 0.3s;
        }
        /* Color mapping for Category Nav */
        .category-nav .nav-link[href="#"]:nth-child(1) { color: var(--color-properties); }
        .category-nav .nav-link[href="#"]:nth-child(2) { color: var(--color-events); }
        .category-nav .nav-link[href="#"]:nth-child(3) { color: var(--color-autos); }
        .category-nav .nav-link[href="#"]:nth-child(4) { color: var(--color-services); }
        .category-nav .nav-link[href="#"]:nth-child(5) { color: var(--color-jobs); }
        .category-nav .nav-link[href="#"]:nth-child(6) { color: var(--color-classifieds); }

        /* HERO */
        .hero-banner {
            background-color: #fff; /* Use white background to match mockup */
            border-radius: 15px;
            padding: 40px; /* Reduced padding for tighter look */
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            margin-top: 30px;
        }
        .hero-title { font-size: 2.5rem; color: #1f2937; margin-bottom: 20px;}
        .search-bar {
            background-color: #fff;
            border-radius: 10px;
            padding: 10px;
            border: 1px solid #dee2e6;
            box-shadow: none; /* Removed redundant inner shadow */
        }
        .search-bar .form-control {
            border: none;
            box-shadow: none;
            padding: 5px 15px;
            font-size: 1.1rem;
        }
        .search-bar .btn {
            border-radius: 8px;
            padding: 10px 25px;
            background-color: var(--bs-primary);
            border-color: var(--bs-primary);
        }
        .hero-collage {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 30px;
        }
        .hero-collage img {
            width: 100%;
            height: 100px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s;
        }
        .hero-collage img:hover { transform: translateY(-3px); }

        /* CARDS & LISTINGS */
        .card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.2s ease-in-out, box-shadow 0.2s;
            background-color: #fff;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }
        .card-img-top {
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            height: 150px; /* Adjusted height to match mockup visual ratio */
            object-fit: cover;
        }
        .card-body { padding: 15px; }
        .card-title { font-weight: 700; font-size: 1.1rem; }
        .card-text { font-size: 0.9rem; }
        .btn-sm { padding: 5px 15px; font-size: 0.85rem; }

        /* TRENDING TABS */
        .category-tab .nav-link {
            border-radius: 50px;
            padding: 8px 20px;
            margin: 0 5px 10px;
            font-weight: 500;
            border: 1px solid #dee2e6;
            background-color: #fff;
            color: #6c757d;
        }
        .category-tab .nav-link.active {
            color: #fff !important;
            border-color: var(--bs-primary);
            background-color: var(--bs-primary) !important;
        }
        /* Accent overrides for tabs to match mockup */
        #properties-tab.active { background-color: var(--color-properties) !important; border-color: var(--color-properties); }
        #events-tab.active { background-color: var(--color-events) !important; border-color: var(--color-events); }
        #autos-tab.active { background-color: var(--color-autos) !important; border-color: var(--color-autos); }
        #services-tab.active { background-color: var(--color-services) !important; border-color: var(--color-services); }
        #jobs-tab.active { background-color: var(--color-jobs) !important; border-color: var(--color-jobs); }
        #classifieds-tab.active { background-color: var(--color-classifieds) !important; border-color: var(--color-classifieds); }







        .category-spotlight-card {
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            height: 250px;
            display: flex;
            align-items: flex-end;
            padding: 20px;
            color: #fff;
            text-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        }
        .category-spotlight-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%);
            z-index: 1;
        }
        .category-spotlight-card img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
            transition: transform 0.3s ease;
        }
        .category-spotlight-card:hover img {
            transform: scale(1.05);
        }
        .category-spotlight-card .content {
            position: relative;
            z-index: 2;
        }
        .category-spotlight-card .btn {
            border-radius: 50px;
            font-size: 0.9em;
            padding: 8px 20px;
            background-color: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.5);
            color: #fff;
            transition: background-color 0.3s ease;
        }
        .category-spotlight-card .btn:hover {
            background-color: #fff;
            color: #333;
        }











        /* STATISTICS */
        .stats-icon { font-size: 3.5em; margin-bottom: 10px; }
        .stats-section .fw-bold { font-size: 2rem; }

        /* HOW IT WORKS */
        .how-it-works-icon {
            font-size: 3em;
            color: var(--bs-primary);
            background-color: #e3f2fd;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
        }

        
        /* TESTIMONIALS */

        .testimonial-card {
        background: #fff;
        }


        .testimonial-img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border: 4px solid var(--bs-primary);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
        }

        .carousel-indicators [data-bs-target] {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--bs-primary);
        opacity: 0.3;
        transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .carousel-indicators .active {
        opacity: 1;
        transform: scale(1.2);
        }



        /* CTA */
        .cta-banner {
            background-color: var(--bs-primary);
            border-radius: 15px;
            padding: 80px 0;
            box-shadow: 0 10px 30px rgba(13, 110, 253, 0.4);
            color: #fff;
        }

        /* FOOTER */



        footer {
            background-color: #212529;
            color: #adb5bd;
            padding: 60px 0 30px;
        }
        footer a {
            color: #adb5bd;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        footer a:hover {
            color: #0d6efd;
        }
        .footer-logo {
            font-weight: 700;
            color: #fff;
            font-size: 1.5em;
        }


    </style>
</head>
<body>

    <nav class="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
        <div class="container">
            <a class="navbar-brand text-primary" href="#">MegaHub</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav category-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="#">Properties</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Events</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Autos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Jobs</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Classifieds</a>
                    </li>
                </ul>
                <a class="btn btn-outline-primary rounded-pill px-4 d-none d-lg-inline-flex" href="#"><i class="bi bi-person-circle me-1"></i> Sign In</a>
            </div>
        </div>
    </nav>

    <main>
        
        <section class="container hero-banner text-center">
            <h1 class="hero-title fw-bold">{{ page_content('home.hero.heading', 'Search and Discover Anything') }}</h1>
            <p class="lead mb-4 text-secondary">{{ page_content('home.hero.paragraph', 'Find properties, events, vehicles, services, jobs, and classifieds quickly.') }}</p>
            
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <form class="d-flex search-bar">
                        <i class="bi bi-search text-muted fs-4 align-self-center mx-2"></i>
                        <input class="form-control me-2" type="search" placeholder="Search for properties, services, or events..." aria-label="Search">
                        <button class="btn btn-primary" type="submit"><i class="bi bi-arrow-right"></i></button>
                    </form>
                </div>
            </div>
            
            <div class="hero-collage d-none d-lg-grid">
                <img src="{{ page_content('home.hero.image_1', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae') }}" alt="{{ page_content('home.hero.image_1_alt', 'Property Collage') }}">
                <img src="{{ page_content('home.hero.image_2', 'https://images.unsplash.com/photo-1515169067865-5387ec356754') }}" alt="{{ page_content('home.hero.image_2_alt', 'Event Collage') }}">
                <img src="{{ page_content('home.hero.image_3', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70') }}" alt="{{ page_content('home.hero.image_3_alt', 'Auto Collage') }}">
                <img src="{{ page_content('home.hero.image_4', 'https://images.unsplash.com/photo-1521791136064-7986c2920216') }}" alt="{{ page_content('home.hero.image_4_alt', 'Service Collage') }}">
            </div>
        </section>

        <hr class="d-none">

        <section class="container my-5 py-4">
            <h2 class="mb-5 text-center">{{ page_content('home.trending.heading', 'Trending Listings') }}</h2>
            <ul class="nav nav-pills justify-content-center mb-5 category-tab" id="trendingTabs" role="tablist">
                <li class="nav-item" role="presentation"><button class="nav-link active" id="properties-tab" data-bs-toggle="tab" data-bs-target="#trendingProperties" type="button" role="tab" aria-controls="trendingProperties" aria-selected="true">{{ page_content('home.trending.tab_properties', 'Properties') }}</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#trendingEvents" type="button" role="tab" aria-controls="trendingEvents" aria-selected="false">{{ page_content('home.trending.tab_events', 'Events') }}</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="autos-tab" data-bs-toggle="tab" data-bs-target="#trendingAutos" type="button" role="tab" aria-controls="trendingAutos" aria-selected="false">{{ page_content('home.trending.tab_autos', 'Autos') }}</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#trendingServices" type="button" role="tab" aria-controls="trendingServices" aria-selected="false">{{ page_content('home.trending.tab_services', 'Services') }}</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="jobs-tab" data-bs-toggle="tab" data-bs-target="#trendingJobs" type="button" role="tab" aria-controls="trendingJobs" aria-selected="false">{{ page_content('home.trending.tab_jobs', 'Jobs') }}</button></li>
                <li class="nav-item" role="presentation"><button class="nav-link" id="classifieds-tab" data-bs-toggle="tab" data-bs-target="#trendingClassifieds" type="button" role="tab" aria-controls="trendingClassifieds" aria-selected="false">{{ page_content('home.trending.tab_classifieds', 'Classifieds') }}</button></li>
            </ul>

            <div class="tab-content" id="trendingTabsContent">
                
                <div class="tab-pane fade show active" id="trendingProperties" role="tabpanel" aria-labelledby="properties-tab">
                    <div class="row g-4">
                        @foreach($propertiesTrending->take(4) as $property)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$property->primary_image_url}}" class="card-img-top" alt="{{$property->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$property->title}}</h5>
                                    <p class="card-text text-muted">{{ $property->address ?? $property?->location?->title ?? '' }} | <strong class="text-teal">{{$property->price_formatted_k}}</strong></p>
                                    <a href="{{ route('properties.show', $property) }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Details</a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="tab-pane fade" id="trendingEvents" role="tabpanel" aria-labelledby="events-tab">
                    <div class="row g-4">
                        @foreach($eventsTrending->take(4) as $event)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$event->primary_image_url}}" class="card-img-top" alt="{{$event->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$event->title}}</h5>
                                    <p class="card-text text-muted">
                                        <strong class="text-orange">{{$event->start_date_time->format('M d')}}</strong> | {{ $event->address ?? $event?->location?->title ?? '' }}
                                    </p>
                                        <a href="{{ route('events.show', $event) }}" class="btn btn-sm btn-outline-secondary rounded-pill">Get Tickets</a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="tab-pane fade" id="trendingAutos" role="tabpanel" aria-labelledby="autos-tab">
                    <div class="row g-4">
                        @foreach($autosTrending->take(4) as $auto)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$auto->primary_image_url}}" class="card-img-top" alt="{{$auto->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$auto->title}}</h5>
                                    <p class="card-text text-muted">{{$auto->year}} | <strong class="text-darkblue">{{$auto->price_formatted}}</strong></p>
                                    <a href="{{ route('autos.show', $auto) }}" class="btn btn-sm btn-outline-secondary rounded-pill">See Listing</a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="tab-pane fade" id="trendingServices" role="tabpanel" aria-labelledby="services-tab">
                    <div class="row g-4">
                        @foreach($servicesTrending->take(4) as $service)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$service->primary_image_url}}" class="card-img-top" alt="{{$service->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$service->title}}</h5>
                                        <p class="card-text text-muted">{{$service->category?->title}} — {{$service->type?->title ?? 'Other'}} | 
                                        <strong class="text-green">Starting at ${{ number_format($service->sale_price, 0) }}</strong>
                                        </p>
                                    <a href="{{ route('services.show', $service) }}" class="btn btn-sm btn-outline-secondary rounded-pill">
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
                </div>
                
                <div class="tab-pane fade" id="trendingJobs" role="tabpanel" aria-labelledby="jobs-tab">
                    <div class="row g-4">
                        @foreach($jobsTrending->take(4) as $job)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$job->primary_image_url}}" class="card-img-top" alt="{{$job->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$job->title}}</h5>
                                    <p class="card-text text-muted">{{ str_limit( $job->user->company ?? $job->user->name ?? 'Unknown', 20 ) }} | <strong class="text-purple">{{$job->type?->title ?? 'Other'}}</strong></p>
                                    <a href="{{ route('jobs.show', $job) }}" class="btn btn-sm btn-outline-secondary rounded-pill">Apply Now</a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
                
                <div class="tab-pane fade" id="trendingClassifieds" role="tabpanel" aria-labelledby="classifieds-tab">
                    <div class="row g-4">
                        @foreach($classifiedsTrending->take(4) as $classified)
                        <div class="col-md-6 col-lg-3">
                            <div class="card">
                                <img src="{{$classified->primary_image_url}}" class="card-img-top" alt="{{$classified->title}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{$classified->title}}</h5>
                                    <p class="card-text text-muted">{{$classified->condition_label}} | <strong class="text-red">{{$classified->price_formatted}}</strong></p>
                                    <a href="{{ route('classifieds.show', $classified) }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Ad</a>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </section>

        <hr>

        <section class="container my-5 py-4">
            <h2 class="mb-5 text-center">{{ page_content('home.featured.heading', 'Featured Listings') }}</h2>
            <div class="row g-4 justify-content-center">
                @foreach($propertiesFeatured->take(1) as $property)
                <div class="col-md-6 col-lg-4">
                    <div class="card">
                        <img src="{{$property->primary_image_url}}" class="card-img-top" alt="{{$property->title}}">
                        <div class="card-body">
                            <h5 class="card-title text-teal">{{$property->title}}</h5>
                            <p class="card-text small text-muted">Properties | {{$property->number_of_bedrooms}} Beds | {{$property->number_of_bathrooms}} Baths</p>
                            <p class="card-text">{{ $property->address ?? $property?->location?->title ?? '' }}</p>
                            <a href="{{ route('properties.show', $property) }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Property</a>
                        </div>
                    </div>
                </div>
                @endforeach

                @foreach($autosFeatured->take(1) as $auto)
                <div class="col-md-6 col-lg-4">
                    <div class="card">
                        <img src="{{$auto->primary_image_url}}" class="card-img-top" alt="{{$auto->title}}">
                        <div class="card-body">
                            <h5 class="card-title text-darkblue">{{$auto->title}}</h5>
                            <p class="card-text small text-muted">Autos | {{$auto->year}} Model | {{$auto->mileage}}</p>
                            <p class="card-text">{{ $auto->address ?? $auto?->location?->title ?? '' }}</p>
                            <a href="{{ route('autos.show', $auto) }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Auto</a>
                        </div>
                    </div>
                </div>
                @endforeach

                @foreach($jobsFeatured->take(1) as $job)
                <div class="col-md-6 col-lg-4">
                    <div class="card">
                        <img src="{{$job->primary_image_url}}" class="card-img-top" alt="{{$job->title}}">
                        <div class="card-body">
                            <h5 class="card-title text-purple">{{$job->title}}</h5>
                            <p class="card-text small text-muted">Jobs | {{ $job->category?->title }} | {{ $job->type?->title }}</p>
                            <p class="card-text">{{ $job->user->company ?? $job->user->name }} — Posted: {{ $job->created_at->diffForHumans() }}</p>
                            <a href="{{ route('autos.show', $auto) }}" class="btn btn-sm btn-outline-secondary rounded-pill">Apply Now</a>
                        </div>
                    </div>
                </div>
                @endforeach
                
            </div>
        </section>

        <hr/>

        <section class="container my-5">
            <h2 class="mb-4 text-center">{{ page_content('home.categories.heading', 'Explore by Category') }}</h2>
            <div class="row g-4">
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-properties">
                        <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae" alt="Properties">
                        <div class="content">
                            <h3>Properties</h3>
                            <p>Find your dream home or investment opportunity.</p>
                            <a href="#" class="btn">View Listings</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-events">
                        <img src="https://images.unsplash.com/photo-1515169067865-5387ec356754" alt="Events">
                        <div class="content">
                            <h3>Events</h3>
                            <p>Discover exciting happenings near you.</p>
                            <a href="#" class="btn">Browse Events</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-autos">
                        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70" alt="Autos">
                        <div class="content">
                            <h3>Autos</h3>
                            <p>New and used vehicles for every need.</p>
                            <a href="#" class="btn">Find Your Ride</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-services">
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216" alt="Services">
                        <div class="content">
                            <h3>Services</h3>
                            <p>Connect with local professionals and businesses.</p>
                            <a href="#" class="btn">Explore Services</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-jobs">
                        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="Jobs">
                        <div class="content">
                            <h3>Jobs</h3>
                            <p>Your next career opportunity awaits.</p>
                            <a href="#" class="btn">View Jobs</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-4">
                    <div class="category-spotlight-card categoryX-classifieds">
                        <img src="https://images.unsplash.com/photo-1581091870622-7e0cdfbb6799" alt="Classifieds">
                        <div class="content">
                            <h3>Classifieds</h3>
                            <p>Buy, sell, and trade locally.</p>
                            <a href="#" class="btn">Browse Ads</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <hr>
        
        <section class="container my-5 py-5 text-center bg-white rounded-3 shadow-sm stats-section">
            <h2 class="mb-5">{{ page_content('home.achievements.heading', 'MegaHub By The Numbers') }}</h2>
            <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
                    <i class="bi bi-house-fill stats-icon text-teal"></i>
                    <h3 class="fw-bold">{{ page_content('home.achievements.value1', '100,000+') }}</h3>
                    <p class="text-muted">{{ page_content('home.achievements.text1', 'Properties Listed') }}</p>
                </div>
                <div class="col-md-4 mb-4 mb-md-0">
                    <i class="bi bi-calendar-event-fill stats-icon text-orange"></i>
                    <h3 class="fw-bold">{{ page_content('home.achievements.value2', '50,000+') }}</h3>
                    <p class="text-muted">{{ page_content('home.achievements.text2', 'Active Events') }}</p>
                </div>
                <div class="col-md-4">
                    <i class="bi bi-briefcase-fill stats-icon text-purple"></i>
                    <h3 class="fw-bold">{{ page_content('home.achievements.value3', '10,000+') }}</h3>
                    <p class="text-muted">{{ page_content('home.achievements.text3', 'Job Openings') }}</p>
                </div>
            </div>
        </section>

        <hr>


        <section class="container my-5 py-4">
            <h2 class="mb-5 text-center">{{ page_content('home.process.heading', 'How It Works') }}</h2>
            <div class="row text-center">
                <div class="col-md-4">
                    <div class="how-it-works-icon"><i class="bi bi-search"></i></div>
                    <h4 class="mb-3">{{ page_content('home.process.title1', '1. Search & Discover') }}</h4>
                    <p class="text-muted">{{ page_content('home.process.paragraph1', 'Easily find what you\'re looking for across 6 mega categories.') }}</p>
                </div>
                <div class="col-md-4">
                    <div class="how-it-works-icon"><i class="bi bi-chat-dots"></i></div>
                    <h4 class="mb-3">{{ page_content('home.process.title2', '2. Connect Directly') }}</h4>
                    <p class="text-muted">{{ page_content('home.process.paragraph2', 'Use secure messaging to communicate with providers or sellers.') }}</p>
                </div>
                <div class="col-md-4">
                    <div class="how-it-works-icon"><i class="bi bi-check-circle"></i></div>
                    <h4 class="mb-3">{{ page_content('home.process.title3', '3. Complete Your Goal') }}</h4>
                    <p class="text-muted">{{ page_content('home.process.paragraph3', 'Successfully buy, sell, hire, or attend the event you need.') }}</p>
                </div>
            </div>
        </section>

        <hr>


        <section class="container my-5 py-5">
            <h2 class="mb-5 text-center fw-bold display-6 text-dark">{{ page_content('home.testimonials.heading', 'What Our Users Say') }}</h2>
            
            <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                </div>

                <div class="carousel-inner py-5">

                    <!-- Testimonial 1 -->
                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="testimonial-card text-center p-5 rounded-4 position-relative">

                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80" class="testimonial-img rounded-circle mt-3 mb-4" alt="Jane Doe">
                            <p class="lead text-muted mb-4 position-relative z-1">
                                “This platform changed how I find everything! From my new car to finding a reliable plumber, it's my first stop.”
                            </p>
                            <h5 class="fw-bold text-primary mb-0">Jane Doe</h5>
                            <small class="text-secondary">Property Owner</small>
                            </div>
                        </div>
                        </div>
                    </div>

                    <!-- Testimonial 2 -->
                    <div class="carousel-item">
                        <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="testimonial-card text-center p-5 rounded-4 position-relative">

                            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" class="testimonial-img rounded-circle mt-3 mb-4" alt="David Chen">
                            <p class="lead text-muted mb-4 position-relative z-1">
                                “Hiring talent here is seamless. We filled three critical roles in under a month through the Jobs board.”
                            </p>
                            <h5 class="fw-bold text-primary mb-0">David Chen</h5>
                            <small class="text-secondary">Hiring Manager</small>
                            </div>
                        </div>
                        </div>
                    </div>

                </div>




                <!-- Controls -->
                <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
            </div>
            </section>


        <hr class="d-none">
        
        <section class="container cta-banner text-center my-5">
            <div class="container">
                <h2 class="display-5 fw-bold mb-4">{{ page_content('home.cta.heading', 'Join the MegaHub Today!') }}</h2>
                <p class="lead mb-5">{{ page_content('home.cta.paragraph', 'List your service, find a home, or post an ad—all for free.') }}</p>
                <a href="#" class="btn btn-light btn-lg">{{ page_content('home.cta.button', 'Start Your Journey Now') }}</a>
            </div>
        </section>

    </main>

    
    <footer class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                    <a href="#" class="footer-logo text-decoration-none mb-3 d-block">{{ page_content('global.footer.brand', 'MegaHub') }}</a>
                    <p class="small">{{ page_content('global.footer.paragraph', 'The unified platform for finding everything you need, everywhere.') }}</p>
                </div>
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h5 class="mb-3 text-white">About</h5>
                    <ul class="list-unstyled">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Our Blog</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h5 class="mb-3 text-white">Resources</h5>
                    <ul class="list-unstyled">
                        <li><a href="#">How It Works</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">List an Item</a></li>
                        <li><a href="#">Affiliates</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h5 class="mb-3 text-white">Legal</h5>
                    <ul class="list-unstyled">
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Trust & Safety</a></li>
                    </ul>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h5 class="mb-3 text-white">Stay Updated</h5>
                    <form class="d-flex">
                        <input class="form-control me-2 rounded-pill" type="email" placeholder="Your email" aria-label="Email">
                        <button class="btn btn-primary rounded-pill" type="submit"><i class="bi bi-send-fill"></i></button>
                    </form>
                    <div class="mt-3">
                        <a href="#" class="text-decoration-none me-3"><i class="bi bi-facebook fs-5"></i></a>
                        <a href="#" class="text-decoration-none me-3"><i class="bi bi-twitter fs-5"></i></a>
                        <a href="#" class="text-decoration-none me-3"><i class="bi bi-instagram fs-5"></i></a>
                    </div>
                </div>
            </div>
            <hr class="my-4 border-light opacity-25">
            <div class="text-center small">
                {!! page_content('global.footer.copyright', '&copy; 2025 MegaHub. All rights reserved.') !!}
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>