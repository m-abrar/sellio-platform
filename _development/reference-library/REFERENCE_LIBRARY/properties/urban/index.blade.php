@extends('frontend._layouts._app')

@section('title', 'Metro Homes - Urban Real Estate')
@section('template')
<link rel="stylesheet" href="{{ asset('css/themes/properties/urban/style.css') }}">
@endsection

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
    /* METRO HOMES THEME VARIABLES */
    :root {
        --color-primary: #0d6efd; /* Blue */
        --color-secondary: #0A1628; /* Dark Navy/Charcoal for background */
        --color-accent: #ff6b35; /* Orange/Red for badges */
        --dark-color: #333;
        --light-color: #ffffff;
        --muted-bg: #f8f9fa; /* Light background for sections */

        /* Overwrite layout defaults */
        --font-heading: 'Inter', sans-serif;
        --font-body: 'Inter', sans-serif;
        --border-radius: 1rem; /* Cards are 1rem */
        --max-width: 1140px;
    }

</style>
@endpush


@section('content')
    <section class="hero-section">
        <div class="container container-max text-center">
            <h1 class="display-4 mb-4">{!! page_content('home.hero.heading', 'Find Your Next Home in the<br>Heart of the City') !!}</h1>
            <p class="lead mb-5">{{ page_content('home.hero.paragraph', 'Modern apartments, skyline condos, and vibrant lofts are waiting for you.') }}</p>
            <div>
                <a href="{{ page_content('home.hero.button_1_link', '#') }}" class="btn btn-primary btn-lg mx-2">{{ page_content('home.hero.button_1', 'Explore Listings') }}</a>
                <a href="{{ page_content('home.hero.button_2_link', '#') }}" class="btn btn-outline-light btn-lg mx-2">{{ page_content('home.hero.button_2', 'View on Map') }}</a>
            </div>
        </div>
    </section>

    <section id="properties" class="py-5">
        <div class="container container-max py-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold">{{ page_content('home.listings.heading', 'Featured Properties') }}</h2>
                <p class="text-muted">{{ page_content('home.listings.paragraph', 'Handpicked listings from the heart of the downtown.') }}</p>
            </div>
            <div class="row g-4">
                {{-- Property Card Loop --}}
                @foreach ($properties as $property)

                @if ($loop->iteration > 8)
                    @break
                @endif
                    <div class="col-md-6 col-lg-3">
                        <div class="card property-card">
                            {{-- Image and badge --}}
                            <div class="position-relative">
                                {{-- Using the medium conversion of the 'featured_image' collection --}}
                                <img src="{{ $property->primary_image_url }}" class="card-img-top" alt="{{ $property->title }}">
                                <div class="price-badge">
                                    {{-- Display sale_price if available, otherwise base_price. Format as currency. --}}
                                    {{ $property->sale_price ? '$' . number_format($property->sale_price) : '$' . number_format($property->base_price) }}
                                </div>
                            </div>
                            <div class="card-body">
                                {{-- Property Name --}}
                                <h5 class="card-title">{{ $property->title }}</h5>
                                
                                {{-- Location (City, State, Country) --}}
                                <p class="card-text text-muted">
                                    <i class="bi bi-geo-alt-fill"></i> 
                                    {{ $property->city ?? '' }}{{ $property->state ? ', ' . $property->state : '' }}{{ $property->country ? ', ' . $property->country : '' }}
                                </p>
                                
                                {{-- Key Features (Bedrooms, Bathrooms, Area) --}}
                                <div class="d-flex justify-content-between text-muted small">
                                    <span><i class="bi bi-door-open-fill"></i> {{ $property->number_of_bedrooms ?? 'N/A' }} Bed</span>
                                    <span><i class="bi bi-droplet-half"></i> {{ $property->number_of_bathrooms ?? 'N/A' }} Bath</span>
                                    <span><i class="bi bi-arrows-fullscreen"></i> {{ $property->area_formatted ?? 'N/A' }}</span>
                                </div>
                                
                                {{-- Link to individual property page using the slug --}}
                                <a href="{{ route('properties.show', $property->slug) }}" class="stretched-link" title="View {{ $property->title }}"></a>
                            </div>
                        </div>
                    </div>
                @endforeach
                {{-- End Property Card Loop --}}
            </div>
        </div>
    </section>

    <section id="map" class="py-5 bg-light">
        <div class="container container-max py-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold">{{ page_content('home.map.heading', 'Map Exploration') }}</h2>
                <p class="text-muted">{{ page_content('home.map.paragraph', 'Discover properties in their urban context.') }}</p>
            </div>
            <div class="row align-items-center g-5">
                <div class="col-lg-8">
                    <div class="map-container">
                            <img 
                                src="https://placehold.co/800x600/343a40/ffffff?text=MAP+VIEW+PLACEHOLDER" 
                                alt="Map of downtown properties" 
                                class="img-fluid"
                            >
                        </div>
                </div>
                <div class="col-lg-4">
                    <div class="d-grid gap-3">
                        {{-- Map Card Listing Loop --}}
                        @foreach ($properties as $property)
                            {{-- Stop the loop after the 3rd iteration, as in the original code --}}
                            @if ($loop->iteration > 3)
                                @break
                            @endif

                            <div class="card card-body flex-row align-items-center">
                                {{-- Property Image (using small conversion for a small thumbnail) --}}
                                <img src="{{ $property->primary_image_url }}" class="rounded me-3" style="width: 80px; height: 80px; object-fit: cover;" alt="{{ $property->title }} Thumbnail">
                                <div>
                                    {{-- Property Name --}}
                                    <h6 class="mb-1 fw-bold">{{ $property->title }}</h6>
                                    
                                    {{-- Price (Sale or Base) --}}
                                    <p class="mb-1 text-primary fw-semibold">
                                        {{ $property->sale_price ? '$' . number_format($property->sale_price) : '$' . number_format($property->base_price) }}
                                    </p>
                                    
                                    {{-- Key Features --}}
                                    <p class="mb-0 text-muted small">
                                        {{ $property->bedrooms ?? 'N/A' }} Bed, {{ $property->bathrooms ?? 'N/A' }} Bath
                                    </p>
                                </div>
                                {{-- Link to individual property page using the slug --}}
                                <a href="{{ route('properties.show', $property->slug) }}" class="stretched-link" title="View {{ $property->title }}"></a>
                            </div>
                        @endforeach
                        {{-- End Map Card Listing Loop --}}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="lifestyle" class="py-5">
        <div class="container container-max py-4">
            <div class="text-center mb-5">
                <h2 class="fw-bold">{{ page_content('home.features.heading', 'Live the Urban Lifestyle') }}</h2>
                <p class="text-muted">{{ page_content('home.features.paragraph', 'Everything you need, right at your doorstep.') }}</p>
            </div>
            <div class="row g-4 text-center">
                {{-- Lifestyle Feature Loop --}}
                @foreach ([
                    ['icon' => 'bi-cup-hot-fill', 'title' => 'Cafes & Eateries', 'text' => 'Gourmet coffee and world-class dining just a walk away.'],
                    ['icon' => 'bi-moon-stars-fill', 'title' => 'Vibrant Nightlife', 'text' => 'Experience the best bars, venues, and entertainment.'],
                    ['icon' => 'bi-briefcase-fill', 'title' => 'Coworking Hubs', 'text' => 'Innovative spaces to work and collaborate in the city.'],
                    ['icon' => 'bi-bicycle', 'title' => 'Parks & Recreation', 'text' => 'Green spaces and city parks for your active lifestyle.']
                ] as $feature)
                    <div class="col-md-3">
                        <div class="p-4">
                            <i class="bi {{ $feature['icon'] }} fs-1 text-primary"></i>
                            <h4 class="mt-3">{{ $feature['title'] }}</h4>
                            <p class="text-muted">{{ $feature['text'] }}</p>
                        </div>
                    </div>
                @endforeach
                {{-- End Lifestyle Feature Loop --}}
            </div>
        </div>
    </section>

    
    

<section id="agents" class="py-5 bg-light">
    <div class="container container-max py-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold">{{ page_content('home.agents.heading', 'Meet Our Agents') }}</h2>
            <p class="text-muted">{{ page_content('home.hero.paragraph', 'Our experts in urban living are here to help you.') }}</p>
        </div>
        <div class="row g-4">
            {{-- Agent Card Loop --}}
            @foreach ($agents->take(3) as $agent)
                <div class="col-md-4">
                    <div class="card agent-card text-center p-4 border-0 shadow-sm">
                        {{-- Agent Image: Using a placeholder if profile_image_url is not set --}}
                        <img 
                            src="{{ $agent->avatar_url }}" 
                            class="rounded-circle mx-auto mb-3" 
                            alt="Agent {{ $agent->name }}"
                            style="width: 120px; height: 120px; object-fit: cover;"
                        >
                             
                        <div class="card-body">
                            <h5 class="card-title mb-1">{{ $agent->name }}</h5>
                            <p class="text-muted">{{ $agent->name ?? 'Real Estate Specialist' }}</p>
                            
                            <div class="star-rating mb-3">
                                {{-- Star rendering based on agent's rating --}}
                                @php
                                    $rating = $agent->rating('property') ?? 0;
                                @endphp
                                @for ($i = 1; $i <= 5; $i++)
                                    @if ($rating >= $i)
                                        <i class="bi bi-star-fill text-warning"></i>
                                    @elseif ($rating > $i - 1)
                                        <i class="bi bi-star-half text-warning"></i>
                                    @else
                                        <i class="bi bi-star text-muted"></i>
                                    @endif
                                @endfor
                            </div>
                            
                            {{-- Assuming a route for agent profile/contact --}}
                            <a href="{{ route('partner.profile', $agent) }}" class="btn btn-primary">Contact Agent</a>
                        </div>
                    </div>
                </div>
            @endforeach
            {{-- End Agent Card Loop --}}
            
            {{-- Optional: Add placeholder cards if agents count is less than 3 --}}
            @for ($i = $agents->count(); $i < 3; $i++)
                <div class="col-md-4">
                    <div class="card agent-card text-center p-4 border-0 shadow-sm">
                        <img src="https://picsum.photos/150/f8f9fa/6c757d?text=New+Agent" 
                             class="rounded-circle mx-auto mb-3" 
                             alt="New Agent Coming Soon"
                             style="width: 120px; height: 120px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title mb-1">Join Our Team</h5>
                            <p class="text-muted">Expert Position Open</p>
                            <div class="star-rating mb-3">
                                <i class="bi bi-star text-muted"></i>
                                <i class="bi bi-star text-muted"></i>
                                <i class="bi bi-star text-muted"></i>
                                <i class="bi bi-star text-muted"></i>
                                <i class="bi bi-star text-muted"></i>
                            </div>
                            <a href="#" class="btn btn-secondary">Apply Now</a>
                        </div>
                    </div>
                </div>
            @endfor
        </div>
    </div>
</section>
@endsection

@push('scripts')
<script>
    const navbar = document.getElementById('navbar');
    window.onscroll = function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-solid');
            navbar.classList.remove('navbar-transparent');
            navbar.classList.remove('navbar-dark');
            navbar.classList.add('navbar-light');
        } else {
            navbar.classList.remove('navbar-solid');
            navbar.classList.add('navbar-transparent');
            navbar.classList.add('navbar-dark');
            navbar.classList.remove('navbar-light');
        }
    };
</script>
@endpush