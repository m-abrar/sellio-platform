{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}
@extends('frontend.layouts.app')

@section('title', config('site_name', 'Welcome'))

@section('template')
<link rel="stylesheet" href="{{ asset('css/themes/unifieds/mega/style.css') }}">
@endsection

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
<style>
    /* 1. DARK PALETTE & BRANDING */
    :root {
        --bs-font-sans-serif: 'Inter', sans-serif;
        --primary-hub: #a78bfa;
        /* Soft Lavender for main brand */
        --background-dark: #1f2937;
        /* Deep Charcoal */
        --card-dark: #374151;
        /* Slightly lighter gray for cards */
        --text-light: #f3f4f6;
        /* Off-white text */

        /* Vibrant Accent Palette (Optimized for Dark Background) */
        --accent-teal: #22d3ee;
        --accent-orange: #fb923c;
        --accent-darkblue: #3b82f6;
        --accent-green: #34d399;
        --accent-purple: #c084fc;
        --accent-yellow: #facc15;
    }
</style>
@endpush

@section('header')
<nav class="navbar navbar-expand-lg sticky-top py-3">
    <div class="container">
        <a class="navbar-brand fw-bolder fs-3" href="{{ route('#') }}">
            <span style="color: var(--primary-hub);">THE HUB.</span>
        </a>

        <div class="d-flex align-items-center ms-auto">
            <a href="{{ route('#') }}" class="btn btn-hub-primary me-3 d-none d-md-inline-block" type="button">
                <i class="bi bi-plus-circle me-1"></i> Post Listing
            </a>
            <i class="bi bi-person-circle fs-3" style="color: #6b7280;"></i>
        </div>
    </div>
</nav>

@endsection


@section('content')
@php $filters = ['Properties'=>'property','Events'=>'event','Autos'=>'auto','Services'=>'service','Jobs'=>'job','Classifieds'=>'classified']; @endphp

<section class="py-5">
    <div class="container">
        <div class="row g-4 justify-content-center">
            @foreach($filters as $label=>$cls)
            <div class="col-6 col-md-4 col-lg-2">
                <a href="{{ route('#') }}" class="text-decoration-none">
                    <div class="category-spotlight-card color-{{ $cls }}">
                        <i class="bi bi-{{ $cls=='property'?'house-door':($cls=='event'?'calendar-event':($cls=='auto'?'car-front':($cls=='service'?'gear':($cls=='job'?'briefcase':'shop')))) }}"></i>
                        <span>{{ $label }}</span>
                    </div>
                </a>
            </div>
            @endforeach
        </div>
    </div>
</section>










































<section class="hero">
    <div class="hero-overlay">
        <div class="text-center w-100">
            <h1 class="display-3 fw-black mb-1 text-shadow">The Consolidated Marketplace.</h1>
            <p class="lead fw-light text-white-50">Everything is connected. Find your next opportunity now.</p>
        </div>
    </div>
</section>
<div class="search-strip">
    <div class="container">
        <form class="row g-3 align-items-center">
            <div class="col-md-5">
                <input type="text" class="form-control form-control-lg" placeholder="Search across all listings: Property, Car, Job...">
            </div>
            <div class="col-md-3">
                <select class="form-select form-select-lg">
                    <option selected>Category Filter</option>
                    <option value="Properties">Properties</option>
                    <option value="Events">Events</option>
                    <option value="Autos">Autos</option>
                </select>
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control form-control-lg" placeholder="Location">
            </div>
            <div class="col-md-2">
                <button class="btn btn-lg w-100 btn-hub-primary">
                    <i class="bi bi-search me-1"></i> Search
                </button>
            </div>
        </form>
    </div>
</div>

<div class="container">

    {{-- ================= FEATURED / TRENDING (Grid Layout) ================= --}}
    <section id="featured-trending">
        <h2 class="section-title">Trending Now</h2>
        <span class="section-subtitle">The hottest listings and events this week, across all categories.</span>
        <div class="row">
            {{-- Example 1: High-Value Property --}}
            <div class="col-md-6 mb-4">
                <div class="card card-hover h-100">
                    <img src="https://picsum.photos/seed/prop-v4-1/700/400" class="card-img-top" alt="Trending Property">
                    <div class="card-body">
                        <span class="badge rounded-pill bg-teal mb-2">PROPERTIES</span>
                        <h4 class="card-title fw-bold text-light">Lakeside Estate with Private Dock</h4>
                        <p class="card-text small text-muted mb-2">5 Beds | Exclusive Listing</p>
                        <div class="listing-info">
                            <h5 class="fw-bold" style="color: var(--accent-teal);">$2.1 Million</h5>
                            <a href="{{ route('#') }}" class="btn btn-sm" style="background-color: var(--accent-teal); color: var(--background-dark);">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
            {{-- Example 2: Major Event --}}
            <div class="col-md-6 mb-4">
                <div class="card card-hover h-100">
                    <img src="https://picsum.photos/seed/event-v4-1/700/400" class="card-img-top" alt="Trending Event">
                    <div class="card-body">
                        <span class="badge rounded-pill" style="background-color: var(--accent-orange); color: var(--background-dark);">EVENTS</span>
                        <h4 class="card-title fw-bold text-light">The Global Tech Summit 2025</h4>
                        <p class="card-text small text-muted mb-2">October 25-27 | Limited Tickets</p>
                        <div class="listing-info">
                            <h5 class="fw-bold" style="color: var(--accent-orange);">Tickets from $499</h5>
                            <a href="{{ route('#') }}" class="btn btn-sm" style="background-color: var(--accent-orange); color: var(--background-dark);">Get Tickets</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    ---

    {{-- ================= PROPERTIES (Horizontal Slider/Carousel Concept) ================= --}}
    <section id="properties">
        <h2 class="section-title text-teal">Properties</h2>
        <span class="section-subtitle">Latest additions to homes, rentals, and commercial spaces.</span>

        <div class="horizontal-scroll-section">
            @foreach(['Modern Lakeside Villa','Urban Apartment','Cozy Suburban Home','Luxury Penthouse','Retail Space','Vacant Land'] as $i => $prop)
            <div class="card scroll-card card-hover h-100">
                <img src="https://picsum.photos/seed/prop-scroll-{{ $i }}/400/250" class="card-img-top" alt="{{ $prop }}">
                <div class="card-body">
                    <h6 class="card-title fw-bold text-light">{{ $prop }}</h6>
                    <p class="card-text small text-muted mb-2"><i class="bi bi-geo-alt me-1"></i> Location Info</p>
                    <div class="listing-info">
                        <span class="fw-bold fs-5" style="color: var(--accent-teal);">$XXX,XXX</span>
                        <a href="{{ route('#') }}" class="btn btn-sm accent-teal float-end">Details</a>
                    </div>
                </div>
            </div>
            @endforeach
            <div class="card scroll-card card-hover h-100 align-items-center justify-content-center text-center" style="border-style: dashed;">
                <h5 class="fw-bold text-light">Explore More Properties</h5>
                <a href="{{ route('#') }}" class="btn btn-hub-primary mt-2">View All <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>
    </section>

    ---

    {{-- ================= AUTOS (Another Slider Example) ================= --}}
    <section id="autos">
        <h2 class="section-title" style="color: var(--accent-darkblue);">Autos</h2>
        <span class="section-subtitle">New, used, classic cars, trucks, and motorbikes for sale.</span>

        <div class="horizontal-scroll-section">
            @foreach(['Tesla Model S','BMW X5','Audi A4 2023','Classic Porsche 911','Ford F-150','Electric Scooter'] as $i => $car)
            <div class="card scroll-card card-hover h-100">
                <img src="https://picsum.photos/seed/auto-scroll-{{ $i }}/400/250" class="card-img-top" alt="{{ $car }}">
                <div class="card-body">
                    <h6 class="card-title fw-bold text-light">{{ $car }}</h6>
                    <p class="card-text small text-muted mb-2">Mileage | Transmission</p>
                    <div class="listing-info">
                        <span class="fw-bold fs-5" style="color: var(--accent-darkblue);">$XX,XXX</span>
                        <a href="{{ route('#') }}" class="btn btn-sm" style="background-color: var(--accent-darkblue); color: var(--text-light);">View Car</a>
                    </div>
                </div>
            </div>
            @endforeach
            <div class="card scroll-card card-hover h-100 align-items-center justify-content-center text-center" style="border-style: dashed;">
                <h5 class="fw-bold text-light">Explore All Autos</h5>
                <a href="{{ route('#') }}" class="btn btn-hub-primary mt-2">View All <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>
    </section>

    {{-- ... (Sections for Events, Services, Jobs, Classifieds would follow the same horizontal scroll pattern) ... --}}

</div>

@endsection


@section('footer')
<footer class="footer mt-5 py-5" style="background-color: #111827; border-top: 1px solid #4b5563;">
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <h5 class="fw-bolder mb-3" style="color: var(--primary-hub);">THE HUB.</h5>
                <p class="small text-muted">A modern platform unifying local marketplaces.</p>
                <div class="fs-4">
                    <i class="bi bi-facebook me-3 text-muted"></i>
                    <i class="bi bi-twitter me-3 text-muted"></i>
                    <i class="bi bi-instagram text-muted"></i>
                </div>
            </div>
            <div class="col-md-8">
                <div class="row">
                    <div class="col-md-4">
                        <h6 class="mb-3" style="color: #d1d5db;">Market Segments</h6>
                        <ul class="list-unstyled small">
                            <li><a href="{{ route('#') }}" class="text-muted">Properties</a></li>
                            <li><a href="{{ route('#') }}" class="text-muted">Events</a></li>
                            <li><a href="{{ route('#') }}" class="text-muted">Autos</a></li>
                            <li><a href="{{ route('#') }}" class="text-muted">Services</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-3" style="color: #d1d5db;">About</h6>
                        <ul class="list-unstyled small">
                            <li><a href="{{ route('#') }}" class="text-muted">Company</a></li>
                            <li><a href="{{ route('#') }}" class="text-muted">Careers</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-3" style="color: #d1d5db;">Support</h6>
                        <ul class="list-unstyled small">
                            <li><a href="{{ route('#') }}" class="text-muted">Help Center</a></li>
                            <li><a href="{{ route('#') }}" class="text-muted">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center small mt-5 pt-4 text-muted" style="border-top: 1px solid #4b5563;">
            &copy; {{ date('Y') }} The Hub. All rights reserved.
        </div>
    </div>
</footer>
@endsection


@push('scripts')

@endpush