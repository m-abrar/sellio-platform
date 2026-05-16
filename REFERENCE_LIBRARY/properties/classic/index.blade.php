@extends('frontend._layouts._app')

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;600&display=swap" rel="stylesheet">
@endpush


@section('content')

{{-- Hero Section TODO --}}
<header class="hero-banner d-flex align-items-center mb-5" style="background-image: url('{{ page_content('home.hero.image', 'https://picsum.photos/600/300') }}')">
    <div class="hero-overlay w-100 h-100 d-flex align-items-center justify-content-center">
        <div class="text-center text-white p-3 p-md-5" style="background-color: rgba(255, 255, 255, 0.8); color: var(--color-primary) !important;">
            <h1 class="display-4 mb-3" style="font-family: var(--font-family-heading); color: var(--color-primary);">{{ page_content('home.hero.heading', 'Welcome to Classic Properties') }}</h1>
            <p class="lead mb-4 h4" style="color: var(--color-primary);">{{ page_content('home.hero.paragraph', 'Find listings for your interest') }}</p>
            <a href="{{ page_content('home.hero.link', '#') }}" class="btn btn-lg px-5 text-white" style="background-color: var(--color-primary); border: none;">{{ page_content('home.hero.button', 'View Details') }}</a>
        </div>
    </div>
</header>

{{-- Featured Properties Section --}}
<section class="container py-5">
    <h2 class="text-center mb-5">{{ page_content('home.body.heading', 'Featured Properties') }}</h2>
    <div class="row g-4">

    @foreach($properties as $property)
    <div class="col-md-4">
        <div class="card property-card h-100">
            <div class="position-relative">
                
                {{-- Property Image using Spatie Media Library Conversion --}}
                <div class="position-relative overflow-hidden" style="aspect-ratio: 2/1;">
                        <img src="{{ $property->primary_image_url }}"
                             alt="{{ $property->title }}"
                             class="card-img-topx img-fluid w-100 h-100 object-fit-cover transition-transform"
                             loading="lazy">
                </div>

                {{-- Featured Badge --}}
                @if($property->is_featured)
                    <span class="featured-badge position-absolute top-0 start-0 m-2 badge">Featured</span>
                @endif
                
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ $property->title }}</h5>
                
                {{-- Price and Location --}}
                <p class="card-text mb-1">
                    <strong>{{ $property->price }}</strong> – {{ $property->location->title ?? 'N/A' }}
                </p>
                
                {{-- Limited Description --}}
                <p class="card-text text-muted small mb-3 flex-grow-1">{{ $property->limited_description ?? '' }}</p>

                {{-- PROPERTY DETAILS HERE --}}
                <div class="d-flex justify-content-between align-items-center small text-muted mb-3 pt-2 border-top">
                    <span title="Bedrooms"><i class="fas fa-bed me-1"></i> {{ $property->number_of_bedrooms ?? '-' }}</span>
                    <span title="Bathrooms"><i class="fas fa-bath me-1"></i> {{ $property->number_of_bathrooms ?? '-' }}</span>
                    <span title="Garages"><i class="fas fa-car me-1"></i> {{ $property->number_of_parking_spots ?? '-' }}</span>
                    <span title="Area"><i class="fas fa-ruler-combined me-1"></i> {{ $property->area_formatted ?? '-' }}</span>
                </div>

                {{-- Details Button --}}
                <a href="{{ route('properties.show', $property->slug) }}" 
                   class="btn btn-sm mt-auto" {{-- Added mt-auto to ensure button is at the bottom --}}
                   style="color: var(--color-primary); border: 1px solid var(--color-primary);">
                    Details
                </a>
            </div>
        </div>
    </div>
    @endforeach

    </div>
</section>

{{-- Testimonials Section --}}
<section class="py-5" style="background-color: #fcfbf8;">
    <div class="container">
        <h3 class="mb-4 text-center">{{ page_content('home.testimonials.heading', 'Client Testimonials') }}</h3>
        <div class="row g-4 mb-5">

            {{-- Dynamic Testimonial Loop Placeholder --}}
            @php
                $testimonials = $testimonials ?? [
                    ['quote' => 'Estate Realty turned a daunting task into a delightful journey. Their professionalism and deep market knowledge are unmatched. We found our dream home!', 'client' => 'A. Bennett'],
                    ['quote' => 'The agent provided personalized service and was a fantastic negotiator. Highly recommend for luxury and classic property sales.', 'client' => 'M. Chen'],
                    ['quote' => 'Truly excellent service! They understand the nuances of classic architecture and helped us secure a property with historical significance.', 'client' => 'T. Davis'],
                ];
            @endphp

            @foreach($testimonials as $testimonial)
            <div class="col-md-4">
                <blockquote class="blockquote border-start border-5 ps-3" style="border-color: var(--color-primary) !important;">
                    <p class="mb-0 small fst-italic">"{{ $testimonial['quote'] }}"</p>
                    <footer class="blockquote-footer mt-2">{{ __('Satisfied Client') }}, <cite title="{{ $testimonial['client'] }}">{{ $testimonial['client'] }}</cite></footer>
                </blockquote>
            </div>
            @endforeach

        </div>
    </div>
</section>

@endsection