@extends('frontend._layouts._app')

@section('title', 'Skyline Penthouse | A Masterpiece Above the City')

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
<style>
    :root {
        --white: #FFFFFF;
        --charcoal: #1C1C1C;
        --gold: #D4AF37;
        --beige: #F5F5F5;
        --font-heading: 'Lora', serif;
        --font-body: 'Poppins', sans-serif;
    }
</style>

@endpush

@section('content')
    <header class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <h1>{!! page_content('home.hero.heading', 'Skyline Penthouse') !!}</h1>
            <p class="lead">{!! page_content('home.hero.paragraph', 'A masterpiece above the city') !!}</p>
            <div class="d-flex justify-content-center gap-3">
                <a href="{!! page_content('home.hero.button_1_link', '#contact') !!}" class="btn btn-gold btn-lg text-charcoal shadow-sm">{!! page_content('home.hero.button_1_text', 'Book a Viewing') !!}</a>
                <a href="{!! page_content('home.hero.button_2_link', '#') !!}" class="btn btn-outline-white btn-lg">{!! page_content('home.hero.button_2_text', 'Download Brochure') !!}</a>
            </div>
        </div>
    </header>
    <section id="overview" class="py-5 bg-beige">
        <div class="container-lg">
            <div class="row row-cols-2 row-cols-md-5 g-4 text-center">
                
                <div class="col overview-stat">
                    <h2 class="text-charcoal">$4.5M</h2>
                    <small class="text-uppercase">Price</small>
                </div>
                
                <div class="col overview-stat">
                    <h2 class="text-charcoal">4 Bed</h2>
                    <small class="text-uppercase">Bedrooms</small>
                </div>
                
                <div class="col overview-stat">
                    <h2 class="text-charcoal">5 Bath</h2>
                    <small class="text-uppercase">Bathrooms</small>
                </div>
                
                <div class="col overview-stat">
                    <h2 class="text-charcoal">5,200 sqft</h2>
                    <small class="text-uppercase">Area</small>
                </div>
                
                <div class="col overview-stat">
                    <h2 class="text-charcoal">Manhattan, NY</h2>
                    <small class="text-uppercase">Location</small>
                </div>

            </div>
        </div>
    </section>
    <section id="gallery" class="py-5 bg-white">
        <div class="container-lg">
            <h2 class="text-center mb-4 display-6">{!! page_content('home.gallery.heading', 'Photo Gallery') !!}</h2>
            <div id="propertyCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner rounded-3 shadow-lg">
                    <div class="carousel-item active">
                        <img src="https://picsum.photos/1200/600/" class="d-block w-100" alt="Luxury Interior 1">
                    </div>
                    <div class="carousel-item">
                        <img src="https://picsum.photos/1200/600/" class="d-block w-100" alt="Rooftop Terrace">
                    </div>
                    <div class="carousel-item">
                        <img src="https://picsum.photos/1200/600/" class="d-block w-100" alt="Modern Kitchen">
                    </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            
            <div class="d-flex justify-content-center mt-3 gap-2">
                <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="0" class="active border border-3 rounded" aria-current="true" aria-label="Slide 1" style="width: 100px; height: 75px; background: url('https://picsum.photos/100/75/') center/cover;"></button>
                <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="1" aria-label="Slide 2" class="border border-3 rounded" style="width: 100px; height: 75px; background: url('https://picsum.photos/100/75/') center/cover;"></button>
                <button type="button" data-bs-target="#propertyCarousel" data-bs-slide-to="2" aria-label="Slide 3" class="border border-3 rounded" style="width: 100px; height: 75px; background: url('https://picsum.photos/100/75/') center/cover;"></button>
            </div>
        </div>
    </section>
    <section id="features" class="py-5 bg-beige">
        <div class="container-lg">
            <h2 class="text-center mb-5 display-6">{!! page_content('home.features.heading', 'Key Features & Amenities') !!}</h2>
            <div class="row row-cols-2 row-cols-md-3 g-4 text-center">
                
                <div class="col">
                    <i class="bi bi-water feature-icon"></i>
                    <h5 class="fw-bold">Infinity Pool</h5>
                    <p class="text-muted">Overlooking the cityscape.</p>
                </div>
                
                <div class="col">
                    <i class="bi bi-brightness-high feature-icon"></i>
                    <h5 class="fw-bold">Rooftop Terrace</h5>
                    <p class="text-muted">360° panoramic views.</p>
                </div>
                
                <div class="col">
                    <i class="bi bi-house-door feature-icon"></i>
                    <h5 class="fw-bold">Smart Home</h5>
                    <p class="text-muted">Integrated automation system.</p>
                </div>
                
                <div class="col">
                    <i class="bi bi-building feature-icon"></i>
                    <h5 class="fw-bold">Private Elevator</h5>
                    <p class="text-muted">Exclusive access to your floor.</p>
                </div>
                
                <div class="col">
                    <i class="bi bi-person-arms-up feature-icon"></i>
                    <h5 class="fw-bold">Fitness Suite</h5>
                    <p class="text-muted">State-of-the-art equipment.</p>
                </div>
                
                <div class="col">
                    <i class="bi bi-person-vcard feature-icon"></i>
                    <h5 class="fw-bold">Concierge Service</h5>
                    <p class="text-muted">24/7 personalized assistance.</p>
                </div>
                
            </div>
        </div>
    </section>
    <section id="floorplans" class="py-5 bg-white">
        <div class="container-lg">
            <h2 class="text-center mb-5 display-6">{!! page_content('home.floors.heading', 'Detailed Floor Plans') !!}</h2>
            <div class="row">
                <div class="col-md-3 mb-4 mb-md-0">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button class="nav-link text-start active" id="v-pills-floor1-tab" data-bs-toggle="pill" data-bs-target="#v-pills-floor1" type="button" role="tab" aria-controls="v-pills-floor1" aria-selected="true">Floor 1</button>
                        <button class="nav-link text-start" id="v-pills-floor2-tab" data-bs-toggle="pill" data-bs-target="#v-pills-floor2" type="button" role="tab" aria-controls="v-pills-floor2" aria-selected="false">Floor 2</button>
                        <button class="nav-link text-start" id="v-pills-rooftop-tab" data-bs-toggle="pill" data-bs-target="#v-pills-rooftop" type="button" role="tab" aria-controls="v-pills-rooftop" aria-selected="false">Rooftop</button>
                    </div>
                </div>

                <div class="col-md-9">
                    <div class="tab-content" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="v-pills-floor1" role="tabpanel" aria-labelledby="v-pills-floor1-tab" tabindex="0">
                            <img src="https://picsum.photos/900/550/" class="img-fluid rounded shadow" alt="Floor 1 Layout">
                        </div>
                        <div class="tab-pane fade" id="v-pills-floor2" role="tabpanel" aria-labelledby="v-pills-floor2-tab" tabindex="0">
                            <img src="https://picsum.photos/900/550/" class="img-fluid rounded shadow" alt="Floor 2 Layout">
                        </div>
                        <div class="tab-pane fade" id="v-pills-rooftop" role="tabpanel" aria-labelledby="v-pills-rooftop-tab" tabindex="0">
                            <img src="https://picsum.photos/900/550" class="img-fluid rounded shadow" alt="Rooftop Layout">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="virtual-tour" class="py-5 bg-beige">
        <div class="container-lg text-center">
            <h2 class="mb-4 display-6">Virtual Tour</h2>
            <p class="lead text-charcoal fw-bold">Explore every corner of your future home.</p>
            <div class="ratio ratio-16x9 mx-auto" style="max-width: 900px;">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=7Yj_11gVv0rR3aFj" title="Virtual Tour Placeholder" allowfullscreen class="rounded shadow-lg"></iframe>
            </div>
        </div>
    </section>
    <section id="neighborhood" class="py-5 bg-white">
        <div class="container-lg">
            <h2 class="text-center mb-5 display-6">Neighborhood & Lifestyle</h2>
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="bg-light p-3 rounded shadow" style="height: 400px;">
                        <img src="https://picsum.photos/800/400/" class="img-fluid rounded w-100 h-100" style="object-fit: cover;" alt="Location Map">
                    </div>
                </div>
                
                <div class="col-md-5">
                    <h3 class="text-gold mb-3">Local Conveniences</h3>
                    <ul class="list-unstyled">
                        <li class="mb-3"><i class="bi bi-building-check text-gold me-2"></i> **Elite Schools:** Within 1 mile radius.</li>
                        <li class="mb-3"><i class="bi bi-tree text-gold me-2"></i> **Central Park:** 5-minute drive.</li>
                        <li class="mb-3"><i class="bi bi-cup-hot text-gold me-2"></i> **Fine Dining:** Michelin-star restaurants nearby.</li>
                        <li class="mb-3"><i class="bi bi-train-front text-gold me-2"></i> **Transit Hub:** Easy access to all city lines.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <section id="contact" class="py-5 bg-beige">
        <div class="container-lg">
            <h2 class="text-center mb-5 display-6">Inquire & Connect</h2>
            <div class="row g-5">
                <div class="col-md-5">
                    <div class="card agent-card p-4 h-100">
                        <div class="text-center">
                            <img src="https://picsum.photos/150/150/" class="rounded-circle agent-photo mb-3" alt="Agent Headshot">
                            <h3 class="mb-0">Victoria Sterling</h3>
                            <p class="text-gold fw-bold">Luxury Real Estate Specialist</p>
                        </div>
                        <hr>
                        <div class="p-3">
                            <p><i class="bi bi-phone text-gold me-2"></i> (555) 123-4567</p>
                            <p><i class="bi bi-envelope text-gold me-2"></i> victoria@skylineestates.com</p>
                            <a href="#" class="btn btn-gold w-100 mt-3 text-charcoal">Schedule a Tour</a>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-7">
                    <h4 class="mb-4">Send a Direct Inquiry</h4>
                    <form>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <input type="text" class="form-control" placeholder="Your Name" required>
                            </div>
                            <div class="col-md-6">
                                <input type="email" class="form-control" placeholder="Your Email" required>
                            </div>
                            <div class="col-12">
                                <input type="tel" class="form-control" placeholder="Your Phone (Optional)">
                            </div>
                            <div class="col-12">
                                <textarea class="form-control" rows="4" placeholder="Your Message/Questions" required></textarea>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-dark bg-charcoal btn-lg text-gold w-100">Send Inquiry</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <section class="py-5 bg-charcoal text-center text-white">
        <div class="container-lg">
            <h2 class="text-gold mb-3 display-6" style="font-family: var(--font-heading);">{!! page_content('home.cta.heading', 'Your next chapter starts here.') !!}</h2>
            <a href="{!! page_content('home.cta.button_link', '#contact') !!}" class="btn btn-outline-light btn-lg border-gold text-white">{!! page_content('home.cta.button_text', 'Inquire Now') !!}</a>
        </div>
    </section>
@endsection