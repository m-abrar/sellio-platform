@extends('frontend._layouts._app')

@section('title', 'Maplewood Homes')

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
    :root {
        /* Maplewood Theme Colors */
        --bs-soft-beige: #FAF3E0;
        --bs-warm-gray: #ECECEC;
        --bs-earthy-green: #2F4F4F;
        --bs-accent-orange: #F28C38;

        /* Override Defaults with Theme Colors */
        --primary-color: var(--bs-accent-orange);
        --secondary-color: var(--bs-earthy-green);
        --light-color: var(--bs-soft-beige);
        --dark-color: var(--bs-earthy-green);
        --body-bg: var(--bs-soft-beige);

        /* Theme Fonts */
        --font-heading: 'Nunito', sans-serif;
        --font-body: 'Inter', sans-serif;
    }
</style>

@endpush

@section('content')
    <section id="hero" class="hero-banner d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <h1>{!! page_content('home.hero.heading', 'Welcome to Maplewood\'s Charm') !!}</h1>
                    <p class="lead">{!! page_content('home.hero.paragraph', 'A neighborhood you\'ll love to call home.') !!}</p>
                    <a href="{!! page_content('home.hero.button_1_link', '#featured-properties') !!}" class="btn btn-primary btn-lg me-3 mb-2">{!! page_content('home.hero.button_1_text', 'View Homes in This Area') !!}</a>
                    <a href="{!! page_content('home.hero.button_2_link', '#community-overview') !!}" class="btn btn-outline-secondary btn-lg mb-2">{!! page_content('home.hero.button_2_text', 'Explore Community') !!}</a>
                </div>
            </div>
        </div>
    </section>

    <section id="community-overview" class="section-padding bg-warm-gray">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h2 class="mb-4">{!! page_content('home.welcome.heading', 'Discover Maplewood: Where Life Flourishes') !!}</h2>
                    <p class="lead">{!! page_content('home.welcome.paragraph_lead', 'Family-friendly, urban convenience, and a strong sense of community define Maplewood. Discover tree-lined streets, diverse dining, and top-rated schools that make this neighborhood truly special.') !!}</p>
                    <p>{!! page_content('home.welcome.paragraph_secondary', 'Maplewood boasts a vibrant atmosphere with something for everyone. From bustling local markets to serene parks, living here means enjoying the best of both worlds – a peaceful retreat with easy access to city amenities.') !!}</p>
                    <a href="{!! page_content('home.welcome.button_1_link', '#featured-properties') !!}" class="btn btn-primary me-3 mb-2">{!! page_content('home.welcome.button_1_text', 'Find Your Home') !!}</a>
                    <a href="{!! page_content('home.welcome.button_2_link', '#interactive-map') !!}" class="btn btn-outline-secondary mb-2">{!! page_content('home.welcome.button_2_text', 'Explore Amenities') !!}</a>
                </div>
                <div class="col-lg-5 offset-lg-1">
                    <div class="row text-center">
                        <div class="col-6 mb-4">
                            <div class="feature-card h-100">
                                <i class="fas fa-school icon"></i>
                                <h3>Schools</h3>
                                <p class="h4 fw-bold text-earthy-green">5 Highly-Rated</p>
                            </div>
                        </div>
                        <div class="col-6 mb-4">
                            <div class="feature-card h-100">
                                <i class="fas fa-tree icon"></i>
                                <h3>Parks</h3>
                                <p class="h4 fw-bold text-earthy-green">12 Lush Greenspaces</p>
                            </div>
                        </div>
                        <div class="col-6 mb-4">
                            <div class="feature-card h-100">
                                <i class="fas fa-utensils icon"></i>
                                <h3>Restaurants</h3>
                                <p class="h4 fw-bold text-earthy-green">40+ Eateries</p>
                            </div>
                        </div>
                        <div class="col-6 mb-4">
                            <div class="feature-card h-100">
                                <i class="fas fa-train icon"></i>
                                <h3>Transit</h3>
                                <p class="h4 fw-bold text-earthy-green">3 Convenient Lines</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="local-highlights" class="section-padding">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.features.heading', 'Maplewood\'s Irresistible Local Highlights') !!}</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="School building">
                        <div class="card-body text-center">
                            <i class="fas fa-graduation-cap icon mb-2"></i>
                            <h5 class="card-title">Top Schools Nearby</h5>
                            <p class="card-text">Access to highly-rated public and private schools, ensuring a bright future for your children.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="People at outdoor cafe">
                        <div class="card-body text-center">
                            <i class="fas fa-child icon mb-2"></i>
                            <h5 class="card-title">Walkable Parks & Playgrounds</h5>
                            <p class="card-text">Endless green spaces, perfect for family picnics, morning jogs, or letting kids play freely.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="People at outdoor cafe">
                        <div class="card-body text-center">
                            <i class="fas fa-store icon mb-2"></i>
                            <h5 class="card-title">Shopping & Dining Hotspots</h5>
                            <p class="card-text">From cozy cafes to gourmet restaurants and unique boutiques, everything is within reach.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Quiet residential street">
                        <div class="card-body text-center">
                            <i class="fas fa-shield-alt icon mb-2"></i>
                            <h5 class="card-title">Safe, Family-Friendly Community</h5>
                            <p class="card-text">Enjoy peace of mind in a welcoming environment where neighbors look out for each other.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Train station">
                        <div class="card-body text-center">
                            <i class="fas fa-bus-alt icon mb-2"></i>
                            <h5 class="card-title">Easy Commute & Transit Access</h5>
                            <p class="card-text">Convenient public transportation options make getting around the city a breeze.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="People biking">
                        <div class="card-body text-center">
                            <i class="fas fa-bicycle icon mb-2"></i>
                            <h5 class="card-title">Active Lifestyle Opportunities</h5>
                            <p class="card-text">Miles of biking trails, community sports, and fitness centers to keep you moving.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="featured-properties" class="section-padding bg-warm-gray">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.featured.heading', 'Homes for Sale in Maplewood') !!}</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Modern home exterior">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">123 Elm Street</h5>
                            <p class="card-text fw-bold text-accent-orange">$785,000</p>
                            <p class="card-text"><i class="fas fa-bed me-2"></i>4 Beds <i class="fas fa-bath ms-3 me-2"></i>3 Baths</p>
                            <a href="#" class="btn btn-primary btn-sm">View Details</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Suburban home">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">456 Oak Avenue</h5>
                            <p class="card-text fw-bold text-accent-orange">$620,000</p>
                            <p class="card-text"><i class="fas fa-bed me-2"></i>3 Beds <i class="fas fa-bath ms-3 me-2"></i>2.5 Baths</p>
                            <a href="#" class="btn btn-primary btn-sm">View Details</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Charming bungalow">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">789 Pine Street</h5>
                            <p class="card-text fw-bold text-accent-orange">$545,000</p>
                            <p class="card-text"><i class="fas fa-bed me-2"></i>3 Beds <i class="fas fa-bath ms-3 me-2"></i>2 Baths</p>
                            <a href="#" class="btn btn-primary btn-sm">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-5">
                <a href="{!! page_content('home.featured.button_link', '#') !!}" class="btn btn-outline-secondary btn-lg">{!! page_content('home.featured.button_text', 'View All Properties in Maplewood') !!}</a>
            </div>
        </div>
    </section>

    <section id="interactive-map" class="section-padding">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.neighborhood.heading', 'Explore Maplewood Visually') !!}</h2>
            <div class="row">
                <div class="col-lg-8 mb-4 mb-lg-0">
                    <div class="map-container">
                        {{-- The iframe URL needs a proper Google Maps embed link for actual function --}}
                        <iframe src="https://picsum.photos/1000/1000" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
                <div class="col-lg-4 map-sidebar">
                    <h3 class="mb-3">{!! page_content('home.neighborhood.sub_heading', 'Neighborhood Hotspots') !!}</h3>
                    <div class="list-group">
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-school me-3 text-earthy-green"></i> Top Schools
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-utensils me-3 text-earthy-green"></i> Popular Restaurants
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-tree me-3 text-earthy-green"></i> Community Parks
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-coffee me-3 text-earthy-green"></i> Local Cafes
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-shopping-bag me-3 text-earthy-green"></i> Boutiques & Shops
                        </a>
                        <a href="#" class="list-group-item list-group-item-action d-flex align-items-center">
                            <i class="fas fa-subway me-3 text-earthy-green"></i> Transit Stations
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="testimonials" class="section-padding bg-warm-gray">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.testimonials.heading', 'What Our Neighbors Say About Maplewood') !!}</h2>
            <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <img src="https://picsum.photos/1000/1000" class="d-block mx-auto rounded-circle mb-3" alt="Resident 1">
                                <figure class="text-center">
                                    <blockquote class="blockquote">
                                        <p class="mb-0 fs-4">"We absolutely love Maplewood! It's safe, quiet, and the schools are fantastic for our kids. Best decision we ever made."</p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer mt-2">
                                        Sarah & Tom R., <cite title="Source Title">Maplewood Residents since 2018</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <img src="https://picsum.photos/1000/1000" class="d-block mx-auto rounded-circle mb-3" alt="Resident 2">
                                <figure class="text-center">
                                    <blockquote class="blockquote">
                                        <p class="mb-0 fs-4">"The community events and local shops in Maplewood make it feel like a small town, but with all the conveniences of city living."</p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer mt-2">
                                        Maria S., <cite title="Source Title">New Maplewood Homeowner</cite>
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="row justify-content-center">
                            <div class="col-lg-8">
                                <img src="https://picsum.photos/1000/1000" class="d-block mx-auto rounded-circle mb-3" alt="Resident 3">
                                <figure class="text-center">
                                    <blockquote class="blockquote">
                                        <p class="mb-0 fs-4">"As someone who commutes, the easy access to transit lines from Maplewood has been a game-changer. Plus, the parks are amazing!"</p>
                                    </blockquote>
                                    <figcaption class="blockquote-footer mt-2">
                                        David L., <cite title="Source Title">Maplewood Resident for 10+ Years</cite>
                                    </figcaption>
                                </figure>
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
    </section>

    <section id="lifestyle-gallery" class="section-padding">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.highlights.heading', 'Experience the Maplewood Lifestyle') !!}</h2>
            <div class="row g-3">
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Farmer's Market">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Cozy cafe interior">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Kids at playground">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Outdoor dining">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Community event">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="People walking dogs">
                </div>
                <div class="col-6 col-md-4 col-lg-3">
                    <img src="https://picsum.photos/1000/1000" class="img-fluid rounded shadow-sm" alt="Friends enjoying drinks">
                </div>
            </div>
        </div>
    </section>

    <section id="local-blog" class="section-padding bg-warm-gray">
        <div class="container">
            <h2 class="text-center mb-5">{!! page_content('home.blogs.heading', 'Maplewood Local Buzz & News') !!}</h2>
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Coffee shop">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">Best Coffee Shops in Maplewood</h5>
                            <p class="card-text">Discover your new favorite spot for a morning brew or an afternoon pick-me-up.</p>
                            <a href="#" class="btn btn-outline-secondary btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Kids playing">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">5 Weekend Activities with Kids in Maplewood</h5>
                            <p class="card-text">Ideas for family fun, from park adventures to creative workshops.</p>
                            <a href="#" class="btn btn-outline-secondary btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100">
                        <img src="https://picsum.photos/1000/1000" class="card-img-top" alt="Community festival">
                        <div class="card-body">
                            <h5 class="card-title text-earthy-green">Upcoming Maplewood Community Events</h5>
                            <p class="card-text">Stay updated on festivals, markets, and gatherings in your neighborhood.</p>
                            <a href="#" class="btn btn-outline-secondary btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="contact-agent" class="section-padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center agent-section">
                    <h2 class="mb-4">{!! page_content('home.agents.heading', 'Connect with a Maplewood Specialist') !!}</h2>
                    <img src="https://picsum.photos/1000/1000" alt="Agent Headshot" class="img-fluid mb-3 rounded-circle">
                    <h3>Jane Doe</h3>
                    <p class="lead text-muted">Your Trusted Maplewood Real Estate Expert</p>
                    <p>With over 10 years of experience and a deep understanding of the Maplewood market, Jane is dedicated to helping you find your dream home or sell your current property with ease.</p>
                    <a href="tel:+15551234567" class="btn btn-primary btn-lg me-3 mb-2"><i class="fas fa-phone-alt me-2"></i>Call Jane</a>
                    <a href="mailto:jane.doe@maplewoodhomes.com" class="btn btn-outline-secondary btn-lg mb-2"><i class="fas fa-envelope me-2"></i>Email Jane</a>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
<script>
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
</script>
@endpush