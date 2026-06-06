@extends('frontend._layouts._app')

@section('title', 'Paradise Found - Luxury Vacation Stays')

@push('styles')
    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
:root {
    --color-primary: #2EC4B6;
    --color-secondary: #0E8A86;
    --sandy-beige: #F5E6D3;
    --color-accent: #FF6B6B;
    --white: #FFFFFF;
    --light-gray: #f8f9fa;
    --dark-text: #343a40;
}

        
    </style>
@endpush

{{-- Main Content Section --}}
@section('content')
    
    <section class="hero-section">
        <div class="container text-center position-relative">
            <h1 class="display-3 fw-bold mb-4">{{ page_content('home.hero.heading', 'Find Your Perfect Escape') }}</h1>
            <p class="lead mb-5">{{ page_content('home.hero.paragraph', 'Discover luxury villas, cozy cabins, and stunning resorts.') }}</p>
            
            <div class="booking-panel mx-auto" style="max-width: 800px;">
                <form class="row g-3 align-items-center">
                    <div class="col-lg-4">
                        <input type="text" class="form-control form-control-lg" placeholder="Location (e.g., Maldives)">
                    </div>
                    <div class="col-lg-4">
                        <input type="text" class="form-control form-control-lg" placeholder="Check-in / Check-out">
                    </div>
                    <div class="col-lg-2">
                        <input type="number" class="form-control form-control-lg" placeholder="Guests">
                    </div>
                    <div class="col-lg-2">
                        <button type="submit" class="btn btn-primary btn-lg w-100">Search</button>
                    </div>
                </form>
            </div>
            
            <div class="mt-4">
                <a href="{{ page_content('home.hero.button_1_link', '#') }}" class="btn btn-light-outline mx-2">{{ page_content('home.hero.button_1', 'Explore Destinations') }}</a>
                <a href="{{ page_content('home.hero.button_2_link', '#') }}" class="btn btn-light-outline mx-2">{{ page_content('home.hero.button_2', 'Luxury Collection') }}</a>
                <a href="{{ page_content('home.hero.button_3_link', '#') }}" class="btn btn-light-outline mx-2">{{ page_content('home.hero.button_3', 'Instant Book') }}</a>
            </div>
        </div>
    </section>
    
    <main class="py-5">
        
        <section class="container my-5">
            <h2 class="text-center display-font mb-5">{{ page_content('home.featured.heading', 'Featured Collections') }}</h2>
            <div class="row g-4">
                
                @foreach($properties->take(3) as $property)
                <div class="col-lg-4">
                    <div class="collection-card">
                        <img src="{{$property->primary_image_url}}" alt="{{$property->title}}">
                        <div class="card-overlay">
                            <h3 class="display-font">{{$property->title}}</h3>
                            <p>{{$property->address ?? $property->location?->title}}</p>
                            <a href="{{route('properties.show', $property)}}" class="btn btn-secondary btn-sm" style="width: 120px;">Explore</a>
                        </div>
                    </div>
                </div>
                @endforeach


            </div>
        </section>
        
        <section class="container my-5 py-5 bg-light rounded-3">
            <h2 class="text-center display-font mb-5">{{ page_content('home.listings.heading', 'Top Rated Stays') }}</h2>
            <div class="row g-4">
                
                @foreach($properties->skip(3)->take(6) as $property)
                <div class="col-lg-4 col-md-6">
                    <div class="card stay-card h-100">
                        <img src="{{$property->primary_image_url}}" class="card-img-top" alt="{{$property->title}}">
                        <span class="price-badge">{{$property->price_formatted}}</span>
                        <div class="card-body">
                            <h5 class="card-title">{{$property->title}}</h5>
                            <p class="card-text text-muted mb-2">{{$property->number_of_bedrooms}} Bed, {{$property->number_of_bathrooms}} Bath — {{$property->location?->title ?? ''}}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="rating"><i class="bi bi-star-fill"></i> {{$property->rating_average}}</span> <small>({{$property->reviews->count()}} reviews)</small>
                                </div>
                                <img src="{{$property->user->avatar_url}}" alt="{{$property->user->company ?? $property->user->name}}" class="host-avatar">
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="amenities">
                                    <i class="bi bi-wifi" title="Wifi"></i>
                                    <i class="bi bi-p-circle-fill ms-2" title="Pool"></i>
                                    <i class="bi bi-cup-straw ms-2" title="Breakfast"></i>
                                </div>
                                <div class="quick-actions">
                                    <a href="#" class="text-muted me-2"><i class="bi bi-heart"></i></a>
                                    <a href="#" class="text-muted"><i class="bi bi-share"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-0 p-3">
                           <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#bookingModal">Book Now</button>
                        </div>
                    </div>
                </div>
                @endforeach


            </div>
        </section>
        
        <section class="container my-5">
             <div class="row align-items-center">
                 <div class="col-lg-7">
                     <div id="experienceCarousel" class="carousel slide" data-bs-ride="carousel">
                       <div class="carousel-inner rounded-3">
                         <div class="carousel-item active">
                           <img src="https://images.unsplash.com/photo-1562438668-bcf0ca6578f0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" class="d-block w-100" alt="Interior view">
                         </div>
                         <div class="carousel-item">
                           <img src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" class="d-block w-100" alt="Living room view">
                         </div>
                         <div class="carousel-item">
                           <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1400&q=80" class="d-block w-100" alt="Bedroom view">
                         </div>
                       </div>
                     </div>
                 </div>
                 <div class="col-lg-5 ps-lg-5 mt-4 mt-lg-0">
                     <h2 class="display-font">{{ page_content('home.about.heading', 'Unforgettable Experiences') }}</h2>
                     <p class="lead">{{ page_content('home.about.paragraph_1', 'Beyond a beautiful stay, unlock a world of unique experiences. Our hosts can arrange everything you need to make your trip truly special.') }}</p>
                     <p>{{ page_content('home.about.paragraph_2', 'Indulge in exclusive activities: Private chef dinners, guided island snorkeling tours, sunrise yoga on your private deck, and much more. Just ask your host.') }}</p>
                 </div>
             </div>
        </section>
        
        <section class="container my-5 py-5">
            <h2 class="text-center display-font mb-5">Meet Our Superhosts</h2>
            <div class="row g-4 text-center">
                <div class="col-md-4">
                    <img src="https://i.pravatar.cc/150?img=11" class="rounded-circle mb-3" width="120" height="120" alt="Host Luca">
                    <h5>Luca <span class="badge bg-info">Superhost</span></h5>
                    <p class="text-muted">Island Host</p>
                    <p>Sharing the magic of the Mediterranean is my passion. Let me show you the hidden gems of my island.</p>
                </div>
                <div class="col-md-4">
                    <img src="https://i.pravatar.cc/150?img=12" class="rounded-circle mb-3" width="120" height="120" alt="Host Maya">
                    <h5>Maya <span class="badge bg-info">Superhost</span></h5>
                    <p class="text-muted">Mountain Retreats</p>
                    <p>I curate peaceful, nature-first getaways where you can disconnect and recharge in the mountains.</p>
                </div>
                <div class="col-md-4">
                    <img src="https://i.pravatar.cc/150?img=13" class="rounded-circle mb-3" width="120" height="120" alt="Host Sophie">
                    <h5>Sophie <span class="badge bg-info">Superhost</span></h5>
                    <p class="text-muted">Luxury Villas</p>
                    <p>Every detail matters. I ensure my guests experience unparalleled luxury and comfort from start to finish.</p>
                </div>
            </div>
        </section>
        
        <section class="container-fluid g-0 my-5">
            <div id="map-placeholder" style="height: 400px; background: url({{ asset('images/map-placeholder.webp') }}) center center; background-size: cover;">
            </div>
        </section>
        
    </main>

    
    <div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title display-font" id="bookingModalLabel">Book Your Stay: Beachside Villa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form>
                <div class="mb-3">
                    <label for="booking-dates">... (Rest of the Modal Form) ...</label>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
@endsection

{{-- Push custom JavaScript to the end of the body in the layout --}}
@push('scripts')
    <script>
        // Navbar scroll effect
        document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.querySelector('.navbar');
            
            function toggleNavbarClass() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Initial check
            toggleNavbarClass();

            // Event listener for scroll
            window.addEventListener('scroll', toggleNavbarClass);
        });
    </script>
@endpush