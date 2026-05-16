@extends('frontend._layouts._app')

@section('title', 'Property Listings - ' . (setting('site_name') ?? 'Modern Estate'))

@push('styles')

<style>
/* Accent Color Variables */
:root {
  --bs-teal: #17a2b8; /* Vibrant Teal Accent */
  --bs-blue-light: #007bff;
}
/* You would typically define more custom styles here */
</style>

@endpush


@section('content')
<div class="container-xl my-3">
@php
  $heroSlides = $properties->take(3); 
@endphp

@if ($heroSlides->isNotEmpty())
  <div id="heroCarousel" class="carousel slide mb-5" data-bs-ride="carousel">
    
    <div class="carousel-indicators">
      @foreach ($heroSlides as $key => $property)
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="{{ $key }}" 
          class="{{ $loop->first ? 'active' : '' }}" aria-current="{{ $loop->first ? 'true' : 'false' }}" 
          aria-label="Slide {{ $key + 1 }}"></button>
      @endforeach
    </div>

    <div class="carousel-inner">
      @foreach ($heroSlides as $property)
        <div class="carousel-item {{ $loop->first ? 'active' : '' }} hero-section">
          {{-- The dynamic property card now serves as a single slide --}}
          <div class="hero-banner text-white"
            style="background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('{{ $property->primary_image_url ?? asset('images/fallbacks/default.jpg') }}');">
            
            <div class="hero-overlay">
              <h1 class="hero-title">{{ $property->title ?? 'Featured Property' }}</h1>
              <p class="hero-subtitle">
                {{ $property->location->title ?? 'Location not available' }} 
                @if(isset($property->bedrooms))
                  | {{ $property->bedrooms }} Bed, {{ $property->bathrooms }} Bath | {{ $property->price }}
                @endif
              </p>
              <a href="{{ route('properties.show', $property->slug ?? '#') }}" class="btn btn-teal">View Details</a>
            </div>
          </div>
        </div>
      @endforeach
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>

   </div>
@else
  <section class="hero-section text-white" 
    style="background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('{{ asset('images/fallbacks/default.jpg') }}');">
    
    <div class="hero-overlay">
      <h1 class="hero-title">Find Your Next Dream Home</h1>
      <p class="hero-subtitle">Search thousands of properties and connect with top agents.</p>
      <a href="{{ route('properties.index') ?? '#' }}" class="btn btn-teal">Start Searching</a>
    </div>
  </section>
@endif

  <div class="row mt-5">

    <div class="col-lg-3 d-none d-lg-block">
      <div class="filter-sidebar">
        <h5>Refine Search</h5>
        
        <div class="mb-4">
          <label class="form-label fw-bold">Price Range</label>
          <input type="range" class="form-range" min="500000" max="5000000" step="50000" value="1500000">
          <small class="text-muted d-block text-center">$500K - $5M</small>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold">Bedrooms</label>
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-secondary btn-sm active">Any</button>
            <button class="btn btn-outline-secondary btn-sm">2+</button>
            <button class="btn btn-outline-secondary btn-sm">3+</button>
            <button class="btn btn-outline-secondary btn-sm">4+</button>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label fw-bold">Property Type</label>
          <select class="form-select">
            <option selected>Any Type</option>
            <option>Apartment</option>
            <option>Loft</option>
            <option>House</option>
            <option>Condo</option>
          </select>
        </div>

        <button class="btn btn-outline-secondary w-100">Apply Filters</button>
      </div>
    </div>

    <div class="col-lg-9 properties-main-content">
      <h2 class="mb-4 fw-bold text-center text-lg-start">{{ page_content('home.body.heading', 'Featured Properties') }}</h2>

      {{-- FIX: Mobile Filter Button added here, visible only on non-large screens --}}
      <button class="btn btn-teal d-lg-none w-100 mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#filterOffcanvas" aria-controls="filterOffcanvas">
        <i class="fas fa-filter me-2"></i> Refine Search
      </button>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        
        {{-- Loop through the properties collection --}}
        @forelse ($properties as $property)

          <div class="col">
            <div class="card property-card">
              
              {{-- Property Image and Badges --}}
              <div class="card-img-top" style="background-image: url('{{ $property->primary_image_url ?? asset('images/fallbacks/card-default.jpg') }}');">
                
                {{-- Conditionally display badges --}}
                @if ($property->is_featured)
                  <span class="listing-badge badge-featured">FEATURED</span>
                @elseif (isset($property->created_at) && $property->created_at->diffInDays(now()) < 7)
                  <span class="listing-badge badge-new">NEW</span>
                @endif
                
                <span class="price-badge">{{ $property->price }}</span>
              </div>
              
              <div class="card-body">
                <div>
                  <h5 class="card-title">{{ $property->title }}</h5>
                  <p class="card-subtitle mb-2">{{ $property->location->title ?? '' }} - {{ $property->bedrooms }} Bed, {{ $property->bathrooms }} Bath</p>
                  <p class="card-text text-muted small">{{ Str::limit($property->description, 70) }}</p> 
                </div>
                <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-sm btn-teal mt-3 align-self-start">View Listing</a>
              </div>
            </div>
          </div>

        @empty
          <div class="col-12">
            <p class="text-center text-muted">No properties found matching your criteria.</p>
          </div>
        @endforelse

      </div>
      
      <div class="text-center mt-5">
        <a href="{{route('properties.index')}}" class="btn btn-lg btn-outline-secondary">{{ page_content('home.body.button', 'View All Properties') }}</a>
      </div>
      
    </div>
  </div>

  {{-- Newsletter and Agents Section --}}
  <div class="section-separator row mt-5 py-5 border-top">
    
    <div class="col-lg-6 mb-4 mb-lg-0">
      <h3 class="fw-bold mb-3">{{ page_content('global.newsletter.heading', 'Stay Updated') }}</h3>
      <p class="text-muted">{{ page_content('global.newsletter.paragraph', 'Get the latest modern listings delivered to your inbox.') }}</p>
      <form> 
        <div class="input-group">
          <input type="email" class="form-control form-control-lg" placeholder="Enter your email address..." aria-label="Email address" required>
          <button class="btn btn-teal btn-lg" type="submit">{{ page_content('global.newsletter.button', 'Subscribe') }}</button>
        </div>
      </form>
    </div>

    <div class="col-lg-6">
      <h3 class="fw-bold mb-3">{{ page_content('home.agents.heading', 'Meet Our Top Agents') }}</h3>
      <div class="d-flex align-items-center">
        <div class="text-center me-4">
          <img src="https://i.pravatar.cc/150?img=1" alt="Agent 1" class="agent-card-img mb-2">
          <div class="fw-bold">Liam Carter</div>
          <small class="text-muted">Luxury Specialist</small>
        </div>
        <div class="text-center me-4">
          <img src="https://i.pravatar.cc/150?img=3" alt="Agent 2" class="agent-card-img mb-2">
          <div class="fw-bold">Maya Singh</div>
          <small class="text-muted">City Expert</small>
        </div>
        <div class="text-center me-4">
          <img src="https://i.pravatar.cc/150?img=5" alt="Agent 3" class="agent-card-img mb-2">
          <div class="fw-bold">Javier Ruiz</div>
          <small class="text-muted">Rentals Lead</small>
        </div>
      </div>
    </div>

  </div>

</div>

{{-- Offcanvas Filter for Mobile --}}
<div class="offcanvas offcanvas-start" tabindex="-1" id="filterOffcanvas" aria-labelledby="filterOffcanvasLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title fw-bold" id="filterOffcanvasLabel">{{ page_content('global.sidebar.heading', 'Filter Properties') }}</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div class="mb-4">
      <label class="form-label fw-bold">Price Range</label>
      <input type="range" class="form-range" min="500000" max="5000000" step="50000" value="1500000">
      <small class="text-muted d-block text-center">$500K - $5M</small>
    </div>

    <div class="mb-4">
      <label class="form-label fw-bold">Bedrooms</label>
      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-secondary btn-sm active">Any</button>
        <button class="btn btn-outline-secondary btn-sm">2+</button>
        <button class="btn btn-outline-secondary btn-sm">3+</button>
        <button class="btn btn-outline-secondary btn-sm">4+</button>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-label fw-bold">Property Type</label>
      <select class="form-select">
        <option selected>Any Type</option>
        <option>Apartment</option>
        <option>Loft</option>
        <option>House</option>
        <option>Condo</option>
      </select>
    </div>

    <button class="btn btn-teal w-100 mt-3">{{ page_content('global.sidebar.button', 'Show Results') }}</button>
  </div>
</div>
@endsection

@push('scripts')
<script>
    // This script ensures a slight gradient overlay is applied to property card images 
    // without interfering with the main Hero Carousel images.
  document.querySelectorAll('.card-img-top').forEach(element => {
    const style = element.style.backgroundImage;
    
    // Check if the background style is set (i.e., not empty)
    if (style) {
            // Find the URL part of the background-image property
      const urlMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
      
      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1].replace(/['"]+/g, '');

                // Only apply if the current style doesn't already have the linear gradient (prevents duplication)
                if (!style.includes('linear-gradient(rgba(0,0,0,0.05)')) {
                    element.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.05)), url('${url}')`;
                }
      }
    }
  });
</script>
@endpush