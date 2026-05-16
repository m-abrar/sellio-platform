@extends('frontend._layouts._app')

@section('title', 'Luxury Real Estate Marketplace')

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet">

<style>
    /* LUXURY THEME VARIABLES */
    :root {
        --primary-color: #C59A45;
        /* Gold */
        --gold: #C59A45;
        --charcoal: #222222;
        --muted: #f5f5f5;
        /* Overwrite layout defaults */
        --secondary-color: var(--charcoal);
        --light-color: #ffffff;
        --dark-color: var(--charcoal);
        --font-heading: 'Playfair Display', serif;
        --font-body: 'Inter', sans-serif;
        --border-radius: 8px;
        --max-width: 1300px;
    }
</style>
@endpush

@push('styles')
<style>
    /* PAGE-SPECIFIC STYLES (The ones you already had) */
    /* ... (Your hero-carousel, featured-row, listing-card, agent-card, teaser-img styles here) ... */

    /* Hero */
    .hero-carousel .carousel-item {
        height: 68vh;
        min-height: 420px;
        position: relative;
        background-size: cover;
        background-position: center;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.18) 10%, rgba(0, 0, 0, 0.45) 70%);
    }

    .hero-caption {
        position: absolute;
        left: 3rem;
        bottom: 3rem;
        z-index: 3;
        color: #fff;
        max-width: 55%;
        text-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    }

    .hero-caption h1 {
        font-family: var(--font-heading), sans-serif;
        font-size: 2.1rem;
        line-height: 1.05;
        margin-bottom: .5rem;
    }

    .hero-caption p {
        margin-bottom: .75rem;
        color: rgba(255, 255, 255, 0.9);
    }


    /* Featured collection */
    .featured-row .card {
        overflow: hidden;
        border: 0;
        border-radius: var(--border-radius);
    }

    .featured-row .card img {
        display: block;
        width: 100%;
        height: 230px;
        object-fit: cover;
        transition: transform .35s ease;
    }

    .featured-row .card:hover img {
        transform: scale(1.03);
    }

    /* Listings grid */
    .listing-card {
        border: 0;
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: transform .25s ease, box-shadow .25s ease;
        background: #fff;
    }

    .listing-card .card-img-top {
        height: 200px;
        object-fit: cover;
        transition: transform .35s ease;
    }

    .listing-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    }

    .listing-card:hover .card-img-top {
        transform: scale(1.04);
    }

    .price-badge {
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: .35rem .6rem;
        border-radius: 6px;
        font-weight: 600;
        font-size: .9rem;
    }

    .ribbon-featured {
        position: absolute;
        left: 0;
        top: 12px;
        background: var(--primary-color);
        color: #fff;
        padding: .25rem .6rem;
        font-size: .8rem;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        font-weight: 600;
        z-index: 4;
    }

    /* Agent Spotlight */
    .agent-card {
        border-radius: var(--border-radius);
        border: 1px solid rgba(0, 0, 0, 0.04);
        padding: 1rem;
        transition: box-shadow .25s ease;
        background: #fff;
    }

    .agent-card:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    /* Property teaser (used in Teaser section) */
    .teaser-img {
        width: 100%;
        height: 360px;
        object-fit: cover;
        border-radius: var(--border-radius);
    }
</style>
@endpush


@section('content')
{{-- Assume $properties and $agents are passed to the view --}}

{{--
    |--------------------------------------------------------------------------
    | HERO CAROUSEL SECTION
    |--------------------------------------------------------------------------
    --}}
@php
// Get the top 3 properties marked as featured for the carousel
$heroProperties = $properties->take(3);
@endphp

@if ($heroProperties->isNotEmpty())
<section class="hero-carousel">
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000" aria-label="Featured properties carousel">
        <div class="carousel-inner">
            @foreach ($heroProperties as $index => $property)
            <div
                class="carousel-item {{ $index === 0 ? 'active' : '' }}"
                style="background-image: url('{{ $property->getFirstMediaUrl('featured_image', 'high_res') ?: 'https://picsum.photos/1600/700?text=Hero+Slide' }}');">
                <div class="hero-overlay"></div>
                <div class="hero-caption">
                    <h1>{{ $property->title }} — {{ '$' . number_format($property->sale_price ?? $property->base_price, 0) }}</h1>
                    <p>
                        {{ $property->bedrooms }} Bed • {{ $property->bathrooms }} Bath
                        @if($property->area) • {{ number_format($property->area) }} sqft @endif
                    </p>
                    <div class="d-flex gap-2">
                        <a class="btn btn-gold btn-lg" href="{{ route('properties.show', $property) }}" role="button">View Details</a>
                        <a class="btn btn-outline-gold btn-lg" href="{{ route('properties.show', $property) }}#contact" role="button">Schedule Tour</a>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" aria-label="Previous slide">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" aria-label="Next slide">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
    </div>
</section>
@endif

{{--
    |--------------------------------------------------------------------------
    | FEATURED COLLECTION (First 3 Featured)
    |--------------------------------------------------------------------------
    --}}
@php
$featuredCollection = $properties->where('is_featured', true)->take(3);
@endphp

<section id="featured" class="container container-max py-5">
    <h2 class="mb-4">Featured Collection</h2>
    <div class="row g-4 featured-row">
        @forelse ($featuredCollection as $property)
        <div class="col-lg-4 col-md-6">
            <div class="card">
                <div class="position-relative">
                    <img
                        src="{{ $property->getFirstMediaUrl('featured_image', 'medium') ?: 'https://picsum.photos/1200/800?text=Featured+Property' }}"
                        class="card-img-top"
                        alt="{{ $property->title }}">
                    @if ($property->is_featured)
                    <span class="ribbon-featured">Exclusive</span>
                    @endif
                </div>
                <div class="card-body">
                    <h5 class="card-title">{{ $property->title }}</h5>
                    <p class="text-muted mb-2">{{ $property->city }} • {{ $property->bedrooms }} Bed • {{ $property->bathrooms }} Bath</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price-badge">{{ '$' . number_format($property->sale_price ?? $property->base_price, 0) }}</span>
                        <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-sm btn-outline-secondary" style="border-color: rgba(0,0,0,0.06);">View Details</a>
                    </div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-12">
            <p class="text-center text-muted">No featured properties available.</p>
        </div>
        @endforelse
    </div>
</section>

{{--
    |--------------------------------------------------------------------------
    | LISTINGS GALLERY (All other properties)
    |--------------------------------------------------------------------------
    --}}
<section id="listings" class="container container-max py-5">
    <div class="d-flex justify-content-between align-items-end mb-3">
        <h2 class="mb-0">Browse Luxury Listings</h2>
        <small class="text-muted">Showing {{ $properties->count() }} curated properties</small>
    </div>

    <div class="row g-4">
        @forelse ($properties as $property)
        <div class="col-lg-4 col-md-6">
            <article class="card listing-card">
                <div class="position-relative">
                    <img
                        src="{{ $property->primary_image_url }}"
                        class="card-img-top"
                        alt="{{ $property->title }}">
                    @if ($property->is_featured)
                    <span class="ribbon-featured">Featured</span>
                    @endif
                    <div class="position-absolute top-0 end-0 m-3">
                        {{-- Wishlist Button (Static for Demo) --}}
                        <button class="btn btn-sm btn-light" aria-label="Favorite">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21s-8-6.59-8-11a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.41-8 11-8 11z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">{{ $property->title }}</h5>
                    <p class="text-muted small mb-2">
                        {{ $property->city }} • {{ $property->bedrooms }} Bed • {{ $property->bathrooms }} Bath
                        @if($property->area) • {{ number_format($property->area) }} sqft @endif
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-semibold">{{ '$' . number_format($property->sale_price ?? $property->base_price, 0) }}</span>
                        <div>
                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-sm btn-outline-secondary">Quick View</a>
                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-sm btn-gold ms-2">Contact Agent</a>
                        </div>
                    </div>
                </div>
            </article>
        </div>
        @empty
        <div class="col-12">
            <p class="text-center text-muted">We have no listings at the moment. Please check back soon!</p>
        </div>
        @endforelse
    </div>
</section>

{{--
    |--------------------------------------------------------------------------
    | AGENT SPOTLIGHT
    |--------------------------------------------------------------------------
    --}}
<section id="agents" class="container container-max py-5">
    <section id="agents" class="p-5 bg-light">
        <div class="container container-max py-5">
            <div class="text-center mb-5">
                <h2 class="fw-bold">Meet Our Agents</h2>
                <p class="text-muted">Our experts in urban living are here to help you.</p>
            </div>
            <div class="row g-3">
                {{-- Agent Card Loop, limited to 3 agents --}}
                @forelse ($agents->take(3) as $agent)
                <div class="col-md-4">
                    <div class="agent-card d-flex align-items-center gap-3">
                        <img
                            src="{{ $agent->getFirstMediaUrl('featured_image', 'small') ?: 'https://picsum.photos/64?text=Agent' }}"
                            alt="{{ $agent->name }}"
                            class="rounded-circle"
                            width="64"
                            height="64">
                        <div>
                            <h6 class="mb-0">{{ $agent->name }}</h6>
                            <small class="text-muted">
                                {{ $agent->specialty ?? 'Real Estate Agent' }}
                                •
                                {{ number_format($agent->rating('property'), 1) ?? 'N/A' }} ★
                            </small>
                            <div class="mt-2">
                                {{-- Link to Agent Profile (using $agent->username for route parameter) --}}
                                <a href="{{ route('partner.profile', $agent->username) }}" class="btn btn-sm btn-outline-secondary">View Profile</a>
                                {{-- Link for Contact (re-using the same profile route for now) --}}
                                <a href="{{ route('partner.profile', $agent->username) }}" class="btn btn-sm btn-gold ms-2">Contact</a>
                            </div>
                        </div>
                    </div>
                </div>
                @empty
                <div class="col-12">
                    <p class="text-center text-muted">Agent information is currently unavailable.</p>
                </div>
                @endforelse
            </div>
        </div>
    </section>
</section>

{{--
    |--------------------------------------------------------------------------
    | SINGLE PROPERTY TEASER (The original "Highlight Property" concept, using the 4th property)
    |--------------------------------------------------------------------------
    --}}
@php
// Use the 4th property as the teaser
$featured = $properties->where('is_featured', true);

$teaserProperty = $featured->isNotEmpty()
? $featured->random()
: $properties->first();
@endphp

@if ($teaserProperty)
<section id="teaser" class="container container-max py-5">
    <div class="row gy-4 align-items-center">
        <div class="col-lg-7">
            {{-- Main Teaser Image --}}
            <img
                src="{{ $teaserProperty->primary_image_url }}"
                alt="{{ $teaserProperty->title }}"
                class="teaser-img">

            {{-- Teaser Thumbnails (Static for demo, but typically would be a gallery loop) --}}
            <div class="d-flex gap-2 mt-2">
                @php
                $teaserGallery = $teaserProperty->getMedia('images')->take(3);
                @endphp
                @foreach ($teaserGallery as $mediaItem)
                <img
                    src="{{ $mediaItem->thumbnail_image_url }}"
                    width="90"
                    height="60"
                    style="object-fit:cover;border-radius:6px;"
                    alt="{{ $teaserProperty->title }} thumb">
                @endforeach
            </div>
        </div>

        <div class="col-lg-5">
            <h3>{{ $teaserProperty->title }} — {{ '$' . number_format($teaserProperty->sale_price ?? $teaserProperty->base_price, 0) }}</h3>
            <p class="text-muted">
                {{ $teaserProperty->bedrooms }} Bed • {{ $teaserProperty->bathrooms }} Bath • {{ number_format($teaserProperty->area) }} sqft
                @if ($teaserProperty->garages) • {{ $teaserProperty->garages }} Car Garage @endif
            </p>

            <ul class="list-unstyled">
                <li class="mb-2"><strong>Location:</strong> {{ $teaserProperty->location->title ?? '' }}</li>
                <li class="mb-2"><strong>Description:</strong> {{ Str::limit($teaserProperty->description, 120) }}</li>
                <li class="mb-2">
                    <strong>Agent:</strong>
                    {{-- This assumes $teaserProperty->host holds the agent model or a related relationship--}}
                    @if ($teaserProperty->host)
                    {{ $teaserProperty->host->name }} — <a href="{{ route('profile.show', $teaserProperty->host->username) }}" class="link-primary">View Profile</a>
                    @else
                    Contact Us
                    @endif
                </li>
            </ul>

            <div class="d-flex gap-2 mt-3">
                <a href="{{ route('properties.show', $teaserProperty->slug) }}" class="btn btn-gold btn-lg">Request Full Brochure</a>
                <a href="{{ route('properties.show', $teaserProperty->slug) }}" class="btn btn-outline-secondary btn-lg">Schedule Private Tour</a>
            </div>
        </div>
    </div>
</section>
@endif

@endsection


@push('scripts')
<script>
    // Simple search toggle behavior (copied from original HTML)
    (function() {
        const button = document.getElementById('searchToggle');
        if (button) {
            button.addEventListener('click', function() {
                const q = prompt('Search properties (demo):');
                if (q && q.trim()) {
                    alert('You searched for: ' + q);
                }
            });
        }
    })();
</script>
@endpush