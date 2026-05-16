@extends('frontend._layouts._app')

{{-- Define the page title --}}
@section('title', 'Luxe Estate | Premium Real Estate')


{{-- Page-specific CSS Styles --}}
@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
@endpush

@push('styles')
<style>
    :root {
        --color-primary: #C59A45; /* Gold used for primary actions */
        --color-secondary: #222222; /* Charcoal reference */

        --color-text-dark: #222222; /* Charcoal used for text/dark elements */
        --color-background: #FFFFFF; /* White used for background */
        --color-success: #198754; /* Default success */
        --color-danger: #dc3545; /* Default danger */
        --color-warning: #ffc107; /* Default warning */

        --color-gray-light: #E8E8E8; /* Soft Gray */
        --color-white: #FFFFFF; /* Direct White reference */

        --font-family-heading: 'Playfair Display', serif;
        --font-family-base: 'Inter', sans-serif;
    }
</style>
@endpush


@section('content')

@php
    $heroItems = $properties->take(3); 
@endphp

<div id="heroCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">

    {{-- Carousel Indicators --}}
    <div class="carousel-indicators">
        @foreach ($heroItems as $index => $property)
            <button
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide-to="{{ $index }}"
                class="{{ $index === 0 ? 'active' : '' }}"
                aria-current="{{ $index === 0 ? 'true' : 'false' }}"
                aria-label="Slide {{ $index + 1 }}"
                style="background-color: var(--color-primary);"
            ></button>
        @endforeach
    </div>

    {{-- Carousel Inner Items --}}
    <div class="carousel-inner">
        @foreach ($heroItems as $index => $property)
            <div
                class="carousel-item {{ $index === 0 ? 'active' : '' }}"
                style="background-image: url('{{ $property->primary_image_url }}');"
                aria-label="{{ $property->title ?? $property['title'] }}"
            >

            
                <div class="carousel-caption d-block">
                    <h1 style="color: var(--color-white);">{{ $property->title ?? '' }}</h1>
                    <p style="color: rgba(255, 255, 255, 0.9);">
                        {{ $property->location->title ?? '' }} | {{ $property->price_formatted ?? '' }}
                    </p>
                    <div class="d-flex gap-3 mt-4">
                        <a href="{{ route('properties.show', $property) ?? '#' }}" 
                           class="btn btn-gold-filled" 
                           aria-label="View details for {{ $property->title ?? '' }}">
                           View Details
                        </a>
                        <a href="{{ route('properties.show', $property) ?? '#' }}#contact" 
                           class="btn btn-outline-gold" 
                           aria-label="Schedule tour for {{ $property->title ?? '' }}">
                           Schedule Tour
                        </a>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    {{-- Carousel Controls --}}
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" aria-label="Previous slide">
        <span class="carousel-control-prev-icon" style="background-color: rgba(0,0,0,0.4); border-radius: 50%; padding: 1.5rem;"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" aria-label="Next slide">
        <span class="carousel-control-next-icon" style="background-color: rgba(0,0,0,0.4); border-radius: 50%; padding: 1.5rem;"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>

@php
    // To ensure we don't repeat properties used in the hero section (items 0, 1, 2),
    // we skip the first 3 and take the next 3. Adjust the skip/take numbers as needed.
    $featuredProperties = $properties->skip(3)->take(3);
@endphp

<section class="container container-max section-padding">
    <h2 class="text-center mb-5" style="color: var(--color-secondary);">{{ page_content('home.featured.heading', 'Featured Collection') }}</h2>
    <div class="row g-4 justify-content-center">
        
        {{-- Loop through the featured properties --}}
        @foreach ($featuredProperties as $property)
            <div class="col-lg-4 col-md-6">
                <div class="card card-custom h-100">
                    <div class="position-relative">
                        
                        {{-- Image: Use the property's image_url, linking to the full property page if applicable --}}
                        <a href="{{ route('properties.show', $property) ?? '#' }}" aria-label="View {{ $property->title ?? '' }}">
                            <img 
                                src="{{ $property->primary_image_url }}" 
                                class="card-img-top" 
                                alt="{{ $property->title ?? '' }}"
                            >
                        </a>
                        
                        {{-- Badge using theme variables --}}
                        <span class="card-overlay-badge" style="background-color: var(--color-primary); color: var(--color-white);">
                            {{ $property->is_featured ? __('Featured') : __('Signature') }}
                        </span>

                        {{-- Wishlist Icon --}}
                        <i class="far fa-heart heart-icon" 
                           aria-label="Add to favorites" 
                           style="color: var(--color-white);"
                        ></i>
                        
                        {{-- Overlay Caption --}}
                        <div class="card-title-overlay">
                            <h5 style="color: var(--color-white);">{{ $property->title ?? '' }}</h5>
                            <p class="mb-1" style="color: var(--color-white);">{{ $property->location->title ?? '' }}</p>
                            <p style="color: var(--color-white);">{{ $property->price_formatted ?? '' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach

        {{-- Optional: If no properties --}}
        @if ($featuredProperties->isEmpty())
            <div class="col-12 text-center">
                <p class="text-muted" style="color: var(--color-soft-gray);">No featured properties are currently available.</p>
            </div>
        @endif

    </div>
</section>


    {{-- Exclusive Listings Section FIX: Added .section-bg-light for full-width background --}}
<section class="section-padding section-bg-light">
    <div class="container container-max">
        <h2 class="text-center mb-5" style="color: var(--color-secondary);">{{ page_content('home.exclusive.heading', 'Exclusive Listings') }}</h2>

        @php
            // Skip the properties already shown in Hero (3) and Featured (3)
            $exclusiveListings = $properties->skip(0); 
        @endphp

        <div class="row g-4">
            {{-- Loop through the exclusive properties --}}
            @foreach ($exclusiveListings as $property)
                <div class="col-lg-4 col-md-6">
                    <div class="card card-custom h-100">
                        <div class="position-relative">
                            
                            {{-- Property Image and Link --}}
                            <a href="{{ $property->url ?? '#' }}" aria-label="View {{ $property->title ?? $property['title'] }}">
                                <img 
                                    src="{{ $property->primary_image_url ?? '' }}" 
                                    class="card-img-top" 
                                    alt="{{ $property->title ?? '' }} Image"
                                >
                            </a>
                            
                            {{-- Dynamic Badge using theme variables --}}
                            @if (!empty($property->badge) || !empty($property['badge']))
                                <span class="card-overlay-badge" style="background-color: var(--color-primary); color: var(--color-white);">
                                    {{ $property->is_featured ? __('Featured') : __('Signature') }}
                                </span>
                            @endif

                            {{-- Static Wishlist Button --}}
                            <i class="far fa-heart heart-icon" aria-label="Add to favorites" style="color: var(--color-white);"></i>
                        </div>
                        
                        <div class="card-body">
                            {{-- Title and Price --}}
                            <h5 class="card-title" style="color: var(--color-secondary);">{{ $property->title ?? '' }}</h5>
                            <h6 class="text-gold mb-2" style="color: var(--color-primary);">{{ $property->price_formatted ?? '' }}</h6>
                            
                            {{-- Dynamic Specs --}}
                            @php
                                $beds = $property->number_of_bedrooms ?? '?';
                                $baths = $property->number_of_bathrooms ?? '?';
                                $area = $property->area_formatted ?? '?';
                            @endphp
                            <p class="card-text small" style="color: var(--color-soft-gray);">{{ $beds }} Beds, {{ $baths }} Baths, {{ $area }}</p>
                            
                            {{-- Dynamic Agent Info --}}
                            <div class="d-flex align-items-center mt-3">
                                <img 
                                    src="{{ $property->user?->avatar_url }}" 
                                    alt="{{ $property->user?->name }}" 
                                    class="agent-avatar-50 me-2"
                                    
                                >
                                <span class="small" style="color: var(--color-secondary);">{{ $property->user->name ?? 'Admin' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach

            {{-- Fallback: Show a message if no listings are available --}}
            @if ($exclusiveListings->isEmpty())
                <div class="col-12 text-center">
                    <p class="text-muted" style="color: var(--color-soft-gray);">
                        No exclusive listings available at this time. Check back soon!
                    </p>
                </div>
            @endif
        </div>
    </div>
</section>


    {{-- Meet Our Top Agents Section FIX: Agent Avatar size is now 100px in CSS --}}
<section class="container container-max section-padding">
    <h2 class="text-center mb-5" style="color: var(--color-secondary);">{{ page_content('home.agents.heading', 'Meet Our Top Agents') }}</h2>
    <div class="row g-4 justify-content-center">

        <div class="col-lg-4 col-md-6">
            <div class="agent-card">
                {{-- Agent Avatar image changed to Picsum (seed 202) --}}
                <img src="https://picsum.photos/seed/202/100/100" alt="Agent Sarah Chen" class="agent-avatar mb-3">
                <h5 class="mb-1" style="color: var(--color-secondary);">Sarah Chen</h5>
                <p class="small mb-2" style="color: var(--color-soft-gray);">Luxury Waterfront Specialist</p>
                <div class="mb-3" style="color: var(--color-primary);">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> (4.8)
                </div>
                <button class="btn btn-outline-gold btn-sm">Contact</button>
            </div>
        </div>

        <div class="col-lg-4 col-md-6">
            <div class="agent-card">
                {{-- Agent Avatar image changed to Picsum (seed 206) --}}
                <img src="https://picsum.photos/seed/206/100/100" alt="Agent John Rhee" class="agent-avatar mb-3">
                <h5 class="mb-1" style="color: var(--color-secondary);">John Rhee</h5>
                <p class="small mb-2" style="color: var(--color-soft-gray);">High-Rise & Urban Expert</p>
                <div class="mb-3" style="color: var(--color-primary);">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> (5.0)
                </div>
                <button class="btn btn-outline-gold btn-sm">Contact</button>
            </div>
        </div>

        <div class="col-lg-4 col-md-6">
            <div class="agent-card">
                {{-- Agent Avatar image changed to Picsum (seed 207) --}}
                <img src="https://picsum.photos/seed/207/100/100" alt="Agent Emily Lee" class="agent-avatar mb-3">
                <h5 class="mb-1" style="color: var(--color-secondary);">Emily Lee</h5>
                <p class="small mb-2" style="color: var(--color-soft-gray);">Exclusive Estates Curator</p>
                <div class="mb-3" style="color: var(--color-primary);">
                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> (4.0)
                </div>
                <button class="btn btn-outline-gold btn-sm">Contact</button>
            </div>
        </div>

    </div>
</section>

    @php
        // Get the very first property from the collection to highlight it
        // Assuming $properties is an Eloquent Collection or similar
        $highlightProperty = $properties->first();
        
    @endphp

@if ($highlightProperty)
    <section class="container container-max section-padding">
        <h2 class="text-center mb-5" style="color: var(--color-secondary);">{{ page_content('home.highlight.heading', 'Highlight Property') }}</h2>
        <div class="row g-5">

            <div class="col-lg-7">
                {{-- Main Image --}}
                <img 
                    id="mainPropertyImage" 
                    src="{{ $highlightProperty->primary_image_url }}" 
                    class="property-teaser-img" 
                    alt="Main image of {{ $highlightProperty->title }}"
                >

                {{-- Thumbnails --}}
                <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start mt-3">
                    @php
                        $gallery = $highlightProperty->getMedia('gallery_images');
                        if ($gallery->isEmpty()) {
                            $gallery = collect([
                                (object)['url' => $highlightProperty->getFirstMediaUrl('featured_image', 'small')]
                            ]);
                        }
                    @endphp

                    @foreach ($gallery as $index => $mediaItem)
                        <img 
                            src="{{ $mediaItem->url ?? $mediaItem }}" 
                            data-src="{{ $mediaItem->url ?? $mediaItem }}" 
                            class="property-thumb-img {{ $index === 0 ? 'active' : '' }}" 
                            alt="{{ $highlightProperty->title }} thumbnail {{ $index + 1 }}"
                        >
                    @endforeach
                </div>
            </div>

            <div class="col-lg-5">
                {{-- Title and Price --}}
                <h3 style="color: var(--color-secondary);">{{ $highlightProperty->title }}</h3>
                <p class="lead mb-3" style="color: var(--color-primary);">{{ $highlightProperty->price_formatted }}</p>

                {{-- Short Description --}}
                <p class="text-muted small mb-4" style="color: var(--color-soft-gray);">
                    {{ $highlightProperty->location->title }}. <br/>
                    {{ $highlightProperty->tagline ?? 'An epitome of luxury and privacy.' }}
                </p>

                {{-- Specs --}}
                <div class="row mb-4">
                    <div class="col-6">
                        <p class="mb-1">
                            <strong><i class="fas fa-bed text-gold me-2"></i> Bedrooms:</strong> 
                            {{ $highlightProperty->number_of_bedrooms ?? '?' }}
                        </p>
                        <p class="mb-1">
                            <strong><i class="fas fa-bath text-gold me-2"></i> Bathrooms:</strong> 
                            {{ $highlightProperty->number_of_bathrooms ?? '?' }}
                        </p>
                    </div>
                    <div class="col-6">
                        <p class="mb-1">
                            <strong><i class="fas fa-ruler-combined text-gold me-2"></i> Size:</strong> 
                            {{ $highlightProperty->area_formatted ?? '?' }}
                        </p>
                        <p class="mb-1">
                            <strong><i class="fas fa-calendar-alt text-gold me-2"></i> Built:</strong> 
                            {{ $highlightProperty->year_built ?? '?' }}
                        </p>
                    </div>
                </div>

                {{-- Full Description --}}
                <p class="small" style="color: var(--color-soft-gray);">{{ $highlightProperty->limited_description }}</p>

                {{-- Action Button --}}
                <a href="{{ route('properties.show', $highlightProperty) ?? '#' }}#contact" class="btn btn-gold-filled mt-3">Schedule a Private Showing</a>
            </div>

        </div>
    </section>
@else
    {{-- Fallback message if no properties are available --}}
    <section class="container container-max section-padding text-center">
        <h2 class="mb-3" style="color: var(--color-secondary);">Highlight Property</h2>
        <p class="text-muted" style="color: var(--color-soft-gray);">No featured property is available at this time.</p>
    </section>
@endif


@endsection

@push('scripts')
<script>
    // Assuming jQuery is loaded in your main frontend.layout file
    $(document).ready(function() {
        $('.property-thumb-img').on('click', function() {
            // Get the data-src attribute (the large image URL)
            var newSrc = $(this).data('src');

            // Set the main image source to the new URL
            $('#mainPropertyImage').attr('src', newSrc);

            // Remove the 'active' class from all thumbnails
            $('.property-thumb-img').removeClass('active');

            // Add the 'active' class to the clicked thumbnail
            $(this).addClass('active');
        });
    });
</script>
@endpush