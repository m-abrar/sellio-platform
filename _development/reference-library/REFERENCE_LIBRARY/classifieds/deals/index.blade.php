@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">
<style>
:root {
    --primary-red: #E71D36; /* Bright Red */
    --secondary-yellow: #FFC300; /* Bright Yellow/Amber */
    --light-bg: #FFFFFF;
    --dark-text: #212529;
    --countdown-bg: #000000;
}
</style>
@endpush

@section('content')
<main class="container my-5">
    <div class="row">
        
        <div class="col-lg-8">

            
            <section class="mb-5">
                <div id="trendingCarousel" class="carousel slide rounded-3" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        @php
                            // 1. DYNAMIC LIMIT: Fetch the desired number of slides
                            $limit = (int) page_content('home.hero.number_of_slides', 3); // Fallback to 3
                            $renderedCount = 0; // Initialize a counter for *rendered* items
                            $heroSlideIds = [];
                        @endphp 
                        
                        @foreach($classifieds as $classified)
                            @php
                                // STOP LOOP: Check if we have already rendered the maximum number of slides
                                if ($renderedCount >= $limit) {
                                    break;
                                }
                                
                                // 1. Check if sale is active
                                $saleEnds = optional($classified->sale_ends_at)->isFuture();

                                // 2. Determine if this is the first item in the loop for the 'active' class
                                // This should check the *rendered* count, not the loop's iteration count
                                $isActive = ($renderedCount === 0) ? ' active' : '';
                            @endphp
                            
                            {{-- Only render items that are currently on sale --}}
                            @if($classified->discount_percentage > 0 && $saleEnds)

                                {{-- 3. INCREMENT THE RENDERED COUNT HERE --}}
                                @php
                                    $renderedCount++;
                                    $heroSlideIds[] = $classified->id;
                                @endphp
                                
                                {{-- Conditionally add the ' active' class --}}
                                <div class="carousel-item{{ $isActive }} carousel-item-custom p-4">
                                    {{-- Wrap the entire content in the detail link --}}
                                    <a href="{{ route('classifieds.show', $classified->slug) }}" class="text-decoration-none text-reset d-block">
                                        
                                        <div class="discount-badge">{{ $classified->discount_percentage }}% OFF</div>
                                        
                                        <div class="row align-items-center">
                                            <div class="col-4 text-center">
                                                <img src="{{$classified->primary_image_url}}" class="img-fluid" alt="{{ $classified->title }}">
                                            </div>
                                            <div class="col-8">
                                                <h1 class="text-dark fw-bold mb-1">{{ $classified->title }}</h1>
                                                <p class="lead text-dark">{{ $classified->short_description }}</p>
                                                <div class="d-flex align-items-center">
                                                    <p class="mb-0 me-3 text-dark fw-bold">TIME LEFT:</p>
                                                    
                                                    {{-- Dynamic sale_ends_at for the countdown timer --}}
                                                    <span 
                                                        class="countdown-timer" 
                                                        data-endtime="{{ optional($classified->sale_ends_at)->toISOString() }}" 
                                                        id="timer-carousel-{{ $classified->id }}"
                                                    >
                                                        00:00:00
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            @endif
                        @endforeach
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#trendingCarousel" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button>
                    <button class="carousel-control-next" type="button" data-bs-target="#trendingCarousel" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>
                </div>
            </section>
            

            <section class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h3 class="text-dark">LIMITED-TIME DEALS</h3>
                    <div class="d-flex">
                        <button class="btn btn-outline-secondary btn-sm me-2"><i class="fas fa-filter me-1"></i> Filter</button>
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By: Discount
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Price Low to High</a></li>
                                <li><a class="dropdown-item" href="#">Highest Discount</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="row row-cols-2 row-cols-md-3 g-4">
                    <!-- TODO, hide those already shown in the hero slides -->
                    @foreach($classifieds->sortBy(function ($classified) {
                        // 1. Prioritize: Set a high sort value (e.g., 9999999999) if sale_ends_at is NULL (no sale)
                        //    Set a low sort value (e.g., the actual timestamp) if a sale exists.
                        //    Sorting Ascending (sortBy) will put low values (active sales) first.
                        return optional($classified->sale_ends_at)->isFuture() 
                            ? $classified->sale_ends_at->timestamp 
                            : 9999999999; 
                    }) as $classified)
                        @php
                            if (in_array($classified->id, $heroSlideIds)) {
                                continue; // Skip the rest of the loop for this item
                            }
                            // Check if the item has an active, future sale with a discount
                            $isActiveSale = $classified->discount_percentage > 0 && optional($classified->sale_ends_at)->isFuture();
                        @endphp

                        {{-- Show ALL items by placing the main column DIV OUTSIDE the IF statement --}}
                        <div class="col">
                            <div class="card h-100 deal-card position-relative">

                                {{-- CONDITIONAL: Show SALE badge/discount badge --}}
                                @if($isActiveSale)
                                    <span class="sale-badge">SALE!</span>
                                @endif

                                <img src="{{$classified->primary_image_url}}" class="card-img-top p-3" alt="{{$classified->title}}">
                                <div class="card-body p-3 text-center">
                                    <p class="card-text text-muted small mb-1">{{$classified->title}}</p>

                                    {{-- CONDITIONAL: Show original price and discount if on sale --}}
                                    @if($isActiveSale)
                                        <p class="original-price mb-0">${{number_format($classified->base_price,2)}}</p>
                                        <div class="d-flex justify-content-center align-items-center mb-2">
                                            <p class="current-price mb-0 me-2">${{number_format($classified->sale_price,2)}}</p>
                                            <span class="badge bg-warning text-dark fw-bold">{{$classified->discount_percentage}}% OFF</span>
                                        </div>
                                        {{-- If no sale, just show the base price as the current price --}}
                                    @else
                                        <p class="current-price mb-2 text-secondary">{{$classified->price_formatted}}</p>
                                    @endif
                                    
                                    {{-- CONDITIONAL: Show the countdown timer only if there is an active future sale --}}
                                    @if($isActiveSale)
                                        <p class="card-text small mb-0 fw-bold text-danger">Ends in: <span class="fw-bolder" id="timer-deal-{{$classified->id}}" data-endtime="{{ optional($classified->sale_ends_at)->toISOString() }}">00:00:00</span></p>
                                    @else
                                        <p class="card-text small mb-0 text-muted">No active sale.</p>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-outline-danger fw-bold px-5">Load More Deals</button>
                </div>
            </section>

            <section class="mb-5">
                <h3 class="text-dark fw-bold mb-4 border-bottom pb-2">HOT BARGAINS</h3>
                <div class="row row-cols-2 row-cols-md-3 g-4">
                    @php
                        // 1. Filter: Find only active sales (discount > 0 and future end date)
                        $hotBargains = $classifieds->filter(function ($classified) {
                            $isActiveSale = $classified->discount_percentage > 0 && optional($classified->sale_ends_at)->isFuture();
                            return $isActiveSale;
                        });

                        // 2. Sort: Order by the highest discount percentage first
                        // Secondary sort by popularity (views_count) to break ties or add relevance
                        $hotBargains = $hotBargains->sortByDesc(['discount_percentage', 'views_count']);

                        // 3. Limit: Grab only the top 6 (or desired number) to keep the section exclusive
                        $hotBargains = $hotBargains->take(6);
                    @endphp


                    {{-- Loop over the filtered and sorted Hot Bargains --}}
                    @foreach($hotBargains as $classified)
                        @php
                            // Check is not strictly needed here since $hotBargains is pre-filtered, 
                            // but we reuse the $isActiveSale logic for display.
                            $isActiveSale = $classified->discount_percentage > 0 && optional($classified->sale_ends_at)->isFuture();
                        @endphp
                        
                        <div class="col">
                            <div class="card h-100 deal-card position-relative">
                                
                                {{-- All items here are active sales --}}
                                <span class="sale-badge">SALE!</span>
                                <img src="{{$classified->primary_image_url}}" class="card-img-top p-3" alt="{{$classified->title}}">
                                <div class="card-body p-3 text-center">
                                    <p class="card-text text-muted small mb-1">{{$classified->title}}</p>

                                    <p class="original-price mb-0">${{number_format($classified->base_price,2)}}</p>
                                    <div class="d-flex justify-content-center align-items-center mb-2">
                                        <p class="current-price mb-0 me-2">${{number_format($classified->sale_price,2)}}</p>
                                        
                                        {{-- HIGHLIGHT: These are the Hot Bargain badges --}}
                                        <span class="badge bg-danger text-white fw-bold">{{$classified->discount_percentage}}% OFF</span>
                                    </div>
                                    
                                    {{-- Countdown Timer --}}
                                    <p class="card-text small mb-0 fw-bold text-danger">Ends in: <span class="fw-bolder" id="timer-hot-{{$classified->id}}" data-endtime="{{ optional($classified->sale_ends_at)->toISOString() }}">00:00:00</span></p>
                                </div>
                            </div>
                        </div>
                    @endforeach

                    {{-- Add a check for no deals if the collection is empty --}}
                    @if($hotBargains->isEmpty())
                        <div class="col-12 text-center py-5">
                            <p class="lead text-muted">No extreme hot bargains available right now. Check back soon!</p>
                        </div>
                    @endif
                    </div>
            </section>

        </div>

        <div class="col-lg-4">

            <aside class="mb-4 p-3 bg-white border rounded shadow-sm">
                <h4 class="text-dark fw-bold mb-3 border-bottom pb-2">FEATURED SELLERS</h4>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center"><i class="fas fa-user-circle me-3 fs-3 text-secondary"></i><span class="fw-bold">Gadget Guru</span></div>
                        <button class="btn btn-sm btn-outline-danger fw-bold">FOLLOW</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center"><i class="fas fa-store me-3 fs-3 text-secondary"></i><span class="fw-bold">Fashion Finds</span></div>
                        <button class="btn btn-sm btn-outline-danger fw-bold">FOLLOW</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center"><i class="fas fa-home me-3 fs-3 text-secondary"></i><span class="fw-bold">Home Essentials</span></div>
                        <button class="btn btn-sm btn-outline-danger fw-bold">FOLLOW</button>
                    </li>
                </ul>
            </aside>

            <aside class="sticky-top" style="top: 20px;">
                <div class="card bg-danger text-white text-center p-4 shadow-lg">
                    <h5 class="card-title fw-bolder mb-1 fs-3">DAILY FLASH SALE!</h5>
                    <p class="text-warning mb-2">ENDS IN:</p>
                    <p class="lead fw-bolder mb-3 fs-2 bg-dark rounded p-2 d-inline-block mx-auto flash-timer" id="timer-flash" data-endtime="2025-10-10T12:00:00Z">00:00:00</p>
                    <p class="small mb-2">New deals unlock soon!</p>
                    <button class="btn btn-warning text-dark fw-bolder text-uppercase mt-2">Shop Flash Deals <i class="fas fa-arrow-right"></i></button>
                </div>
            </aside>

        </div>
    </div>
</main>
@endsection



@push('scripts')
<script>
    // Custom JavaScript for Live Countdown Timers
    function startCountdown(timerId, endTimeString) {
        const timerElement = document.getElementById(timerId);
        const endTime = new Date(endTimeString).getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(interval);
                timerElement.innerHTML = "EXPIRED";
                
                // Keep the 'SALE OVER' message for the main flash sale timer if it applies
                if (timerId.startsWith('timer-flash')) {
                    timerElement.innerHTML = "SALE OVER";
                }
                return;
            }

            // Calculate time components
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            
            // Hours now only represents the remainder within the last day
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
            
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros
            const format = (t) => t < 10 ? "0" + t : t;

            // --- MODIFIED DISPLAY LOGIC ---
            let timerOutput;
            
            // Check if days should be displayed (days > 0)
            if (days > 0) {
                // If days are present, show days, hours, minutes, and seconds
                timerOutput = `<span class="text-danger fw-bolder me-1">${days}d</span> ${format(hours)}:${format(minutes)}:${format(seconds)}`;
            } else {
                // If days are 0 or less, show only hours, minutes, and seconds
                // This is the desired behavior for countdowns less than 24 hours.
                timerOutput = `${format(hours)}:${format(minutes)}:${format(seconds)}`;
            }

            // For the main flash sale timer, ensure the larger size doesn't look empty if the format changes
            // It might be best to remove the `timerId.startsWith('timer-flash')` exception if you want the cleaner `HH:MM:SS` format when close to expiration, but I'll keep the logic that prevents the timer output from shrinking drastically in the main sidebar component:
             if (timerId.startsWith('timer-flash')) {
                 // For the main sidebar timer, it often looks better to maintain the full structure even if days is '0'
                 timerOutput = `${days}d ${format(hours)}:${format(minutes)}:${format(seconds)}`;
             }


            timerElement.innerHTML = timerOutput;
            // --- END MODIFIED DISPLAY LOGIC ---
        }

        // Call immediately and then every second
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
    }

    // Initialize all timers on the page using the 'data-endtime' attribute
    document.addEventListener('DOMContentLoaded', () => {
        const timers = document.querySelectorAll('[data-endtime]');
        timers.forEach(timer => {
            startCountdown(timer.id, timer.getAttribute('data-endtime'));
        });
    });
</script>
@endpush