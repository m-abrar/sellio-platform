@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
    /* Primary Brand Colors (Red Palette) */
    --bs-primary: #D62828;       /* Modern Red */
    --bs-secondary: #A31515;     /* Dark Crimson */
    --bs-accent: #FCBF49;        /* Bright Gold for alerts/promotions */
    --bs-text-dark: #1F2937;     /* Dark Gray text */
    --bs-bg-light: #F7F8FA;      /* Very subtle off-white background */
    --bs-bg-content: #ffffff;
    
    /* Spacing, Radius, Shadows */
    --bs-border-radius: 0.5rem; 
    --bs-card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); 
    --bs-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 

    /* Unique Banner/Icon Colors */
    --banner-green: #37C09E;
    --banner-blue: #3A83F1;
    --banner-purple: #9066CC;
    --banner-orange: #FF8700;
    --banner-coral: #FA6B59;
    --banner-gray: #6C757D;
    --banner-teal: #00ADB5;
}
</style>
@endpush

@section('content')


    

    <section class="hero-banner-section mb-5">
        <div class="row g-0">
            <div class="col-lg-8">
                <div class="p-5 hero-image-col" style="background-image: url('{{ page_content('home.hero.image', 'https://picsum.photos/1000/600?random=101') }}');">
                    <div class="hero-overlay"></div>
                    <div class="hero-text text-white">
                        <span class="badge bg-primary mb-3 fw-bold p-2 text-white">{{ page_content('home.hero.badge', 'FEATURED') }}</span>
                        <h2 class="display-5 fw-bold mb-2">{{ page_content('home.hero.heading', 'Exclusive Luxury Real Estate') }}</h2>
                        <p class="lead fw-light mb-4">{{ page_content('home.hero.subheading', 'Prime properties are now available for discerning buyers. Don\'t miss out on this limited opportunity.') }}</p>
                        <a href="{{ page_content('home.hero.link', '#') }}" class="btn btn-warning fw-bold text-dark btn-lg shadow">{{ page_content('home.hero.button', 'VIEW LISTINGS') }} <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 d-none d-lg-block">
                <div class="p-4 h-100 bg-accent text-dark d-flex flex-column justify-content-center align-items-center text-center">
                    <p class="text-uppercase fw-bold mb-1" style="color: var(--bs-primary);">{{ page_content('home.hero2.intro', 'Limited Time Offer') }}</p>
                    <h3 class="display-6 fw-bold mb-3">{{ page_content('home.hero2.heading', '50% Off Commission') }}</h3>
                    <div class="promo-discount mb-4">
                        <span id="expiry-date"
                            data-expiry="{{ page_content('home.hero2.expiry', date('Y-m-d', strtotime('+5 days')) ) }}"
                            class="display-3 fw-bolder"
                            style="color: var(--bs-primary);">
                        </span>
                        <p class="small opacity-75">days : hours : minutes : seconds</p>
                    </div>
                    <p class="fw-medium mb-4">{{ page_content('home.hero2.promo', 'Use code: **SPRING50** to claim your discount.') }}</p>
                    <a href="{{ page_content('home.hero2.link', '#') }}" class="btn btn-on-accent w-75 fw-bold">{{ page_content('home.hero2.button', 'POST FREE LISTING') }}</a>
                </div>
            </div>
        </div>
    </section>


    


    
        
        <main class="container-xl my-5">

            <section class="mb-5">
                <div class="d-flex flex-nowrap justify-content-between services-row pb-3" style="overflow-x: auto;">
                    
                    <div class="text-center mx-2 flex-shrink-0 service-1" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-cash-coin service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Best Rate Guarantee</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-2" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-search service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Advanced Search</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-3" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-people service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Dedicated Agent</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-4" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-house service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">New Listings Daily</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-5" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-award service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Certified Dealers</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-6" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-chat-dots service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">24/7 Support</p>
                        </div>
                    </div>
                    
                    <div class="text-center mx-2 flex-shrink-0 service-7" style="width: calc(100% / 7 - 1rem);">
                        <div class="service-grid-card">
                            <div class="icon-wrapper mx-auto"><i class="bi bi-graph-up-arrow service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Market Analytics</p>
                        </div>
                    </div>
                    
                </div>
            </section>

            <section class="mb-5">
                <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
                    
                    <div class="col">
                        <div class="rounded-4 overflow-hidden shadow-sm category-banner-card" style="background-color: var(--banner-green);">
                            <div class="p-3 text-white text-center" style="height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                <p class="small fw-bold mb-1">10%-30% OFF</p>
                                <h5 class="fw-bolder">LONG WEEKEND DEAL</h5>
                            </div>
                            <div class="p-3 bg-white text-center">
                                <h6 class="fw-bold mb-1 text-dark">TABLET & ACCESSORIES</h6>
                                <a href="#" class="small text-primary text-decoration-none fw-bold">Shop Now <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                         <div class="rounded-4 overflow-hidden shadow-sm category-banner-card" style="background-color: var(--banner-blue);">
                            <div class="p-3 text-white text-center" style="height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                <p class="small fw-bold mb-1">SALE OFF 50%</p>
                                <h5 class="fw-bolder">BLACK FRIDAY PREVIEW</h5>
                            </div>
                            <div class="p-3 bg-white text-center">
                                <h6 class="fw-bold mb-1 text-dark">ELECTRONIC</h6>
                                <a href="#" class="small text-primary text-decoration-none fw-bold">Shop Now <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="rounded-4 overflow-hidden shadow-sm category-banner-card" style="background-color: var(--banner-purple);">
                            <div class="p-3 text-white text-center" style="height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                <p class="small fw-bold mb-1">30%-50% SAVINGS</p>
                                <h5 class="fw-bolder">SEASON CLEARANCE</h5>
                            </div>
                            <div class="p-3 bg-white text-center">
                                <h6 class="fw-bold mb-1 text-dark">FASHION & ACCESSORIES</h6>
                                <a href="#" class="small text-primary text-decoration-none fw-bold">Shop Now <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                         <div class="rounded-4 overflow-hidden shadow-sm category-banner-card" style="background-color: var(--banner-orange);">
                            <div class="p-3 text-white text-center" style="height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                <p class="small fw-bold mb-1">NEW ARRIVALS</p>
                                <h5 class="fw-bolder">HOME & DECOR</h5>
                            </div>
                            <div class="p-3 bg-white text-center">
                                <h6 class="fw-bold mb-1 text-dark">FURNITURE & DECOR</h6>
                                <a href="#" class="small text-primary text-decoration-none fw-bold">Shop Now <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                         <div class="rounded-4 overflow-hidden shadow-sm category-banner-card" style="background-color: var(--banner-coral);">
                            <div class="p-3 text-white text-center" style="height: 120px; display: flex; flex-direction: column; justify-content: center;">
                                <p class="small fw-bold mb-1">20%-40% OFF</p>
                                <h5 class="fw-bolder">WELLNESS EVENT</h5>
                            </div>
                            <div class="p-3 bg-white text-center">
                                <h6 class="fw-bold mb-1 text-dark">HEALTH & BEAUTY</h6>
                                <a href="#" class="small text-primary text-decoration-none fw-bold">Shop Now <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            <div class="main-content-box">

                <section class="mb-5">
                    <h2 class="mb-4 display-6 fw-bold">{{ page_content('home.featured.heading', 'Top Trending Listings') }}</h2>
                    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                        @foreach($propertiesFeatured->random(1) as $property)
                        <div class="col">
                            <div class="card trending-card h-100">
                                <img src="{{$property->primary_image_url}}" class="card-img-top" alt="Luxury Condo">
                                <div class="card-body d-flex flex-column">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="badge bg-accent text-dark fw-bold">HOT DEAL</span>
                                        <span class="badge bg-primary">Property</span>
                                    </div>
                                    <h5 class="card-title fw-bold fs-6 mb-1">{{ str_limit($property->title, 25) }}</h5>
                                    <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ str_limit($property->address ?? $property?->location?->title ?? '', 40) }}</p>
                                    
                                    <div class="product-meta d-flex justify-content-between mb-3 small">
                                        <span><i class="bi bi-house-door me-1"></i> {{$property->number_of_bedrooms}} Beds</span>
                                        <span><i class="bi bi-rulers me-1"></i> {{$property->area_formatted}}</span>
                                        <span><i class="bi bi-car-fill me-1"></i> {{$property->number_of_parking_spots}} Garages</span>
                                    </div>
                                    <hr class="my-0">
                                    <div class="mt-auto pt-2">
                                        <div class="product-price mb-3">{{$property->price_formatted}}</div>
                                        <a href="{{route('properties.show', $property)}}" class="btn btn-sm btn-outline-primary w-100">Explore Property</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach

                        @foreach($autosLatest->random(1) as $auto)
                        <div class="col">
                            <div class="card trending-card h-100">
                                <img src="{{$auto->primary_image_url}}" class="card-img-top" alt="Electric Scooter">
                                <div class="card-body d-flex flex-column">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="badge bg-secondary text-white fw-bold">NEW LISTING</span>
                                        <span class="badge bg-primary">Auto</span>
                                    </div>
                                    <h5 class="card-title fw-bold fs-6 mb-1">{{$auto->title}}</h5>
                                    <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ $auto->address ?? $auto?->location?->title ?? '' }}</p>
                                    
                                    <div class="product-meta d-flex justify-content-between mb-3 small">
                                        <span><i class="bi bi-speedometer me-1"></i> {{$auto->mileage_formatted}}</span>
                                        <span><i class="bi bi-battery-half me-1"></i> {{$auto->fuel_economy}} range</span>
                                        <span><i class="bi bi-calendar-check me-1"></i> {{$auto->transmission}}</span>
                                    </div>
                                    <hr class="my-0">
                                    <div class="mt-auto pt-2">
                                        <div class="product-price mb-3">{{$auto->price_formatted}}</div>
                                        <a href="{{ route('autos.show', $auto) }}" class="btn btn-sm btn-outline-primary w-100">View Vehicle</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach

                        @foreach($classifiedsFeatured->random(1) as $classified)
                        <div class="col">
                            <div class="card trending-card h-100">
                                <img src="{{$classified->primary_image_url}}" class="card-img-top" alt="Rare Comic Book">
                                <div class="card-body d-flex flex-column">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="badge bg-accent text-dark fw-bold">AUCTION</span>
                                        <span class="badge bg-primary">Classified</span>
                                    </div>
                                    <h5 class="card-title fw-bold fs-6 mb-1">{{$classified->title}}</h5>
                                    <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ $classified->address ?? $classified?->location?->title ?? '' }}</p>
                                    
                                    <div class="product-meta d-flex justify-content-between mb-3 small">
                                        <span><i class="{{ $classified->category?->icon ?? 'fas fa-tag'}} me-1"></i> {{$classified->category?->title}}</span>
                                        <span><i class="{{ $classified->type?->icon ?? 'bi bi-tags'}} me-1"></i> {{$classified->type?->title}}</span>
                                        <span><i class="bi bi-hammer me-1"></i> {{$classified->inquirers->count()}} Bids</span>
                                    </div>
                                    <hr class="my-0">
                                    <div class="mt-auto pt-2">
                                        <div class="product-price mb-3 text-muted" style="font-weight: 600;">{{$classified->price_formatted}}+</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary w-100">Place Bid</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach

                        @foreach($jobsFeatured->random(1) as $job)
                        <div class="col">
                            <div class="card trending-card h-100">
                                <img src="{{ $job->user->company_logo_url }}" class="card-img-top" alt="{{ $job->title }}">
                                <div class="card-body d-flex flex-column">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span class="badge bg-secondary text-white fw-bold">URGENT</span>
                                        <span class="badge bg-primary">Job</span>
                                    </div>
                                    <h5 class="card-title fw-bold fs-6 mb-1">{{ str_limit($job->title,25) }}</h5>
                                    <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ $job->address ?? $job?->location?->title ?? '' }}</p>
                                    
                                    <div class="product-meta d-flex justify-content-between mb-3 small">
                                        <span><i class="bi bi-briefcase me-1"></i> {{ str_limit($job->type?->title,7) }}</span>
                                        <span><i class="bi bi-clock me-1"></i> {{ (int)abs($job->application_deadline->diffInDays(now())) }} Days Left</span>
                                        <span><i class="bi bi-star me-1"></i> {{ str_limit($job->category?->title,7) }}</span>
                                    </div>
                                    <hr class="my-0">
                                    <div class="mt-auto pt-2">
                                        <div class="product-price mb-3 text-success" style="font-weight: 700;">Competitive Salary</div>
                                        <a href="{{ route('jobs.show', $job) }}" class="btn btn-sm btn-primary w-100">Apply Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        @endforeach

                    </div>
                </section>
                
                <section class="mb-5">
                    <div class="bg-secondary rounded-4 shadow p-5 text-white">
                        <div class="row align-items-center">
                            <div class="col-md-9">
                                <h3 class="display-6 fw-bold">{{ page_content('home.cta.heading', 'Want to reach millions? Post a Premium Listing!') }}</h3>
                                <p class="lead mb-0 fw-light">{{ page_content('home.cta.subheading', 'Get a dedicated promotion slot and reach thousands of potential buyers guaranteed.') }}</p>
                            </div>
                            <div class="col-md-3 text-end mt-4 mt-md-0">
                                <a href="{{ page_content('home.cta.link', '#') }}" class="btn btn-lg btn-warning shadow-lg fw-bold text-dark">
                                    {{ page_content('home.cta.button', 'GET STARTED NOW') }} <i class="bi bi-arrow-right ms-2"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="mb-5">
                    
                    <h2 class="mb-4 display-6 fw-bold">{{ page_content('home.properties.heading', 'Latest Property Listings') }}</h2>
                    
                    <ul class="nav nav-tabs border-bottom-0 mb-4" id="propertyTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="sale-tab" data-bs-toggle="tab" data-bs-target="#sale-listings" type="button" role="tab" aria-controls="sale-listings" aria-selected="true">{{ page_content('home.properties.tab_sale', 'Properties For Sale') }}</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="rental-tab" data-bs-toggle="tab" data-bs-target="#rental-listings" type="button" role="tab" aria-controls="rental-listings" aria-selected="false">{{ page_content('home.properties.tab_rental', 'New Rentals') }}</button>
                        </li>
                    </ul>

                    <div class="tab-content" id="propertyTabsContent">
                        
                        <div class="tab-pane fade show active" id="sale-listings" role="tabpanel" aria-labelledby="sale-tab">
                            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                
                            
                            @foreach($propertiesSale->random(4) as $property)
                                <div class="col">
                                    <div class="card trending-card h-100">
                                        <img src="{{$property->primary_image_url}}" class="card-img-top" alt="Luxury Condo">
                                        <div class="card-body d-flex flex-column">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="badge bg-accent text-dark fw-bold">{{ $property?->type?->title }}</span>
                                                <span class="badge bg-primary">{{ $property?->category?->title }}</span>
                                            </div>
                                            <h5 class="card-title fw-bold fs-6 mb-1">{{ str_limit($property->title, 25) }}</h5>
                                            <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ str_limit($property->address ?? $property?->location?->title ?? '', 40) }}</p>
                                            
                                            <div class="product-meta d-flex justify-content-between mb-3 small">
                                                <span><i class="bi bi-house-door me-1"></i> {{$property->number_of_bedrooms}} Beds</span>
                                                <span><i class="bi bi-rulers me-1"></i> {{$property->area_formatted}}</span>
                                                <span><i class="bi bi-car-fill me-1"></i> {{$property->number_of_parking_spots}} Garages</span>
                                            </div>
                                            <hr class="my-0">
                                            <div class="mt-auto pt-2">
                                                <div class="product-price mb-3">{{$property->price_formatted}}</div>
                                                <a href="{{route('properties.show', $property)}}" class="btn btn-sm btn-outline-primary w-100">Explore Property</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                            
                            
                            
                            
                            </div>
                        </div>

                        <div class="tab-pane fade" id="rental-listings" role="tabpanel" aria-labelledby="rental-tab">
                            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                                
                            @foreach($propertiesRental->random(4) as $property)
                                <div class="col">
                                    <div class="card trending-card h-100">
                                        <img src="{{$property->primary_image_url}}" class="card-img-top" alt="Luxury Condo">
                                        <div class="card-body d-flex flex-column">
                                            <div class="d-flex justify-content-between mb-2">
                                                <span class="badge bg-accent text-dark fw-bold">{{ $property?->type?->title }}</span>
                                                <span class="badge bg-primary">{{ $property?->category?->title }}</span>
                                            </div>
                                            <h5 class="card-title fw-bold fs-6 mb-1">{{ str_limit($property->title, 25) }}</h5>
                                            <p class="small text-muted mb-3"><i class="bi bi-geo-alt"></i> {{ str_limit($property->address ?? $property?->location?->title ?? '', 40) }}</p>
                                            
                                            <div class="product-meta d-flex justify-content-between mb-3 small">
                                                <span><i class="bi bi-house-door me-1"></i> {{$property->number_of_bedrooms}} Beds</span>
                                                <span><i class="bi bi-rulers me-1"></i> {{$property->area_formatted}}</span>
                                                <span><i class="bi bi-car-fill me-1"></i> {{$property->number_of_parking_spots}} Garages</span>
                                            </div>
                                            <hr class="my-0">
                                            <div class="mt-auto pt-2">
                                                <div class="product-price mb-3">{{$property->price_formatted}}</div>
                                                <a href="{{route('properties.show', $property)}}" class="btn btn-sm btn-outline-primary w-100">Explore Property</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                            
                            
                                
                            </div>
                        </div>
                    </div>
                </section>

            </div>





        </main>
    



 

@endsection



@push('scripts')

    <script>
    document.addEventListener("DOMContentLoaded", function () {

        const expiryEl = document.getElementById("expiry-date");
        const expiryDate = expiryEl.dataset.expiry;
        const targetTime = new Date(expiryDate + " 23:59:59").getTime();

        function pad(num) {
            return num < 10 ? "0" + num : num;
        }

        function updateCountdown() {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                expiryEl.textContent = "Expired";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let parts = [];

            if (days > 0) parts.push(pad(days));
            if (hours > 0 || days > 0) parts.push(pad(hours));

            parts.push(pad(minutes));
            parts.push(pad(seconds));

            expiryEl.textContent = parts.join(":");
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
    </script>



    <script>
        document.getElementById('modeToggle').addEventListener('click', function() {
            const body = document.body;
            const icon = this.querySelector('i');

            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                icon.classList.remove('bi-sun');
                icon.classList.add('bi-moon-fill'); 
                this.classList.remove('text-dark');
                this.classList.add('text-white');
            } else {
                icon.classList.remove('bi-moon-fill');
                icon.classList.add('bi-sun');
                this.classList.remove('text-white');
                this.classList.add('text-dark');
            }
        });
    </script>
@endpush