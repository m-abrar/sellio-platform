{{-- resources/views/frontend/unifieds/mega/index.blade.php --}}
@extends('frontend.layouts.app')

@push('styles')
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
<style>
body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Poppins', sans-serif;
        }
        .navbar-brand {
            font-weight: 700;
        }
        .nav-link {
            font-weight: 500;
            color: #333;
        }
        .hero-banner {
            background: linear-gradient(90deg, #e0f2f7 0%, #d1e5ed 100%);
            border-radius: 15px;
            padding: 60px 0;
            position: relative;
            overflow: hidden;
            margin-bottom: 40px;
        }
        .hero-banner .collage-img {
            position: absolute;
            opacity: 0.8;
            filter: grayscale(100%);
            transition: transform 0.3s ease;
        }
        .hero-banner .collage-img:nth-child(2) { top: 10%; right: 5%; width: 150px; height: auto; transform: rotate(10deg); }
        .hero-banner .collage-img:nth-child(3) { bottom: 10%; left: 5%; width: 120px; height: auto; transform: rotate(-8deg); }
        .hero-banner .collage-img:nth-child(4) { top: 5%; left: 30%; width: 100px; height: auto; transform: rotate(5deg); }
        .hero-banner .collage-img:hover {
            transform: scale(1.05);
            filter: grayscale(0%);
            opacity: 1;
        }
        .search-bar {
            background-color: #fff;
            border-radius: 50px;
            padding: 10px 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        .search-bar .form-control {
            border: none;
            box-shadow: none;
            padding-left: 15px;
        }
        .search-bar .btn {
            border-radius: 50px;
            padding: 8px 25px;
            background-color: #0d6efd;
            border-color: #0d6efd;
        }
        .card {
            border: none;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            transition: transform 0.2s ease-in-out;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card-img-top {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            height: 180px;
            object-fit: cover;
        }
        .category-tab .nav-link {
            border-radius: 50px;
            padding: 8px 20px;
            margin: 0 5px;
            color: #6c757d;
            border: 1px solid #dee2e6;
            transition: all 0.3s ease;
        }
        .category-tab .nav-link.active {
            color: #fff;
            border-color: #0d6efd;
            background-color: #0d6efd;
        }
        .category-properties { background-color: #e0f2f2; color: #008080; }
        .category-properties.active { background-color: #008080; color: #fff; }
        .category-events { background-color: #fef3e7; color: #F97316; }
        .category-events.active { background-color: #F97316; color: #fff; }
        .category-autos { background-color: #e3e8f0; color: #1E3A8A; }
        .category-autos.active { background-color: #1E3A8A; color: #fff; }
        .category-services { background-color: #e2f5ec; color: #16A34A; }
        .category-services.active { background-color: #16A34A; color: #fff; }
        .category-jobs { background-color: #efebf9; color: #7C3AED; }
        .category-jobs.active { background-color: #7C3AED; color: #fff; }
        .category-classifieds { background-color: #fbe6e6; color: #DC2626; }
        .category-classifieds.active { background-color: #DC2626; color: #fff; }

        .category-nav .nav-link {
            border-radius: 50px;
            padding: 5px 15px;
            font-size: 0.9em;
            font-weight: 500;
            margin-right: 10px;
            margin-bottom: 10px;
        }

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

        .stats-icon {
            font-size: 3em;
            color: #0d6efd;
            margin-bottom: 15px;
        }
        .how-it-works-icon {
            font-size: 3.5em;
            color: #0d6efd;
            background-color: #e3f2fd;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }
        .testimonial-card {
            background-color: #fff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            text-align: center;
        }
        .testimonial-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 15px;
            border: 3px solid #0d6efd;
        }
        .cta-banner {
            background-color: #0d6efd;
            color: #fff;
            border-radius: 15px;
            padding: 60px 0;
        }
        .cta-banner .btn {
            background-color: #fff;
            color: #0d6efd;
            border-color: #fff;
            border-radius: 50px;
            padding: 12px 35px;
            font-weight: 600;
            font-size: 1.1em;
        }
        footer {
            background-color: #333;
            color: #f8f9fa;
            padding: 60px 0 30px;
        }
        footer a {
            color: #f8f9fa;
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
@endpush

@section('content')

{{-- ================= NAVBAR ================= --}}
<nav class="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
  <div class="container">
    <a class="navbar-brand text-primary" href="{{ route('#') }}">MegaHub</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul class="navbar-nav category-nav">
        @foreach(['Properties','Events','Autos','Services','Jobs','Classifieds'] as $cat)
          <li class="nav-item">
            <a class="nav-link category-{{ strtolower($cat) }} text-decoration-none" href="{{ route('#') }}">{{ $cat }}</a>
          </li>
        @endforeach
      </ul>
      <ul class="navbar-nav ms-lg-3">
        <li class="nav-item">
          <a class="nav-link btn btn-outline-primary rounded-pill px-3" href="{{ route('#') }}"><i class="bi bi-person-circle me-1"></i> Sign In</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<main>

  {{-- ================= HERO ================= --}}
  <section class="hero-banner text-center my-5 position-relative">
    <img src="https://picsum.photos/seed/propertyhero/400/300" class="collage-img rounded-3 d-none d-md-block" alt="Property">
    <img src="https://picsum.photos/seed/eventhero/400/300" class="collage-img rounded-3 d-none d-md-block" alt="Event">
    <img src="https://picsum.photos/seed/autohero/400/300" class="collage-img rounded-3 d-none d-lg-block" alt="Auto">

    <div class="container position-relative z-index-1">
      <h1 class="display-4 fw-bold mb-4 text-primary">Your Ultimate Hub for Everything</h1>
      <p class="lead mb-5 text-secondary">Discover properties, events, autos, services, jobs, and classifieds all in one place.</p>
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <form class="d-flex search-bar">
            <input class="form-control me-2" type="search" placeholder="Search for anything...">
            <button class="btn btn-primary" type="submit"><i class="bi bi-search me-1"></i> Search</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  {{-- ================= TRENDING ================= --}}
  <section class="container my-5">
    <h2 class="mb-4 text-center">Trending Now</h2>
    {{-- Tabs --}}
    <ul class="nav nav-pills justify-content-center mb-4 category-tab" id="trendingTabs" role="tablist">
      @foreach(['properties','events','autos','services','jobs','classifieds'] as $cat)
        <li class="nav-item">
          <button class="nav-link {{ $loop->first ? 'active' : '' }} category-{{ $cat }}" data-bs-toggle="tab" data-bs-target="#trending{{ ucfirst($cat) }}" type="button">{{ ucfirst($cat) }}</button>
        </li>
      @endforeach
    </ul>
    {{-- Tab Content --}}
    <div class="tab-content" id="trendingTabsContent">
      @foreach(['properties','events','autos','services','jobs','classifieds'] as $cat)
      <div class="tab-pane fade {{ $loop->first ? 'show active' : '' }}" id="trending{{ ucfirst($cat) }}">
        <div class="row g-4">
          @foreach(range(1,4) as $i)
          <div class="col-md-6 col-lg-3">
            <div class="card">
              <img src="https://picsum.photos/seed/{{ $cat }}{{ $i }}/400/250" class="card-img-top" alt="{{ ucfirst($cat) }} {{ $i }}">
              <div class="card-body">
                <h5 class="card-title">{{ ucfirst($cat) }} Item {{ $i }}</h5>
                <p class="card-text text-muted">Details about {{ $cat }} {{ $i }}</p>
                <a href="{{ route('#') }}" class="btn btn-sm btn-outline-primary rounded-pill">View</a>
              </div>
            </div>
          </div>
          @endforeach
        </div>
      </div>
      @endforeach
    </div>
  </section>

  {{-- ================= FEATURED ================= --}}
  <section class="container my-5">
    <h2 class="mb-4 text-center">Featured Listings</h2>
    <div class="row g-4">
      @foreach(['Property','Event','Auto'] as $cat)
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <img src="https://picsum.photos/seed/featured{{ strtolower($cat) }}/400/250" class="card-img-top" alt="Featured {{ $cat }}">
          <div class="card-body">
            <h5 class="card-title text-primary">Featured {{ $cat }}</h5>
            <p class="card-text text-muted">{{ $cat }} details</p>
            <a href="{{ route('#') }}" class="btn btn-sm btn-outline-primary rounded-pill">View {{ $cat }}</a>
          </div>
        </div>
      </div>
      @endforeach
    </div>
  </section>

  {{-- ================= EXPLORE BY CATEGORY ================= --}}
<section class="container my-5">
    <h2 class="mb-4 text-center">Explore by Category</h2>
    <div class="row g-4">
        @foreach(['Properties','Events','Autos','Services','Jobs','Classifieds'] as $cat)
        <div class="col-md-6 col-lg-4">
            <div class="category-spotlight-card category-{{ strtolower($cat) }}">
                <img src="https://picsum.photos/seed/{{ strtolower($cat) }}spotlight/600/400" alt="{{ $cat }}">
                <div class="content">
                    <h3>{{ $cat }}</h3>
                    <p>
                        @switch($cat)
                            @case('Properties') Find your dream home or investment opportunity. @break
                            @case('Events') Discover exciting happenings near you. @break
                            @case('Autos') New and used vehicles for every need. @break
                            @case('Services') Connect with local professionals and businesses. @break
                            @case('Jobs') Your next career opportunity awaits. @break
                            @case('Classifieds') Buy, sell, and trade locally. @break
                        @endswitch
                    </p>
                    <a href="{{ route('#') }}" class="btn">
                        @switch($cat)
                            @case('Properties') View Listings @break
                            @case('Events') Browse Events @break
                            @case('Autos') Find Your Ride @break
                            @case('Services') Explore Services @break
                            @case('Jobs') View Jobs @break
                            @case('Classifieds') Browse Ads @break
                        @endswitch
                    </a>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</section>

{{-- ================= STATS ================= --}}
<section class="container my-5 py-5 text-center bg-white rounded-3 shadow-sm">
    <h2 class="mb-5">MegaHub by the Numbers</h2>
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

{{-- ================= HOW IT WORKS ================= --}}
<section class="container my-5">
    <h2 class="mb-5 text-center">How It Works</h2>
    <div class="row text-center">
        <div class="col-md-4">
            <div class="how-it-works-icon"><i class="bi bi-search"></i></div>
            <h4 class="mb-3">1. Search & Discover</h4>
            <p class="text-muted">Easily find what you're looking for with our powerful search.</p>
        </div>
        <div class="col-md-4">
            <div class="how-it-works-icon"><i class="bi bi-chat-dots"></i></div>
            <h4 class="mb-3">2. Connect & Interact</h4>
            <p class="text-muted">Communicate directly with sellers, service providers, or recruiters.</p>
        </div>
        <div class="col-md-4">
            <div class="how-it-works-icon"><i class="bi bi-check-circle"></i></div>
            <h4 class="mb-3">3. Achieve Your Goal</h4>
            <p class="text-muted">Successfully buy, sell, hire, attend, or find what you need.</p>
        </div>
    </div>
</section>

{{-- ================= TESTIMONIALS ================= --}}
<section class="container my-5">
    <h2 class="mb-5 text-center">What Our Users Say</h2>
    <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
            @foreach([0,1,2] as $i)
                <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="{{ $i }}" class="{{ $i==0 ? 'active' : '' }}" aria-current="{{ $i==0 ? 'true' : 'false' }}" aria-label="Slide {{ $i+1 }}"></button>
            @endforeach
        </div>
        <div class="carousel-inner py-5">
            @foreach([1,2,3] as $i)
            <div class="carousel-item {{ $i==1 ? 'active' : '' }}">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="testimonial-card">
                            <img src="https://picsum.photos/seed/testimonial{{ $i }}/80/80" class="testimonial-img" alt="User {{ $i }}">
                            <p class="lead">"Testimonial text {{ $i }} goes here. This is placeholder content."</p>
                            <h5 class="fw-bold text-primary">- User {{ $i }}</h5>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
        </button>
    </div>
</section>

{{-- ================= CTA ================= --}}
<section class="cta-banner text-center my-5">
    <div class="container">
        <h2 class="display-5 fw-bold mb-4">Ready to Get Started?</h2>
        <p class="lead mb-5">Join thousands of happy users finding what they need on MegaHub!</p>
        <a href="{{ route('#') }}" class="btn">Sign Up Free</a>
    </div>
</section>

{{-- ================= FOOTER ================= --}}
<footer class="text-white py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-6 mb-4">
                <h5 class="footer-logo mb-3">MegaHub</h5>
                <p class="small">Your all-in-one platform for properties, events, autos, services, jobs, and classifieds.</p>
            </div>
            <div class="col-lg-2 col-md-6 mb-4">
                <h5 class="mb-3">Quick Links</h5>
                <ul class="list-unstyled">
                    @foreach(['About Us','How It Works','Testimonials','Support'] as $link)
                        <li><a href="{{ route('#') }}" class="text-decoration-none">{{ $link }}</a></li>
                    @endforeach
                </ul>
            </div>
            <div class="col-lg-2 col-md-6 mb-4">
                <h5 class="mb-3">Categories</h5>
                <ul class="list-unstyled">
                    @foreach(['Properties','Events','Autos','Services','Jobs','Classifieds'] as $link)
                        <li><a href="{{ route('#') }}" class="text-decoration-none">{{ $link }}</a></li>
                    @endforeach
                </ul>
            </div>
            <div class="col-lg-2 col-md-6 mb-4">
                <h5 class="mb-3">Legal</h5>
                <ul class="list-unstyled">
                    @foreach(['Privacy Policy','Terms of Service','Cookie Policy'] as $link)
                        <li><a href="{{ route('#') }}" class="text-decoration-none">{{ $link }}</a></li>
                    @endforeach
                </ul>
            </div>
            <div class="col-lg-3 col-md-6">
                <h5 class="mb-3">Connect With Us</h5>
                <ul class="list-unstyled d-flex">
                    @foreach(['facebook','twitter','instagram','linkedin'] as $icon)
                        <li class="me-3"><a href="{{ route('#') }}" class="text-decoration-none"><i class="bi bi-{{ $icon }} fs-4"></i></a></li>
                    @endforeach
                </ul>
                <p class="small mt-3">Subscribe to our newsletter for updates:</p>
                <form class="d-flex">
                    <input class="form-control me-2 rounded-pill" type="email" placeholder="Your email">
                    <button class="btn btn-primary rounded-pill" type="submit"><i class="bi bi-send-fill"></i></button>
                </form>
            </div>
        </div>
        <hr class="my-4 border-light opacity-25">
        <div class="text-center small">&copy; {{ date('Y') }} MegaHub. All rights reserved.</div>
    </div>
</footer>


@endsection
