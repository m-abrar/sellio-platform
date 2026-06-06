@extends('frontend._layouts._app')

@section('title', 'H&R Homes - Buy or Rent Your Perfect Property')

@push('styles')
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

    {{-- Page-specific CSS --}}
    <style>
        :root {
            --bs-sales-blue: #1C3F71; /* Dark Navy/Blue */
            --bs-sales-light-blue: #2A68B2;
            --bs-rental-green: #377E6F; /* Dark Teal/Green */
            --bs-rental-light-green: #48A796;
            --bs-font-inter: 'Inter', sans-serif;
            
            /* Overriding layout defaults */
            --font-body: var(--bs-font-inter);
            --font-heading: var(--bs-font-inter);
            --light-color: #f4f7fa; /* Custom background color */
        }
    </style>
@endpush

@section('content')
    <div class="container-xl py-3 hero-search-bar">
        <div class="row g-2 align-items-center bg-white p-3 rounded shadow-sm">
            <div class="col-auto">
                <div class="btn-group search-toggle-group" role="group">
                    <input type="radio" class="btn-check" name="mode" id="buy-mode" autocomplete="off" checked>
                    <label class="btn btn-outline-primary" for="buy-mode">BUY</label>
                    <input type="radio" class="btn-check" name="mode" id="rent-mode" autocomplete="off">
                    <label class="btn btn-outline-success" for="rent-mode">RENT</label>
                </div>
            </div>
            <div class="col-lg-3 col-12">
                <input type="text" class="form-control" placeholder="Location (e.g., Miami, NYC)">
            </div>
            <div class="col-lg-2 col-md-4 col-sm-6 col-6">
                <select class="form-select">
                    <option selected>Price Range</option>
                    <option>$100K - $500K</option>
                    <option>$500K - $1M</option>
                </select>
            </div>
            <div class="col-lg-2 col-md-4 col-sm-6 col-6">
                <select class="form-select">
                    <option selected>Property Type</option>
                    <option>House</option>
                    <option>Condo</option>
                    <option>Apartment</option>
                </select>
            </div>
            <div class="col-lg-2 col-md-4 col-12">
                <button class="btn btn-primary w-100" type="button"><i class="bi bi-search"></i> Search</button>
            </div>
        </div>
    </div>

    <div class="container-xl mb-5">
        <div class="row g-0 hero-split shadow-lg">
            <div class="col-lg-6 hero-left">
                <h1>{!! page_content('home.hero_1.heading', 'Buy Your Dream Home') !!}</h1>
                <p class="lead">{!! page_content('home.hero_1.heading', 'From starter homes to luxury estates, find your perfect match.') !!}</p>
                <a href="{!! page_content('home.hero_1.heading', '#') !!}" class="btn btn-lg btn-light mt-3">{!! page_content('home.hero_1.heading', 'Browse Sales') !!}</a>
            </div>
            <div class="col-lg-6 hero-right">
                <h1>{!! page_content('home.hero_2.heading', 'Find the Perfect Rental') !!}</h1>
                <p class="lead">{!! page_content('home.hero_2.heading', 'Short-term leases, apartments, and vacation homes for every lifestyle.') !!}</p>
                <a href="{!! page_content('home.hero_2.heading', '#') !!}" class="btn btn-lg btn-light mt-3">{!! page_content('home.hero_2.heading', 'Browse Rentals') !!}</a>
            </div>
        </div>
    </div>

    <div class="container-xl py-5">
        
        <h2 class="text-center mb-4" style="color: var(--bs-sales-blue);">{!! page_content('home.featured_sales.heading', 'Featured Sales Properties') !!}</h2>
        <div class="row g-4 mb-5">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-sales h-100">
                    <img src="https://picsum.photos/seed/sale1/400/250" class="card-img-top" alt="Luxury Villa">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-sales">Luxury Villa</h5>
                        <p class="card-text fw-bold">$2.8M</p>
                        <p class="card-text text-muted small">5 Bed, 4 Bath – Miami</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-sales h-100">
                    <img src="https://picsum.photos/seed/sale2/400/250" class="card-img-top" alt="Modern Condo">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-sales">Modern Condo</h5>
                        <p class="card-text fw-bold">$1.2M</p>
                        <p class="card-text text-muted small">3 Bed, 2 Bath – NYC</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-sales h-100">
                    <img src="https://picsum.photos/seed/sale3/400/250" class="card-img-top" alt="Suburban House">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-sales">Suburban House</h5>
                        <p class="card-text fw-bold">$750K</p>
                        <p class="card-text text-muted small">4 Bed, 3 Bath – Dallas</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-sales h-100">
                    <img src="https://picsum.photos/seed/sale4/400/250" class="card-img-top" alt="Farmhouse">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-sales">Country Farmhouse</h5>
                        <p class="card-text fw-bold">$620K</p>
                        <p class="card-text text-muted small">3 Bed, 2 Bath – Austin</p>
                    </div>
                </div>
            </div>
        </div>
        
        <h2 class="text-center mb-4" style="color: var(--bs-rental-green);">{!! page_content('home.featured_rental.heading', 'Featured Rental Properties') !!}</h2>
        <div class="row g-4 mb-5">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-rental h-100">
                    <img src="https://picsum.photos/seed/rent1/400/250" class="card-img-top" alt="Downtown Loft">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-rental">Downtown Loft</h5>
                        <p class="card-text fw-bold">$1,800/month</p>
                        <p class="card-text text-muted small">2 Bed, 2 Bath</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-rental h-100">
                    <img src="https://picsum.photos/seed/rent2/400/250" class="card-img-top" alt="Vacation Cottage">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-rental">Vacation Cottage</h5>
                        <p class="card-text fw-bold">$220/night</p>
                        <p class="card-text text-muted small">3 Bed, 2 Bath</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-rental h-100">
                    <img src="https://picsum.photos/seed/rent3/400/250" class="card-img-top" alt="Student Apartment">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-rental">Student Apartment</h5>
                        <p class="card-text fw-bold">$950/month</p>
                        <p class="card-text text-muted small">1 Bed, 1 Bath</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="card property-card card-rental h-100">
                    <img src="https://picsum.photos/seed/rent4/400/250" class="card-img-top" alt="Family Townhouse">
                    <div class="card-body text-center">
                        <h5 class="card-title card-title-rental">Family Townhouse</h5>
                        <p class="card-text fw-bold">$3,200/month</p>
                        <p class="card-text text-muted small">4 Bed, 3 Bath</p>
                    </div>
                </div>
            </div>
        </div>
        
        <h3 class="text-center mb-4 pt-4 text-secondary">{!! page_content('home.information.heading', 'Sales vs. Rentals - Key Differences') !!}</h3>
        <div class="row justify-content-center mb-5">
            <div class="col-lg-8">
                <div class="table-responsive">
                    {!! page_content('home.information.body', '
                    <table class="table table-bordered table-hover text-center bg-white shadow-sm rounded">
                        <thead class="table-light">
                            <tr>
                                <th>Feature</th>
                                <th style="color: var(--bs-sales-blue);">Sales (Buying)</th>
                                <th style="color: var(--bs-rental-green);">Rentals (Leasing)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ownership</td>
                                <td class="fw-bold">Full</td>
                                <td>Temporary (Lease)</td>
                            </tr>
                            <tr>
                                <td>Investment</td>
                                <td class="fw-bold">High Potential</td>
                                <td>None (Expense)</td>
                            </tr>
                            <tr>
                                <td>Flexibility</td>
                                <td>Low (High commitment)</td>
                                <td class="fw-bold">High (Short-term leases)</td>
                            </tr>
                            <tr>
                                <td>Initial Cost</td>
                                <td>High (Down Payment, Fees)</td>
                                <td class="fw-bold">Low (Security Deposit, First Month)</td>
                            </tr>
                        </tbody>
                    </table>
                    ') !!}
                </div>
            </div>
        </div>
        
        <h3 class="text-center mb-5 pt-4 text-secondary">What Our Clients Say</h3>
        <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                
                <div class="carousel-item active">
                    <div class="row justify-content-center">
                        <div class="col-lg-5 mb-3">
                            <div class="p-4 testimonial-sales text-center shadow">
                                <p class="fst-italic lead">"The H&R team helped us navigate a complex market and close on our dream home! Exceptional service."</p>
                                <p class="mb-0 fw-bold">- Sarah K. (Buyer)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="carousel-item">
                    <div class="row justify-content-center">
                        <div class="col-lg-5 mb-3">
                            <div class="p-4 testimonial-rental text-center shadow">
                                <p class="fst-italic lead">"Found the perfect apartment in downtown in just 3 days! Quick, easy, and professional rental experience."</p>
                                <p class="mb-0 fw-bold">- Alex D. (Renter)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="carousel-item">
                    <div class="row justify-content-center">
                        <div class="col-lg-5 mb-3">
                            <div class="p-4 testimonial-sales text-center shadow">
                                <p class="fst-italic lead">"Selling our previous home and buying a new one was seamless thanks to the dedicated agents."</p>
                                <p class="mb-0 fw-bold">- David M. (Seller & Buyer)</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
@endsection