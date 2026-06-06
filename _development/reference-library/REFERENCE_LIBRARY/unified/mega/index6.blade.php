{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}

{{ dd("NOOOOO!"); }}


@extends('frontend.layouts.app')
@section('title', 'Universal Mega')

@section('template')
<link rel="stylesheet" href="{{ asset('css/themes/unifieds/mega/style.css') }}">
@endsection

@push('styles')

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

@endpush


@section('header')

{{-- ================= NAVBAR (Sticky Search Bar Added) ================= --}}
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top py-3">
    <div class="container">
        <a class="navbar-brand fw-bold fs-3 text-dark" href="{{ route('#') }}">The <span class="text-hub-primary">Hub</span></a>
        
        {{-- Search bar moved to center of sticky nav --}}
        <form class="d-none d-lg-flex mx-auto" style="width: 50%;">
            <input class="form-control me-2" type="search" placeholder="Search across all 6 categories..." aria-label="Search">
            <button class="btn btn-hub-primary" type="submit"><i class="bi bi-search"></i></button>
        </form>

        <div class="d-flex align-items-center">
            <button class="btn btn-outline-secondary me-2 d-none d-md-inline-block" type="button">Post Ad</button>
            <i class="bi bi-person-circle fs-3 text-secondary"></i>
        </div>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
             <span class="navbar-toggler-icon"></span>
        </button>
    </div>
</nav>

@endsection

@section('content')


{{-- ================= HERO (Unified Search Focus) ================= --}}
<section class="hero">
    <div class="hero-overlay">
        <div>
            <h1 class="display-5 fw-extrabold mb-4">Find Your Next Big Opportunity, Instantly.</h1>
            <ul class="nav nav-pills justify-content-center mb-4" id="quickSearchTabs">
                {{-- Navigation uses category accents, but the active tab is the site's primary color --}}
                @foreach(['Properties','Events','Autos','Services','Jobs','Classifieds'] as $cat)
                    <li class="nav-item">
                        <a class="nav-link text-white fw-semibold {{ $loop->first ? 'active bg-hub-primary':'' }}" data-bs-toggle="tab" href="#search-{{ strtolower($cat) }}">{{ $cat }}</a>
                    </li>
                @endforeach
            </ul>
            <div class="tab-content mt-4">
                {{-- Properties Search Form (as example) --}}
                <div class="tab-pane fade show active" id="search-properties">
                    <form class="row g-3 justify-content-center">
                        <div class="col-md-3"><input type="text" class="form-control form-control-lg" placeholder="City, State, or Zip Code"></div>
                        <div class="col-md-3"><select class="form-select form-select-lg"><option>Buy or Rent?</option></select></div>
                        <div class="col-md-2"><input type="text" class="form-control form-control-lg" placeholder="Max Price"></div>
                        <div class="col-md-2"><button class="btn btn-lg w-100 accent-teal">Search</button></div>
                    </form>
                </div>
                {{-- Empty placeholders for other categories --}}
                <div class="tab-pane fade" id="search-events"><p class="text-white">Search Events...</p></div>
                <div class="tab-pane fade" id="search-autos"><p class="text-white">Search Autos...</p></div>
                <div class="tab-pane fade" id="search-services"><p class="text-white">Search Services...</p></div>
                <div class="tab-pane fade" id="search-jobs"><p class="text-white">Search Jobs...</p></div>
                <div class="tab-pane fade" id="search-classifieds"><p class="text-white">Search Classifieds...</p></div>
            </div>
        </div>
    </div>
</section>

<div class="container">

    {{-- ================= PROPERTIES (Featured Listing) ================= --}}
    <section id="properties">
        <div class="section-title">
            <span class="category-accent-bar accent-teal"></span>
            <span class="text-teal">PROPERTIES:</span> Featured Homes & Investments
        </div>
        <div class="row">
            {{-- Main Featured Card is now a prominent, horizontal card --}}
            <div class="col-12 mb-4">
                <div class="card card-hover shadow-sm p-3">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="https://picsum.photos/seed/property-feature/700/400" class="img-fluid rounded-start card-img-top" alt="Featured Property" style="height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h3 class="card-title fw-bold">Stunning Lakeside Retreat - Hot Deal!</h3>
                                <p class="card-text text-muted"><i class="bi bi-geo-alt-fill text-teal"></i> 123 Lakefront Drive, Sunnyvale, CA</p>
                                <p class="mb-2">
                                    <span class="badge rounded-pill bg-secondary me-2">4 Beds</span>
                                    <span class="badge rounded-pill bg-secondary me-2">3.5 Baths</span>
                                    <span class="badge rounded-pill bg-secondary">3,200 sqft</span>
                                </p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <h4 class="fw-bold text-teal">$1,250,000</h4>
                                    <a href="{{ route('#') }}" class="btn btn-lg accent-teal">View Full Listing</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    ---

    {{-- ================= EVENTS (Trending Items with Icons) ================= --}}
    <section id="events">
        <div class="section-title">
            <span class="category-accent-bar accent-orange"></span>
            <span class="text-orange">EVENTS:</span> Trending Local Happenings
        </div>
        <div class="row">
            @foreach(['Music Festival','Tech Conference','Art Exhibit','Farmers Market'] as $i => $event)
            <div class="col-md-3 mb-4">
                <div class="card card-hover h-100">
                    <img src="https://picsum.photos/seed/event-hf{{ $i }}/400/250" class="card-img-top" alt="{{ $event }}">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">{{ $event }}</h5>
                        <p class="card-text small text-muted mb-1"><i class="bi bi-calendar"></i> Oct 15-17</p>
                        <p class="card-text small text-muted"><i class="bi bi-geo-alt"></i> Downtown Convention Center</p>
                        <a href="{{ route('#') }}" class="btn btn-sm accent-orange w-100 mt-2">See Details</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    ---

    {{-- ================= AUTOS (Standard Card Grid) ================= --}}
    <section id="autos">
        <div class="section-title">
            <span class="category-accent-bar accent-darkblue"></span>
            <span class="text-darkblue">AUTOS:</span> New Arrivals & Used Deals
        </div>
        <div class="row">
            @foreach(['2024 Tesla Model 3','2023 BMW X5','2020 Audi A4'] as $i => $car)
            <div class="col-md-4 mb-4">
                <div class="card card-hover h-100">
                    <img src="https://picsum.photos/seed/auto-hf{{ $i }}/400/250" class="card-img-top" alt="{{ $car }}">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">{{ $car }}</h5>
                        <p class="card-text small text-muted mb-1">20,000 mi | Automatic | Gasoline</p>
                        <h6 class="fw-bold text-darkblue my-2">$39,990</h6>
                        <a href="{{ route('#') }}" class="btn accent-darkblue w-100">Contact Seller</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    ---

    {{-- ================= SERVICES (Icon & Block Style) ================= --}}
    <section id="services">
        <div class="section-title">
            <span class="category-accent-bar accent-green"></span>
            <span class="text-green">SERVICES:</span> Top-Rated Professionals Near You
        </div>
        <div class="row">
            @foreach(['Digital Marketing','Home Plumbing','Freelance Design','Professional Cleaning'] as $i => $service)
            <div class="col-md-3 mb-4">
                <div class="card card-hover h-100 text-center shadow-sm">
                    <div class="p-4"><i class="bi bi-gear fs-1 text-green"></i></div>
                    <div class="card-body pt-0">
                        <h6 class="fw-bold">{{ $service }}</h6>
                        <p class="small text-muted">A short description of expertise and rating.</p>
                        <span class="badge bg-success rounded-pill mb-2"><i class="bi bi-star-fill"></i> 4.9 Rating</span>
                        <a href="{{ route('#') }}" class="btn btn-sm accent-green w-100">View Profiles</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    ---

    {{-- ================= JOBS (Detailed List Block) ================= --}}
    <section id="jobs">
        <div class="section-title">
            <span class="category-accent-bar accent-purple"></span>
            <span class="text-purple">JOBS:</span> Latest Career Opportunities
        </div>
        <div class="row">
            @foreach(['Senior Frontend Developer','Lead UI/UX Designer','DevOps Engineer'] as $i => $job)
            <div class="col-md-4 mb-4">
                <div class="card card-hover shadow-sm p-3 h-100">
                    <div class="d-flex align-items-start mb-2">
                        <img src="https://picsum.photos/seed/company-hf{{ $i }}/40/40" class="me-3 rounded-circle" alt="Company Logo">
                        <div>
                             <h6 class="fw-bold text-purple mb-0">{{ $job }}</h6>
                             <small class="text-muted">TechCorp Inc. | Full-Time</small>
                        </div>
                    </div>
                    <p class="mb-1 small"><i class="bi bi-currency-dollar"></i> $120k - $140k/yr</p>
                    <p class="mb-3 small"><i class="bi bi-geo-alt"></i> Remote (US/CAN)</p>
                    <a href="{{ route('#') }}" class="btn btn-sm accent-purple">Apply Now</a>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    ---

    {{-- ================= CLASSIFIEDS (Price Tag Focus) ================= --}}
    <section id="classifieds">
        <div class="section-title">
            <span class="category-accent-bar accent-yellow"></span>
            <span class="text-yellow">CLASSIFIEDS:</span> Local Items for Sale
        </div>
        <div class="row">
            @foreach(['Vintage Mountain Bike','Dell XPS Laptop','Mid-Century Sofa','Canon DSLR Camera'] as $i => $item)
            <div class="col-md-3 mb-4">
                <div class="card card-hover h-100">
                    <div class="position-relative">
                        <img src="https://picsum.photos/seed/classified-hf{{ $i }}/400/250" class="card-img-top" alt="{{ $item }}">
                        {{-- Price made prominent and sticky --}}
                        <span class="badge rounded-pill accent-yellow position-absolute top-0 start-0 m-2 fs-6 p-2 text-dark fw-bold">$250</span>
                    </div>
                    <div class="card-body">
                        <h6 class="fw-semibold">{{ $item }}</h6>
                        <p class="small text-muted mb-1">Seller: Jane Doe | Listed 4 hours ago</p>
                        <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary w-100 mt-2">Message Seller</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

</div>



@endsection

@section('footer')

{{-- ================= FOOTER (Same structure, slightly improved style) ================= --}}
<footer class="footer bg-dark text-white mt-5">
  <div class="container py-5">
    <div class="row">
      <div class="col-md-3">
        <h5 class="fw-bold mb-3">The Hub</h5>
        <ul class="list-unstyled">
          <li><a href="{{ route('#') }}" class="text-white-50">About Us</a></li>
          <li><a href="{{ route('#') }}" class="text-white-50">Careers</a></li>
          <li><a href="{{ route('#') }}" class="text-white-50">Contact</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <h5 class="mb-3">Categories</h5>
        <ul class="list-unstyled">
          <li><a href="{{ route('#') }}" class="text-teal text-white-50">Properties</a></li>
          <li><a href="{{ route('#') }}" class="text-orange text-white-50">Events</a></li>
          <li><a href="{{ route('#') }}" class="text-darkblue text-white-50">Autos</a></li>
          <li><a href="{{ route('#') }}" class="text-green text-white-50">Services</a></li>
          <li><a href="{{ route('#') }}" class="text-purple text-white-50">Jobs</a></li>
          <li><a href="{{ route('#') }}" class="text-yellow text-white-50">Classifieds</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <h5 class="mb-3">Legal & Support</h5>
        <ul class="list-unstyled">
          <li><a href="{{ route('#') }}" class="text-white-50">Terms of Use</a></li>
          <li><a href="{{ route('#') }}" class="text-white-50">Privacy Policy</a></li>
          <li><a href="{{ route('#') }}" class="text-white-50">Help Center</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <h5 class="mb-3">Stay Connected</h5>
        <div class="fs-4 mb-3">
          <i class="bi bi-facebook me-3 text-white-50"></i>
          <i class="bi bi-twitter me-3 text-white-50"></i>
          <i class="bi bi-instagram text-white-50"></i>
        </div>
        <div class="mt-2">
          <input type="email" class="form-control" placeholder="Subscribe to newsletter">
        </div>
      </div>
    </div>
    <div class="text-center text-white-50 small mt-4 pt-3 border-top border-secondary">
        &copy; {{ date('Y') }} The Hub. All rights reserved.
    </div>
  </div>
</footer>


@endsection