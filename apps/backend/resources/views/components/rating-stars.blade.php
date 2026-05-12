{{-- 
    resources/views/components/rating-stars.blade.php 
    
    Assumes $rating variable is passed, e.g., @include('components.rating-stars', ['rating' => 4.3])
--}}
@php
    // Ensure the rating is numeric, default to 0
    $rating = (float) $rating;
    
    // Calculate the number of full stars (floor)
    $fullStars = floor($rating);
    
    // Determine if there is a half star (0.25 to 0.75 is often considered a half star)
    $decimal = $rating - $fullStars;
    $hasHalfStar = $decimal >= 0.25 && $decimal <= 0.75;
    
    // Calculate the number of empty stars (5 - full - (half ? 1 : 0))
    $emptyStars = 5 - $fullStars - ($hasHalfStar ? 1 : 0);
@endphp

<span class="d-inline-block text-warning" aria-label="{{ __('Rating: :rating out of 5 stars', ['rating' => number_format($rating, 1)]) }}">
    {{-- Render Full Stars --}}
    @for ($i = 0; $i < $fullStars; $i++)
        <i class="bi bi-star-fill"></i>
    @endfor
    
    {{-- Render Half Star --}}
    @if ($hasHalfStar)
        <i class="bi bi-star-half"></i>
    @endif
    
    {{-- Render Empty Stars --}}
    @for ($i = 0; $i < $emptyStars; $i++)
        <i class="bi bi-star"></i>
    @endfor
</span>
