{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}
@extends('frontend.layouts.app')

@section('content')

{{-- ================= CUSTOM STYLES ================= --}}
@push('styles')
<style>
    :root {
        --primary-color: #0056b3;
        --secondary-color: #ff6f61;
        --bg-light: #f8f9fa;
        --text-dark: #212529;
        --text-muted: #6c757d;
        --card-radius: 0.75rem;
        --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.08);
        --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    body {
        font-family: "Roboto", sans-serif;
        color: var(--text-dark);
        background-color: var(--bg-light);
        line-height: 1.6;
    }
    h1,h2,h3,h4,h5 {
        font-weight: 700;
        color: var(--primary-color);
    }
    .navbar {
        box-shadow: var(--shadow-sm);
    }
    .navbar-brand {
        font-weight: 700;
        font-size: 1.5rem;
        color: var(--primary-color) !important;
    }
    .hero {
        background: url("https://picsum.photos/seed/hero/1920/600") no-repeat center center/cover;
        height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
        position: relative;
    }
    .hero::before {
        content:"";
        position:absolute;
        top:0;left:0;right:0;bottom:0;
        background:rgba(0,0,0,0.5);
    }
    .hero-content {
        position:relative;
        z-index:1;
        max-width:700px;
    }
    .btn-primary {
        background-color: var(--primary-color);
        border:none;
    }
    .btn-primary:hover {
        background-color: #003d80;
    }
    .btn-secondary {
        background-color: var(--secondary-color);
        border:none;
    }
    .btn-secondary:hover {
        background-color: #e85a50;
    }
    .card {
        border:none;
        border-radius: var(--card-radius);
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
    }
    .card:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-5px);
    }
    .card-img-top {
        height:200px;
        object-fit:cover;
        border-top-left-radius:var(--card-radius);
        border-top-right-radius:var(--card-radius);
    }
    .section-title {
        text-align:center;
        margin-bottom:2rem;
    }
    .badge-category {
        font-size:0.75rem;
        padding:0.35em 0.75em;
        border-radius:50px;
    }
    footer {
        background:var(--primary-color);
        color:white;
        padding:2rem 0;
    }
</style>
@endpush

{{-- ================= NAVBAR ================= --}}
<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
    <div class="container">
        <a class="navbar-brand" href="{{ route('#') }}">MegaMarket</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Trending</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Featured</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Categories</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Jobs</a></li>
                <li class="nav-item"><a class="nav-link" href="{{ route('#') }}">Classifieds</a></li>
            </ul>
            <a href="{{ route('#') }}" class="btn btn-primary btn-sm">Sign In</a>
        </div>
    </div>
</nav>

{{-- ================= HERO ================= --}}
<section class="hero">
    <div class="hero-content text-white">
        <h1 class="display-4 fw-bold">Welcome to MegaMarket</h1>
        <p class="lead mb-4">Your all-in-one marketplace for properties, jobs, services, events, classifieds and more.</p>
        <form class="d-flex justify-content-center">
            <input class="form-control w-50 me-2" type="search" placeholder="Search listings...">
            <button class="btn btn-secondary">Search</button>
        </form>
    </div>
</section>

<main class="container py-5">

    {{-- ================= TRENDING ================= --}}
    <section id="trending" class="mb-5">
        <h2 class="section-title">Trending Now</h2>
        @php
            $trending = [
                ['title'=>'Modern Apartment','category'=>'Property','price'=>'$1.2M','image'=>'https://picsum.photos/seed/trend1/600/400'],
                ['title'=>'Startup Conference','category'=>'Event','price'=>'$250','image'=>'https://picsum.photos/seed/trend2/600/400'],
                ['title'=>'Tesla Model Y','category'=>'Auto','price'=>'$48,000','image'=>'https://picsum.photos/seed/trend3/600/400'],
                ['title'=>'Yoga Retreat','category'=>'Service','price'=>'$99','image'=>'https://picsum.photos/seed/trend4/600/400'],
            ];
        @endphp
        <div class="row g-4">
            @foreach($trending as $item)
            <div class="col-md-6 col-lg-3">
                <div class="card h-100">
                    <img src="{{ $item['image'] }}" class="card-img-top" alt="{{ $item['title'] }}">
                    <div class="card-body">
                        <h5 class="card-title">{{ $item['title'] }}</h5>
                        <span class="badge bg-primary badge-category">{{ $item['category'] }}</span>
                        <p class="fw-bold mt-2">{{ $item['price'] }}</p>
                        <a href="{{ route('#') }}" class="btn btn-sm btn-outline-primary">View</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    {{-- ================= FEATURED ================= --}}
    <section id="featured" class="mb-5">
        <h2 class="section-title">Featured Listings</h2>
        @php
            $featured = [
                ['title'=>'Beachfront Villa','category'=>'Property','price'=>'$2.5M','image'=>'https://picsum.photos/seed/feat1/600/400'],
                ['title'=>'Luxury SUV','category'=>'Auto','price'=>'$80,000','image'=>'https://picsum.photos/seed/feat2/600/400'],
                ['title'=>'Corporate Jobs Fair','category'=>'Event','price'=>'Free Entry','image'=>'https://picsum.photos/seed/feat3/600/400'],
                ['title'=>'Personal Trainer','category'=>'Service','price'=>'$60/hr','image'=>'https://picsum.photos/seed/feat4/600/400'],
            ];
        @endphp
        <div class="row g-4">
            @foreach($featured as $item)
            <div class="col-md-6 col-lg-3">
                <div class="card h-100">
                    <img src="{{ $item['image'] }}" class="card-img-top" alt="{{ $item['title'] }}">
                    <div class="card-body">
                        <h5 class="card-title">{{ $item['title'] }}</h5>
                        <span class="badge bg-secondary badge-category">{{ $item['category'] }}</span>
                        <p class="fw-bold mt-2">{{ $item['price'] }}</p>
                        <a href="{{ route('#') }}" class="btn btn-sm btn-outline-secondary">Explore</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    {{-- ================= CATEGORY SPOTLIGHTS ================= --}}
    <section id="categories" class="mb-5">
        <h2 class="section-title">Category Spotlights</h2>
        @php
            $spotlights = [
                ['name'=>'Properties','desc'=>'Find your dream home, apartment, or land.','image'=>'https://picsum.photos/seed/cat1/800/400'],
                ['name'=>'Jobs','desc'=>'Browse career opportunities from top companies.','image'=>'https://picsum.photos/seed/cat2/800/400'],
                ['name'=>'Classifieds','desc'=>'Buy & sell everyday items locally.','image'=>'https://picsum.photos/seed/cat3/800/400'],
            ];
        @endphp
        <div class="row g-4">
            @foreach($spotlights as $cat)
            <div class="col-md-4">
                <div class="card h-100">
                    <img src="{{ $cat['image'] }}" class="card-img-top" alt="{{ $cat['name'] }}">
                    <div class="card-body text-center">
                        <h5 class="card-title">{{ $cat['name'] }}</h5>
                        <p class="card-text">{{ $cat['desc'] }}</p>
                        <a href="{{ route('#') }}" class="btn btn-primary btn-sm">Browse</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    </section>

    {{-- ================= CALL TO ACTION ================= --}}
    <section class="py-5 text-center bg-white shadow-sm rounded">
        <h2 class="fw-bold mb-3">Ready to List Your Item?</h2>
        <p class="mb-4">Join thousands of users on MegaMarket. Post your property, car, service, job, or product today!</p>
        <a href="{{ route('#') }}" class="btn btn-secondary btn-lg">Post Now</a>
    </section>

</main>

{{-- ================= FOOTER ================= --}}
<footer>
    <div class="container text-center">
        <p class="mb-0">&copy; {{ date('Y') }} MegaMarket. All Rights Reserved.</p>
        <small><a href="{{ route('#') }}" class="text-white text-decoration-underline">Terms</a> | <a href="{{ route('#') }}" class="text-white text-decoration-underline">Privacy</a></small>
    </div>
</footer>

@endsection
