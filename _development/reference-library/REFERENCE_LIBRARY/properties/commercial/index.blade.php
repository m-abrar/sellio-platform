@extends('frontend._layouts._app')

@section('title', 'Crest Properties | Commercial Real Estate')


@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root {
    --bs-navy: #0A2540;
    --bs-silver: #E5E7EB;
    --bs-accent: #FF6B35;
    --bs-body-font-family: 'Roboto', sans-serif;
    --bs-heading-font-family: 'Inter', sans-serif;

    /* Map custom variables to layout variables where possible */
    --primary-color: var(--bs-navy);
    --accent-color: var(--bs-accent);
    --font-heading: var(--bs-heading-font-family);
    --font-body: var(--bs-body-font-family);
}
</style>
@endpush

@section('content')

    <section class="hero-banner">
        <div class="hero-overlay"></div>
        <div class="container text-center">
            <div class="hero-search-form">
                <h1 class="text-navy mb-4 fw-bolder">{!! page_content('home.hero.heading', 'Find Your Next Business Space') !!}</h1>
                <form class="row g-3 align-items-end">
                    <div class="col-md-3 col-sm-6">
                        <label for="propertyType" class="form-label visually-hidden">Property Type</label>
                        <select class="form-select form-select-lg" id="propertyType">
                            <option selected>Property Type</option>
                            <option value="1">Office</option>
                            <option value="2">Retail</option>
                            <option value="3">Warehouse</option>
                            <option value="4">Coworking</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <label for="city" class="form-label visually-hidden">City</label>
                        <input type="text" class="form-control form-control-lg" id="city" placeholder="City / Location">
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <label for="budget" class="form-label visually-hidden">Budget Range</label>
                        <select class="form-select form-select-lg" id="budget">
                            <option selected>Budget Range</option>
                            <option value="1">$1K - $5K</option>
                            <option value="2">$5K - $10K</option>
                            <option value="3">$10K+</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-sm-6">
                        <button type="submit" class="btn btn-primary-accent btn-lg w-100 fw-bold">
                            <i class="bi bi-search me-2"></i> {!! page_content('home.hero.form_button', 'Search') !!}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <section class="container py-5">
        <h2 class="text-center mb-5">{!! page_content('home.featured.heading', 'Featured Categories') !!}</h2>
        <div class="row g-4">
            <div class="col-md-4">
                <div class="category-card shadow-sm" style="background: url('https://picsum.photos/600/400?random=2') no-repeat center center/cover;">
                    <div class="category-overlay">
                        <i class="bi bi-building category-icon"></i>
                        <h3 class="h4 text-white">Offices</h3>
                        <p class="text-white-50">Modern corporate suites and high-rise floors.</p>
                        <a href="#" class="btn btn-primary-accent mt-2">Explore</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="category-card shadow-sm" style="background: url('https://picsum.photos/600/400?random=3') no-repeat center center/cover;">
                    <div class="category-overlay">
                        <i class="bi bi-shop category-icon"></i>
                        <h3 class="h4 text-white">Retail Spaces</h3>
                        <p class="text-white-50">High-traffic high-street and mall locations.</p>
                        <a href="#" class="btn btn-primary-accent mt-2">Explore</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="category-card shadow-sm" style="background: url('https://picsum.photos/600/400?random=4') no-repeat center center/cover;">
                    <div class="category-overlay">
                        <i class="bi bi-people category-icon"></i>
                        <h3 class="h4 text-white">Coworking</h3>
                        <p class="text-white-50">Flexible desks and shared business hubs.</p>
                        <a href="#" class="btn btn-primary-accent mt-2">Explore</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <hr>

    <section class="container py-5 bg-light">
        <h2 class="text-center mb-5">{!! page_content('home.listings.header', 'Top Commercial Listings') !!}</h2>
        <div class="row g-4">
            
            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=5" class="card-img-top" alt="Downtown Office Suite">
                    <div class="price-badge">$8,500 / month</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">Downtown Office Suite</h5>
                        <p class="card-text text-muted mb-2">2,000 sqft &bull; New York</p>
                        <p class="card-text small text-truncate">Modern, high-floor office space with stunning city views.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=6" class="card-img-top" alt="Retail Corner Unit">
                    <div class="price-badge">$5,200 / month</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">Retail Corner Unit</h5>
                        <p class="card-text text-muted mb-2">1,200 sqft &bull; Los Angeles</p>
                        <p class="card-text small text-truncate">Prime retail location on a busy corner with great visibility.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=7" class="card-img-top" alt="Coworking Hub">
                    <div class="price-badge">$350 / desk</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">Coworking Hub</h5>
                        <p class="card-text text-muted mb-2">Shared Space &bull; Chicago</p>
                        <p class="card-text small text-truncate">Flexible hot desks and private offices in a vibrant downtown hub.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>

            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=8" class="card-img-top" alt="Tech Park Warehouse">
                    <div class="price-badge">$12,000 / month</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">Tech Park Warehouse</h5>
                        <p class="card-text text-muted mb-2">5,000 sqft &bull; Austin</p>
                        <p class="card-text small text-truncate">Modern warehouse space perfect for light manufacturing or logistics.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=9" class="card-img-top" alt="Luxury Office Floor">
                    <div class="price-badge">$20,000 / month</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">Luxury Office Floor</h5>
                        <p class="card-text text-muted mb-2">10,000 sqft &bull; San Francisco</p>
                        <p class="card-text small text-truncate">Entire floor of a class-A building with premium finishes.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 col-md-6">
                <div class="card listing-card h-100">
                    <img src="https://picsum.photos/400/250?random=10" class="card-img-top" alt="High Street Shopfront">
                    <div class="price-badge">$4,800 / month</div>
                    <div class="card-body">
                        <h5 class="card-title text-navy">High Street Shopfront</h5>
                        <p class="card-text text-muted mb-2">900 sqft &bull; Miami</p>
                        <p class="card-text small text-truncate">Excellent pedestrian traffic and large display windows.</p>
                        <a href="#" class="btn btn-secondary-navy btn-sm">View Details</a>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="text-center mt-5">
            <a href="{!! page_content('home.listings.button_link', '#') !!}" class="btn btn-primary-accent btn-lg">{!! page_content('home.listings.button_text', 'View All Listings') !!}</a>
        </div>
    </section>

    <hr>

    <section class="container py-5">
        <h2 class="text-center mb-5">{!! page_content('home.features.heading', 'Why Choose Crest Properties') !!}</h2>
        <div class="row text-center">
            
            <div class="col-md-3 mb-4">
                <div class="value-prop-box">
                    <i class="bi bi-clock-history value-prop-icon"></i>
                    <h5 class="fw-bold">Flexible Leasing</h5>
                    <p class="text-muted small mb-0">Customizable lease terms to fit your business growth cycles.</p>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="value-prop-box">
                    <i class="bi bi-geo-alt value-prop-icon"></i>
                    <h5 class="fw-bold">Prime Locations</h5>
                    <p class="text-muted small mb-0">Access to A-grade properties in major metropolitan areas.</p>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="value-prop-box">
                    <i class="bi bi-lightbulb value-prop-icon"></i>
                    <h5 class="fw-bold">Modern Amenities</h5>
                    <p class="text-muted small mb-0">Properties equipped with cutting-edge technology and facilities.</p>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="value-prop-box">
                    <i class="bi bi-person-workspace value-prop-icon"></i>
                    <h5 class="fw-bold">Expert Agents</h5>
                    <p class="text-muted small mb-0">Dedicated commercial real estate advisors with deep market knowledge.</p>
                </div>
            </div>
        </div>
    </section>

    <hr>

    <section class="container py-5">
        <h2 class="text-center mb-5">{!! page_content('home.testimonials.heading', 'Client Success Stories') !!}</h2>
        <div id="caseStudyCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner p-3">
                
                <div class="carousel-item active">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center mb-3 mb-md-0">
                            <img src="https://picsum.photos/150/150" class="rounded-circle mb-3 border border-3 border-secondary" alt="Client Photo">
                            <h5 class="fw-bold mb-0">Jane Doe</h5>
                            <p class="small text-muted">CEO, InnovateTech</p>
                        </div>
                        <div class="col-md-9">
                            <figure>
                                <blockquote class="blockquote fst-italic">
                                    <p class="lead">"Crest Properties helped our startup find the perfect coworking space that scales with our rapid growth. The process was seamless and incredibly fast!"</p>
                                </blockquote>
                                <figcaption class="blockquote-footer">
                                    Leased a <cite title="Source Title">Coworking Hub</cite> in Austin
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </div>

                <div class="carousel-item">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center mb-3 mb-md-0">
                            <img src="https://picsum.photos/150/150" class="rounded-circle mb-3 border border-3 border-secondary" alt="Client Photo">
                            <h5 class="fw-bold mb-0">Mark Chen</h5>
                            <p class="small text-muted">Director, Global Retail Group</p>
                        </div>
                        <div class="col-md-9">
                            <figure>
                                <blockquote class="blockquote fst-italic">
                                    <p class="lead">"Their expertise secured us a high-profile retail corner unit in Los Angeles, exceeding our expectations for foot traffic and visibility."</p>
                                </blockquote>
                                <figcaption class="blockquote-footer">
                                    Leased a <cite title="Source Title">Retail Corner Unit</cite> in Los Angeles
                                </figcaption>
                            </figure>
                        </div>
                    </div>
                </div>

            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#caseStudyCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#caseStudyCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </section>

    <hr>

    <section class="container py-5 bg-light">
        <h2 class="text-center mb-5">{!! page_content('home.agents.heading', 'Meet Our Expert Agents') !!}</h2>
        <div class="row g-4 justify-content-center">
            
            <div class="col-lg-3 col-md-6 text-center">
                <img src="https://picsum.photos/180/180" class="rounded-circle mb-3 shadow-sm" alt="Agent Headshot">
                <h4 class="h5 fw-bold mb-0">Patrick Stone</h4>
                <p class="small text-muted mb-2">Specialty: Office Leasing</p>
                <a href="#" class="btn btn-secondary-navy btn-sm">Contact Agent</a>
            </div>

            <div class="col-lg-3 col-md-6 text-center">
                <img src="https://picsum.photos/180/180" class="rounded-circle mb-3 shadow-sm" alt="Agent Headshot">
                <h4 class="h5 fw-bold mb-0">Sarah Jenkins</h4>
                <p class="small text-muted mb-2">Specialty: Retail & Shops</p>
                <a href="#" class="btn btn-secondary-navy btn-sm">Contact Agent</a>
            </div>

            <div class="col-lg-3 col-md-6 text-center">
                <img src="https://picsum.photos/180/180" class="rounded-circle mb-3 shadow-sm" alt="Agent Headshot">
                <h4 class="h5 fw-bold mb-0">David Rodriguez</h4>
                <p class="small text-muted mb-2">Specialty: Warehouse & Industrial</p>
                <a href="#" class="btn btn-secondary-navy btn-sm">Contact Agent</a>
            </div>
            
        </div>
    </section>

    <hr>

    <section class="container cta-banner">
        <div class="container text-center">
            <div class="row align-items-center justify-content-between">
                <div class="col-md-8 text-md-start mb-3 mb-md-0">
                    <h2 class="text-white fw-bold mb-0">{!! page_content('home.cta.heading', 'Looking for the right business space?') !!}</h2>
                    <p class="lead text-silver mt-1 mb-0">{!! page_content('home.cta.paragraph', 'Let our team of experts guide your commercial real estate journey.') !!}</p>
                </div>
                <div class="col-md-4 text-md-end">
                    <a href="{!! page_content('home.cta.button_link', '#') !!}" class="btn btn-primary-accent btn-lg text-white px-5">{!! page_content('home.cta.button_text', 'Start Your Search') !!}</a>
                </div>
            </div>
        </div>
    </section>

    <hr>

@endsection


{{-- Push page-specific scripts to the 'scripts' stack --}}
@push('scripts')
    <script>
        // Minimal JS for activating the carousel
        var caseStudyCarousel = document.querySelector('#caseStudyCarousel')
        // Check if the carousel element exists before initializing
        if (caseStudyCarousel) {
            var carousel = new bootstrap.Carousel(caseStudyCarousel, {
                interval: 5000,
                wrap: true
            });
        }
    </script>
@endpush