@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">
  <style>
    /* 🎨 MODERN COLOR PALETTE: Teal, Charcoal, Orange */
    :root{
      /* --- COLORS --- */
      --accent: #008080; /* Primary Teal */
      --secondary-accent: #ff8c00; /* Vibrant Orange (Secondary/Link/CTA) */
      --soft-gold: #343a40; /* Charcoal */
      --muted: #6c757d;
      --bg: #ffffff; 
      --dark-bg: #e9ecef; 
      --top-bar-bg: #f8f9fa; /* Light Gray for utility bar */
      --text-dark: #212529;
      --footer-bg: #006666; 
      --footer-text-color: #f0f8ff; 
      --light-icon-color: #ffffff; 

      /* --- FONTS & TYPOGRAPHY --- */
      --font-body: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      --font-heading: 'Montserrat', sans-serif;

      /* --- GRADIENTS & EFFECTS --- */
      --main-gradient: linear-gradient(90deg, var(--accent), #004d4d); /* Teal Gradient */
      --nav-soft-gradient: linear-gradient(90deg, #e0f2f2, #c2e6e6); /* Soft Brand Colors for Nav */
      --soft-teal-border: #c2e6e6;
      --footer-border-color: #33a3a3;
    }
   
  </style>
@endpush

@section('content')
@php
  // === Data arrays ===

  $nav = [
    ['label'=>'Properties', 'href'=>'#properties-explore'],
    ['label'=>'Autos', 'href'=>'#autos-explore'],
    ['label'=>'Events', 'href'=>'#events-explore'],
    ['label'=>'Classifieds', 'href'=>'#classifieds-explore'],
    ['label'=>'Services', 'href'=>'#services-explore'],
    ['label'=>'Jobs', 'href'=>'#jobs-explore'],
    ['label'=>'Blog', 'href'=>'#blog'], 
  ];

  $categories = [
    ['id'=>'properties', 'name'=>'Properties', 'desc'=>'Find your dream home or investment.', 'color'=>'#007bff', 'icon'=>'fa-house','slides'=>[101,102,103], 'overlay_var'=>'#007bffbb'], // Blue
    ['id'=>'autos', 'name'=>'Autos', 'desc'=>'New and used vehicles for every need.', 'color'=>'#28a745', 'icon'=>'fa-car','slides'=>[201,202,203], 'overlay_var'=>'#28a745bb'], // Green
    ['id'=>'events', 'name'=>'Events', 'desc'=>'Concerts, meetups and local happenings.', 'color'=>'#6f42c1', 'icon'=>'fa-calendar-days','slides'=>[301,302], 'overlay_var'=>'#6f42c1bb'], // Purple
    ['id'=>'classifieds', 'name'=>'Classifieds', 'desc'=>'Buy, sell, trade — local ads.', 'color'=>'#fd7e14', 'icon'=>'fa-tag','slides'=>[401,402], 'overlay_var'=>'#fd7e14bb'], // Orange
    ['id'=>'services', 'name'=>'Services', 'desc'=>'Skilled pros for every job.', 'color'=>'#20c997', 'icon'=>'fa-wrench','slides'=>[501,502,503], 'overlay_var'=>'#20c997bb'], // Teal
    ['id'=>'jobs', 'name'=>'Jobs', 'desc'=>'Career opportunities and gigs.', 'color'=>'#343a40', 'icon'=>'fa-briefcase','slides'=>[601,602,603], 'overlay_var'=>'#343a40bb'], // Dark Gray
  ];

  // Sample trending listings
  $listings = collect(range(1,8))->map(function($i){
    return (object)[
      'title'=>"Modern Townhouse Listing #{$i} in Central Suburb", 
      'subtitle'=>"City ".chr(64+$i).', CA',
      'price'=> '$'.($i*10).'k',
      'img'=> "https://picsum.photos/600/400?random=".(900+$i)
    ];
  });

  // Feature Boxes Data 
  $features = [
    ['title'=>'Advanced Search', 'subtitle'=>'Find what you need across all categories quickly.', 'btn'=>'Start Searching', 'icon'=>'fa-magnifying-glass', 'color'=>'bg-blue', 'bg_icon'=>'fa-route'], 
    ['title'=>'Post a Listing', 'subtitle'=>'Reach millions of users instantly with a new ad.', 'btn'=>'List Now', 'icon'=>'fa-plus', 'color'=>'bg-green', 'bg_icon'=>'fa-seedling'], 
    ['title'=>'Verified Providers', 'subtitle'=>'Connect with vetted local experts for any job.', 'btn'=>'Hire a Pro', 'icon'=>'fa-wrench', 'color'=>'bg-purple', 'bg_icon'=>'fa-handshake'], 
    ['title'=>'Local Events', 'subtitle'=>'Discover all local happenings and upcoming shows.', 'btn'=>'Find Tickets', 'icon'=>'fa-calendar-days', 'color'=>'bg-orange', 'bg_icon'=>'fa-ticket'], 
  ];

  // Testimonials Data
  $testimonials = [
    (object)['quote'=>'Selling my car was faster and easier than I ever expected. The integrated buyer communication was excellent!', 'name'=>'Marcus T.', 'category'=>'Auto Seller'],
    (object)['quote'=>'I found the perfect service provider for my home renovation project within minutes. Highly recommended!', 'name'=>'Sarah L.', 'category'=>'Homeowner'],
    (object)['quote'=>'The best platform for discovering local events! I always know what\'s happening in the city now.', 'name'=>'Jamie P.', 'category'=>'Event Goer'],
  ];
@endphp



<section class="feature-section-plain pt-6 pb-4">
  <div class="container">
    <div class="row g-4">
      @foreach($features as $f)
        <div class="col-lg-3 col-md-6">
          <div class="feature-box card-no-radius shadow">
            <div class="content position-relative z-2">
              <h4><i class="fa {{ $f['icon'] }} me-2"></i> {{ $f['title'] }}</h4>
              <p>{{ $f['subtitle'] }}</p>
              <a href="#" class="btn btn-sm btn-cta no-radius mt-3 fw-bold">{{ $f['btn'] }} <i class="fa fa-arrow-right ms-1"></i></a>
            </div>
            <i class="fa {{ $f['bg_icon'] }} icon-bg"></i>
          </div>
        </div>
      @endforeach
    </div>
    <div class="text-white text-center mt-5">
    {{-- NEW: Added a decorative border line --}}
      <div class="horizontal-rule-light mx-auto mb-4"></div> 
      
      <p class="lead fw-normal fs-5">{{ page_content('home.hero.subheading', 'Trusted marketplace for everything from **Property** and **Autos** to **Services** and **Jobs**.') }}</p>
  </div>
  </div>
</section>

{{-- === RESTORED CATEGORY LAYOUT (STATIC MARKUP) === --}}
<section class="py-5 bg-white">
  <div class="container">
    <div class="text-center mb-4">
      <h2 class="mega-title fw-bold">{!! page_content('home.categories.heading', 'Explore by <span class="accent-word">Category</span>') !!} </h2> 
      <p class="text-muted">Curated categories to help users find what they need — fast.</p>
    </div>

    <div class="row g-4">
      <div class="col-lg-6">
        <div id="propertiesCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="properties" id="properties-explore">
          <div class="carousel-inner h-100">
            @foreach($propertiesFeatured->random(3) as $property)
            <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
              <img src="{{$property->primary_image_url}}" alt="{{$property->title}}" class="d-block w-100 h-100">
            </div>
            @endforeach

          </div>
          <div class="overlay">
            <h3><i class="fa fa-house me-2"></i> {{ page_content('home.categories.properties_heading', 'Properties') }}</h3>
            <p>{{ page_content('home.categories.properties_sub_heading', 'Find your dream home or investment.') }}</p>
          </div>
          <button class="carousel-control-prev no-radius" type="button" data-bs-target="#propertiesCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next no-radius" type="button" data-bs-target="#propertiesCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="row g-4">
          <div class="col-12">
            <div id="autosCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="autos" id="autos-explore">
              <div class="carousel-inner h-100">
                @foreach($autosLatest->random(3) as $auto)
                <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
                  <img src="{{$auto->primary_image_url}}" alt="{{$auto->title}}" class="d-block w-100 h-100">
                </div>
                @endforeach
              </div>
              <div class="overlay">
                <h3><i class="fa fa-car me-2"></i> {{ page_content('home.categories.autos_heading', 'Autos') }}</h3>
                <p>{{ page_content('home.categories.autos_sub_heading', 'New &amp; used vehicles for every need.') }}</p>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div id="eventsCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="events" id="events-explore">
              <div class="carousel-inner h-100">
                @foreach($eventsFeatured->random(3) as $event)
                <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
                  <img src="{{$event->primary_image_url}}" alt="{{$event->title}}" class="d-block w-100 h-100">
                </div>
                @endforeach
              </div>
              <div class="overlay">
                <h5><i class="fa fa-calendar-days me-2"></i> {{ page_content('home.categories.autos_heading', 'Events') }}</h5>
                <p class="mb-0">{{ page_content('home.categories.autos_sub_heading', 'Concerts, meetups and local happenings.') }}</p>
              </div>
            </div>
          </div>

          <div class="col-6">
            <div id="classifiedsCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="classifieds" id="classifieds-explore">
              <div class="carousel-inner h-100">
                @foreach($classifiedsFeatured->random(3) as $classified)
                <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
                  <img src="{{$classified->primary_image_url}}" alt="{{$classified->title}}" class="d-block w-100 h-100">
                </div>
                @endforeach
              </div>
              <div class="overlay">
                <h5><i class="fa fa-tag me-2"></i> {{ page_content('home.categories.classifieds_heading', 'Classifieds') }}</h5>
                <p class="mb-0">{{ page_content('home.categories.classifieds_sub_heading', 'Buy, sell, trade — local ads.') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-3">
      <div class="col-lg-6">
        <div id="servicesCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="services" id="services-explore">
          <div class="carousel-inner h-100">
            @foreach($servicesFeatured->random(3) as $service)
            <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
              <img src="{{$service->primary_image_url}}" alt="{{$service->title}}" class="d-block w-100 h-100">
            </div>
            @endforeach
          </div>
          <div class="overlay">
            <h3><i class="fa fa-wrench me-2"></i> {{ page_content('home.categories.services_heading', 'Services') }}</h3>
            <p>{{ page_content('home.categories.services_sub_heading', 'Skilled pros for every job.') }}</p>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div id="jobsCarousel" class="carousel slide category-box card-no-radius h-100" data-bs-ride="carousel" data-id="jobs" id="jobs-explore">
          <div class="carousel-inner h-100">

            @foreach($jobsFeatured->random(3) as $job)
            <div class="carousel-item h-100 {{ $loop->first ? 'active' : '' }}">
              <img src="{{$job->primary_image_url}}" alt="{{$job->title}}" class="d-block w-100 h-100">
            </div>
            @endforeach

          </div>
          <div class="overlay">
            <h3><i class="fa fa-briefcase me-2"></i> {{ page_content('home.categories.jobs_heading', 'Jobs') }}</h3>
            <p>{{ page_content('home.categories.jobs_sub_heading', 'Career opportunities and gigs.') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{{-- === END RESTORED CATEGORY LAYOUT === --}}

<section class="py-6 bg-dark-bg">
  <div class="container trending-wrapper-container">
    {{-- Flex container for the title and the "View all" link --}}
    <div class="d-flex justify-content-between align-items-center mb-4"> 
      <h3 class="fw-bold fs-4 mb-0">{{ page_content('home.trending.heading', 'Trending Listings') }}</h3>
      {{-- This link is now easily targetable by the CSS FIX --}}
      <a href="{{ page_content('home.trending.link', '#') }}" class="text-decoration-none fw-semibold">{{ page_content('home.trending.button', 'View all') }} <i class="fa fa-arrow-right ms-1"></i></a>
    </div>

    
    @include('frontend.themes.unifieds.mega.index-slides-randomized')



  </div>
</section>

<section class="cta-banner text-center py-5">
  <div class="container">
    <h2 class="fw-bold fs-1">{{ page_content('home.cta.heading', 'Ready to reach millions of buyers?') }}</h2>
    <p class="mb-4 lead fs-5">{{ page_content('home.cta.subheading', 'Post your listing today and get discovered by local customers.') }}</p>
    <a href="{{ page_content('home.cta.link', '#') }}" class="btn btn-lg no-radius me-2 fw-semibold shadow-lg btn-primary">{{ page_content('home.cta.button', 'Post Your Ad') }}</a>
    <a href="{{ page_content('home.cta.link2', '#') }}" class="btn btn-outline-light btn-lg no-radius fw-semibold">{{ page_content('home.cta.button2', 'Learn More') }}</a>
  </div>
</section>

<section class="py-6 bg-white">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="mega-title fw-bold">{!! page_content('home.testimonials.heading', 'What Our Users <span class="accent-word">Say</span>') !!}</h2>
      <p class="text-muted">{{ page_content('home.testimonials.subheading', 'Real stories from satisfied customers who found what they needed.') }}</p>
    </div>

    <div id="testimonialsCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        @foreach($testimonials as $idx => $testimonial)
          <div class="carousel-item @if($idx==0) active @endif">
            <div class="row justify-content-center">
              <div class="col-lg-8">
                <div class="testimonial-card card-no-radius">
                    <i class="fa fa-quote-left quote-icon d-block text-start"></i>
                    <blockquote class="mb-4">{{ $testimonial->quote }}</blockquote>
                    <div class="d-flex justify-content-between align-items-center border-top pt-3">
                        <div class="fw-bold fs-5">{{ $testimonial->title }}</div>
                        <div class="text-muted small">{{ $testimonial->category }}</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        @endforeach
      </div>
      
      {{-- Carousel Controls --}}
      <button class="carousel-control-prev" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#testimonialsCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
      
      {{-- Carousel Indicators --}}
      <div class="carousel-indicators position-static mt-4">
          @foreach($testimonials as $idx => $testimonial)
            <button type="button" data-bs-target="#testimonialsCarousel" data-bs-slide-to="{{ $idx }}" class="@if($idx==0) active @endif" aria-current="@if($idx==0) true @endif" aria-label="Slide {{ $idx+1 }}"></button>
          @endforeach
      </div>

    </div>
  </div>
</section>

@endsection


@push('scripts')
<script>
  // Initialize carousels with interval
  document.querySelectorAll('.carousel').forEach((el) => {
    const interval = (el.id === 'testimonialsCarousel') ? 6000 : 4000;
    
    // We only explicitly start non-trending carousels to auto-rotate
    if (el.id !== 'trendingCarousel') {
        bootstrap.Carousel.getOrCreateInstance(el, { interval: interval, ride: 'carousel' });
    }
  });
</script>
@endpush