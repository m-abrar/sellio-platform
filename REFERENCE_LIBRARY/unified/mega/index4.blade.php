{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}
@extends('frontend.layouts.app')

@push('styles')
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
        background-color: #f0f2f5;
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

    /* HERO */
    .hero-banner {
        background-color: #fff;
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        margin-top: 30px;
    }
    .hero-title { font-size: 2.5rem; color: #1f2937; margin-bottom: 20px; }
    .search-bar {
        background-color: #fff;
        border-radius: 10px;
        padding: 10px;
        border: 1px solid #dee2e6;
        box-shadow: none;
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
        height: 150px;
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
    #properties-tab.active { background-color: var(--color-properties) !important; border-color: var(--color-properties); }
    #events-tab.active { background-color: var(--color-events) !important; border-color: var(--color-events); }
    #autos-tab.active { background-color: var(--color-autos) !important; border-color: var(--color-autos); }
    #services-tab.active { background-color: var(--color-services) !important; border-color: var(--color-services); }
    #jobs-tab.active { background-color: var(--color-jobs) !important; border-color: var(--color-jobs); }
    #classifieds-tab.active { background-color: var(--color-classifieds) !important; border-color: var(--color-classifieds); }

    /* CATEGORY SPOTLIGHTS */
    .category-spotlight-card {
        border-radius: 15px;
        overflow: hidden;
        position: relative;
        height: 220px;
        display: flex;
        align-items: flex-end;
        padding: 20px;
        color: #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .category-spotlight-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
        z-index: 0;
    }
    .category-spotlight-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; transition: transform .3s; }
    .category-spotlight-card:hover img { transform: scale(1.05); }
    .category-spotlight-card .content { position: relative; z-index: 2; }
    .category-spotlight-card h3 { font-size: 1.5rem; margin-bottom: 5px; }
    .category-spotlight-card p { font-size: 0.9rem; }
    .category-spotlight-card .btn {
        background-color: var(--bs-primary);
        border-color: var(--bs-primary);
        transition: background-color 0.3s ease;
        border-radius: 50px;
        padding: 8px 20px;
    }

    /* STATISTICS */
    .stats-icon { font-size: 3.5em; margin-bottom: 10px; }
    .stats-section .fw-bold { font-size: 2rem; }

    /* HOW IT WORKS & TESTIMONIALS */
    .how-it-works-icon {
        font-size: 3em;
        color: var(--bs-primary);
        background-color: #e3f2fd;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        margin: 0 auto 15px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .testimonial-card { padding: 30px; border-radius: 10px; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align:center; }
    .testimonial-img { border: 4px solid var(--bs-primary); border-radius: 50%; width: 88px; height: 88px; object-fit: cover; margin-bottom:15px; }

    /* CTA */
    .cta-banner {
        background-color: var(--bs-primary);
        border-radius: 15px;
        padding: 80px 0;
        box-shadow: 0 10px 30px rgba(13,110,253,0.12);
        color: #fff;
        text-align: center;
    }

    /* FOOTER */
    footer { background-color: #212529; color: #adb5bd; }
    .footer-logo { color: #fff; font-weight:700; font-size:1.25rem; display:block; }
    footer a { color: #adb5bd; text-decoration: none; }
    footer a:hover { color: #fff; text-decoration: none; }
    @media (max-width: 768px) {
        .hero-collage { display: none; }
    }
</style>
@endpush

@section('content')

{{-- ================= NAVBAR ================= --}}
<nav class="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
    <div class="container">
        <a class="navbar-brand text-primary" href="{{ route('#') }}">MegaHub</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav category-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Properties</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Events</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Autos</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Services</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Jobs</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Classifieds</a></li>
            </ul>
            <a class="btn btn-outline-primary rounded-pill px-4 d-none d-lg-inline-flex" href="{{ route('#') }}"><i class="bi bi-person-circle me-1"></i> Sign In</a>
        </div>
    </div>
</nav>

<main>

    {{-- ================= HERO / SEARCH ================= --}}
    <section class="container hero-banner text-center">
        <h1 class="hero-title fw-bold">Search and Discover Anything</h1>
        <p class="lead mb-4 text-secondary">Find properties, events, vehicles, services, jobs, and classifieds quickly.</p>

        <div class="row justify-content-center">
            <div class="col-lg-10">
                <form class="d-flex search-bar" role="search">
                    <i class="bi bi-search text-muted fs-4 align-self-center mx-2"></i>
                    <input class="form-control me-2" type="search" placeholder="Search for properties, services, or events..." aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-arrow-right"></i></button>
                </form>
            </div>
        </div>

        <div class="hero-collage d-none d-lg-grid mt-4">
            {{-- replaced original images with Picsum seeds --}}
            <img src="https://picsum.photos/seed/collage1/400/250" alt="Property Collage">
            <img src="https://picsum.photos/seed/collage2/400/250" alt="Event Collage">
            <img src="https://picsum.photos/seed/collage3/400/250" alt="Auto Collage">
            <img src="https://picsum.photos/seed/collage4/400/250" alt="Service Collage">
        </div>
    </section>

    <hr class="d-none">

    {{-- ================= TRENDING LISTINGS (tabs) ================= --}}
    <section class="container my-5 py-4">
        <h2 class="mb-5 text-center">Trending Listings</h2>

        <ul class="nav nav-pills justify-content-center mb-5 category-tab" id="trendingTabs" role="tablist">
            <li class="nav-item" role="presentation"><button class="nav-link active" id="properties-tab" data-bs-toggle="tab" data-bs-target="#trendingProperties" type="button" role="tab" aria-controls="trendingProperties" aria-selected="true">Properties</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link" id="events-tab" data-bs-toggle="tab" data-bs-target="#trendingEvents" type="button" role="tab" aria-controls="trendingEvents" aria-selected="false">Events</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link" id="autos-tab" data-bs-toggle="tab" data-bs-target="#trendingAutos" type="button" role="tab" aria-controls="trendingAutos" aria-selected="false">Autos</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link" id="services-tab" data-bs-toggle="tab" data-bs-target="#trendingServices" type="button" role="tab" aria-controls="trendingServices" aria-selected="false">Services</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link" id="jobs-tab" data-bs-toggle="tab" data-bs-target="#trendingJobs" type="button" role="tab" aria-controls="trendingJobs" aria-selected="false">Jobs</button></li>
            <li class="nav-item" role="presentation"><button class="nav-link" id="classifieds-tab" data-bs-toggle="tab" data-bs-target="#trendingClassifieds" type="button" role="tab" aria-controls="trendingClassifieds" aria-selected="false">Classifieds</button></li>
        </ul>

        <div class="tab-content" id="trendingTabsContent">
            {{-- PROPERTIES --}}
            @php
                $properties = [
                    ['title'=>'Modern Loft','location'=>'New York, NY','price'=>'$1.2M','seed'=>'properties1'],
                    ['title'=>'Luxury Villa','location'=>'Miami, FL','price'=>'$2.5M','seed'=>'properties2'],
                    ['title'=>'Cozy Apartment','location'=>'Boston, MA','price'=>'$500K','seed'=>'properties3'],
                    ['title'=>'Suburban House','location'=>'Austin, TX','price'=>'$750K','seed'=>'properties4'],
                ];
            @endphp
            <div class="tab-pane fade show active" id="trendingProperties" role="tabpanel" aria-labelledby="properties-tab">
                <div class="row g-4">
                    @foreach($properties as $p)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $p['seed'] }}/600/400" class="card-img-top" alt="{{ $p['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $p['title'] }}</h5>
                                <p class="card-text text-muted">{{ $p['location'] }} | <strong class="text-teal">{{ $p['price'] }}</strong></p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Details</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- EVENTS --}}
            @php
                $events = [
                    ['title'=>'Summer Music Fest','date'=>'July 20, 2024','venue'=>'Central Park','price'=>'$75','seed'=>'events1'],
                    ['title'=>'Modern Art Expo','date'=>'August 15, 2024','venue'=>'City Gallery','price'=>'$0 (Free)','seed'=>'events2'],
                    ['title'=>'International Food Fair','date'=>'Sept 7, 2024','venue'=>'Convention Center','price'=>'$25','seed'=>'events3'],
                    ['title'=>'Future Tech Summit','date'=>'Oct 12, 2024','venue'=>'Virtual & On-site','price'=>'Varies','seed'=>'events4'],
                ];
            @endphp
            <div class="tab-pane fade" id="trendingEvents" role="tabpanel" aria-labelledby="events-tab">
                <div class="row g-4">
                    @foreach($events as $e)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $e['seed'] }}/600/400" class="card-img-top" alt="{{ $e['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $e['title'] }}</h5>
                                <p class="card-text text-muted"><strong class="text-orange">{{ $e['date'] }}</strong> | {{ $e['venue'] }}</p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">@if(stripos($e['price'],'free')!==false) Free @else {{ $e['price'] }} @endif</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- AUTOS --}}
            @php
                $autos = [
                    ['title'=>'Luxury Sports Car','info'=>'2023 Model','price'=>'$150,000','seed'=>'autos1'],
                    ['title'=>'Eco-Friendly EV','info'=>'2024 Model','price'=>'$65,000','seed'=>'autos2'],
                    ['title'=>'Spacious Family SUV','info'=>'2022 Model','price'=>'$40,000','seed'=>'autos3'],
                    ['title'=>'Efficient Compact Car','info'=>'2021 Model','price'=>'$22,000','seed'=>'autos4'],
                ];
            @endphp
            <div class="tab-pane fade" id="trendingAutos" role="tabpanel" aria-labelledby="autos-tab">
                <div class="row g-4">
                    @foreach($autos as $a)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $a['seed'] }}/600/400" class="card-img-top" alt="{{ $a['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $a['title'] }}</h5>
                                <p class="card-text text-muted">{{ $a['info'] }} | <strong class="text-darkblue">{{ $a['price'] }}</strong></p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">See Listing</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- SERVICES --}}
            @php
                $services = [
                    ['title'=>'Expert Plumbing','detail'=>'24/7 Emergency | Licensed Pros','seed'=>'services1','cta'=>'Book Now'],
                    ['title'=>'Creative Graphic Design','detail'=>'Logos, Web | Portfolio','seed'=>'services2','cta'=>'View Work'],
                    ['title'=>'Professional Cleaning','detail'=>'Homes & Offices | Free Quote','seed'=>'services3','cta'=>'Get Quote'],
                    ['title'=>'Personal Fitness Coaching','detail'=>'Tailored Plans | Online & In-person','seed'=>'services4','cta'=>'Contact Coach'],
                ];
            @endphp
            <div class="tab-pane fade" id="trendingServices" role="tabpanel" aria-labelledby="services-tab">
                <div class="row g-4">
                    @foreach($services as $s)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $s['seed'] }}/600/400" class="card-img-top" alt="{{ $s['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $s['title'] }}</h5>
                                <p class="card-text text-muted">{{ $s['detail'] }}</p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">{{ $s['cta'] }}</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- JOBS --}}
            @php
                $jobs = [
                    ['title'=>'Senior Software Engineer','company'=>'Tech Innovators','type'=>'Full-time','seed'=>'jobs1'],
                    ['title'=>'Digital Marketing Manager','company'=>'Creative Solutions','type'=>'Remote','seed'=>'jobs2'],
                    ['title'=>'Lead Data Scientist','company'=>'Analytics Co.','type'=>'On-site','seed'=>'jobs3'],
                    ['title'=>'Human Resources Specialist','company'=>'Global Corp.','type'=>'Hybrid','seed'=>'jobs4'],
                ];
            @endphp
            <div class="tab-pane fade" id="trendingJobs" role="tabpanel" aria-labelledby="jobs-tab">
                <div class="row g-4">
                    @foreach($jobs as $j)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $j['seed'] }}/600/400" class="card-img-top" alt="{{ $j['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $j['title'] }}</h5>
                                <p class="card-text text-muted">{{ $j['company'] }} | <strong class="text-purple">{{ $j['type'] }}</strong></p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">Apply Now</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- CLASSIFIEDS --}}
            @php
                $classifieds = [
                    ['title'=>'Vintage Bicycle for Sale','detail'=>'Good condition','price'=>'$250','seed'=>'class1'],
                    ['title'=>'Antique Wooden Cabinet','detail'=>'Hand-carved','price'=>'Best Offer','seed'=>'class2'],
                    ['title'=>'Gaming Console (Used)','detail'=>'Excellent condition','price'=>'$300','seed'=>'class3'],
                    ['title'=>'Rare Book Collection','detail'=>'First Editions','price'=>'Inquire','seed'=>'class4'],
                ];
            @endphp
            <div class="tab-pane fade" id="trendingClassifieds" role="tabpanel" aria-labelledby="classifieds-tab">
                <div class="row g-4">
                    @foreach($classifieds as $c)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100">
                            <img src="https://picsum.photos/seed/{{ $c['seed'] }}/600/400" class="card-img-top" alt="{{ $c['title'] }}">
                            <div class="card-body">
                                <h5 class="card-title">{{ $c['title'] }}</h5>
                                <p class="card-text text-muted">{{ $c['detail'] }} | <strong class="text-red">{{ $c['price'] }}</strong></p>
                                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">View Ad</a>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

        </div>
    </section>

    <hr>

    {{-- ================= FEATURED LISTINGS ================= --}}
    <section class="container my-5 py-4">
        <h2 class="mb-5 text-center">Featured Listings</h2>
        @php
            $featured = [
                ['title'=>'Downtown Condo','category'=>'Properties','meta'=>'3 Beds | 2 Baths','seed'=>'feat1','label_class'=>'text-teal','description'=>'Modern condo with great views and amenities.','$btn'=>'View Property'],
                ['title'=>'Jazz Night Live!','category'=>'Events','meta'=>'Sep 15, 2024','seed'=>'feat2','label_class'=>'text-warning','description'=>'An evening of smooth jazz at the Grand Hall.','$btn'=>'Get Tickets'],
                ['title'=>'Pre-owned Sedan','category'=>'Autos','meta'=>'2019 Model | 40k Miles','seed'=>'feat3','label_class'=>'text-darkblue','description'=>'Reliable, fuel-efficient sedan, fully serviced.','$btn'=>'View Auto'],
            ];
        @endphp
        <div class="row g-4 justify-content-center">
            @foreach($featured as $f)
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <img src="https://picsum.photos/seed/{{ $f['seed'] }}/800/500" class="card-img-top" alt="{{ $f['title'] }}">
                    <div class="card-body">
                        <h5 class="card-title {{ $f['label_class'] ?? '' }}">{{ $f['title'] }}</h5>
                        <p class="card-text small text-muted">{{ $f['category'] }} | {{ $f['meta'] }}</p>
                        <p class="card-text">{{ $f['description'] }}</p>
                        <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary rounded-pill">@if(!empty($f['$btn'])){{ $f['$btn'] }}@else Learn More @endif</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    <hr>

    {{-- ================= STATS ================= --}}
    <section class="container my-5 py-5 text-center bg-white rounded-3 shadow-sm stats-section">
        <h2 class="mb-5">MegaHub By The Numbers</h2>
        <div class="row">
            <div class="col-md-4 mb-4 mb-md-0">
                <i class="bi bi-house-fill stats-icon text-teal"></i>
                <h3 class="fw-bold">100,000+</h3>
                <p class="text-muted">Properties Listed</p>
            </div>
            <div class="col-md-4 mb-4 mb-md-0">
                <i class="bi bi-calendar-event-fill stats-icon text-orange"></i>
                <h3 class="fw-bold">50,000+</h3>
                <p class="text-muted">Active Events</p>
            </div>
            <div class="col-md-4">
                <i class="bi bi-briefcase-fill stats-icon text-purple"></i>
                <h3 class="fw-bold">10,000+</h3>
                <p class="text-muted">Job Openings</p>
            </div>
        </div>
    </section>

    <hr>

    {{-- ================= CATEGORY SPOTLIGHTS ================= --}}
    <section class="container my-5 py-4">
        <h2 class="mb-5 text-center">Category Spotlights</h2>
        @php
            $spotlights = [
                ['title'=>'Properties','desc'=>'Find your dream home or investment opportunity.','seed'=>'spot1','btn'=>'View Listings'],
                ['title'=>'Autos','desc'=>'New and used vehicles for every need.','seed'=>'spot2','btn'=>'Find Your Ride'],
                ['title'=>'Events','desc'=>'Discover exciting happenings near you.','seed'=>'spot3','btn'=>'Browse Events'],
                ['title'=>'Services','desc'=>'Connect with local professionals and businesses.','seed'=>'spot4','btn'=>'Explore Services'],
                ['title'=>'Jobs','desc'=>'Your next career opportunity awaits.','seed'=>'spot5','btn'=>'View Jobs'],
                ['title'=>'Classifieds','desc'=>'Buy, sell, and trade locally.','seed'=>'spot6','btn'=>'Browse Ads'],
            ];
        @endphp
        <div class="row g-4">
            @foreach($spotlights as $s)
            <div class="col-md-6 col-lg-4">
                <div class="category-spotlight-card">
                    <img src="https://picsum.photos/seed/{{ $s['seed'] }}/1200/800" alt="{{ $s['title'] }}">
                    <div class="content">
                        <h3>{{ $s['title'] }}</h3>
                        <p>{{ $s['desc'] }}</p>
                        <a href="{{ route('#') }}" class="btn btn-sm">{{ $s['btn'] }}</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <div class="text-center mt-5">
            <a href="{{ route('#') }}" class="btn btn-outline-secondary rounded-pill px-5 py-2">View All Categories</a>
        </div>
    </section>

    <hr>

    {{-- ================= HOW IT WORKS ================= --}}
    <section class="container my-5 py-4">
        <h2 class="mb-5 text-center">How It Works</h2>
        @php
            $steps = [
                ['icon'=>'bi-search','title'=>'1. Search & Discover','desc'=>"Easily find what you're looking for across 6 mega categories."],
                ['icon'=>'bi-chat-dots','title'=>'2. Connect Directly','desc'=>'Use secure messaging to communicate with providers or sellers.'],
                ['icon'=>'bi-check-circle','title'=>'3. Complete Your Goal','desc'=>"Successfully buy, sell, hire, or attend the event you need."],
            ];
        @endphp
        <div class="row text-center">
            @foreach($steps as $s)
            <div class="col-md-4">
                <div class="how-it-works-icon"><i class="{{ $s['icon'] }}"></i></div>
                <h4 class="mb-3">{{ $s['title'] }}</h4>
                <p class="text-muted">{{ $s['desc'] }}</p>
            </div>
            @endforeach
        </div>
    </section>

    <hr>

    {{-- ================= TESTIMONIALS ================= --}}
    <section class="container my-5 py-4">
        <h2 class="mb-5 text-center">What Our Users Say</h2>
        @php
            $testimonials = [
                ['img'=>'testimonial1','text'=>'This platform changed how I find everything! From my new car to finding a reliable plumber, it\'s my first stop.','name'=>'Jane Doe, Property Owner'],
                ['img'=>'testimonial2','text'=>'Hiring talent here is seamless. We filled three critical roles in under a month through the Jobs board.','name'=>'David Chen, Hiring Manager'],
                ['img'=>'testimonial3','text'=>'I sold my car within a week using the classifieds. Simple to post, great reach!','name'=>'John Smith, Seller'],
            ];
        @endphp

        <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                @foreach($testimonials as $i => $t)
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="{{ $i }}" class="{{ $i==0 ? 'active':'' }}" aria-current="{{ $i==0 ? 'true':'' }}" aria-label="Slide {{ $i+1 }}"></button>
                @endforeach
            </div>
            <div class="carousel-inner py-5">
                @foreach($testimonials as $i => $t)
                <div class="carousel-item {{ $i==0 ? 'active':'' }}">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <div class="testimonial-card">
                                <img src="https://picsum.photos/seed/{{ $t['img'] }}/120/120" class="testimonial-img" alt="{{ $t['name'] }}">
                                <p class="lead">"{{ $t['text'] }}"</p>
                                <h5 class="fw-bold text-primary">- {{ $t['name'] }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>

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

    {{-- ================= CTA BANNER ================= --}}
    <section class="cta-banner text-center my-5">
        <div class="container">
            <h2 class="display-5 fw-bold mb-4">Join the MegaHub Today!</h2>
            <p class="lead mb-5">List your service, find a home, or post an ad—all for free.</p>
            <a href="{{ route('#') }}" class="btn btn-lg btn-light text-primary">Start Your Journey Now</a>
        </div>
    </section>

</main>

{{-- ================= FOOTER (complete preserved links & structure) ================= --}}
<footer class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                <a href="{{ route('#') }}" class="footer-logo text-decoration-none mb-3 d-block">MegaHub</a>
                <p class="small">The unified platform for finding everything you need, everywhere.</p>
            </div>

            <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                <h5 class="mb-3 text-white">About</h5>
                <ul class="list-unstyled">
                    <li><a href="{{ route('#') }}">About Us</a></li>
                    <li><a href="{{ route('#') }}">Careers</a></li>
                    <li><a href="{{ route('#') }}">Our Blog</a></li>
                    <li><a href="{{ route('#') }}">Contact</a></li>
                </ul>
            </div>

            <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                <h5 class="mb-3 text-white">Resources</h5>
                <ul class="list-unstyled">
                    <li><a href="{{ route('#') }}">How It Works</a></li>
                    <li><a href="{{ route('#') }}">Help Center</a></li>
                    <li><a href="{{ route('#') }}">List an Item</a></li>
                    <li><a href="{{ route('#') }}">Affiliates</a></li>
                </ul>
            </div>

            <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                <h5 class="mb-3 text-white">Legal</h5>
                <ul class="list-unstyled">
                    <li><a href="{{ route('#') }}">Privacy Policy</a></li>
                    <li><a href="{{ route('#') }}">Terms of Use</a></li>
                    <li><a href="{{ route('#') }}">Trust & Safety</a></li>
                </ul>
            </div>

            <div class="col-lg-3 col-md-6">
                <h5 class="mb-3 text-white">Stay Updated</h5>
                <form class="d-flex mb-3" role="search">
                    <input class="form-control me-2 rounded-pill" type="email" placeholder="Your email" aria-label="Email">
                    <button class="btn btn-primary rounded-pill" type="submit"><i class="bi bi-send-fill"></i></button>
                </form>
                <div class="mt-3">
                    <a href="{{ route('#') }}" class="text-decoration-none me-3"><i class="bi bi-facebook fs-5"></i></a>
                    <a href="{{ route('#') }}" class="text-decoration-none me-3"><i class="bi bi-twitter fs-5"></i></a>
                    <a href="{{ route('#') }}" class="text-decoration-none me-3"><i class="bi bi-instagram fs-5"></i></a>
                    <a href="{{ route('#') }}" class="text-decoration-none"><i class="bi bi-linkedin fs-5"></i></a>
                </div>
            </div>
        </div>

        <hr class="my-4 border-light opacity-25">

        <div class="text-center small">
            &copy; {{ date('Y') }} MegaHub. All rights reserved.
        </div>
    </div>
</footer>

@endsection
