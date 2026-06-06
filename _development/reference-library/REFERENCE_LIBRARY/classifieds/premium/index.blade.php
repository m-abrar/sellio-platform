@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<style>
    :root {
        --navy: #0A1C3C;
        --gold: #FFC300;
        --teal: #14B8A6;
        --light-bg: #F8F9FA;
        
        --font-heading: 'Lato', sans-serif;
        --font-body: 'Roboto', sans-serif;

    }
</style>
@endpush

@section('content')

<div class="search-section py-5 my-3">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="input-group input-group-lg shadow-sm rounded-4" style="border: 1px solid var(--teal);">
                    <input type="text" class="form-control rounded-start-4 border-0 ps-4 py-3" 
                           placeholder="Search for Business Name, Industry, or Location..." aria-label="Search">
                    <button class="btn btn-gold rounded-end-4 px-5" type="button">
                        <i class="fa-solid fa-magnifying-glass me-2"></i> Find Opportunity
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container mb-5">
    <div class="row">
        
        <div class="col-lg-3">
            <div class="filter-sidebar sticky-top" style="top: 40px;">
                <h5 class="mb-4 fw-bold" style="color: var(--navy); font-weight: 700;">Refine Search</h5>
                
                <div class="mb-3">
                    <label class="form-label fw-semibold" style="color: var(--navy); font-size: 0.9rem;">Category</label>
                    <select class="form-select rounded-3">
                        <option>All Categories</option>
                        <option>Technology & SaaS</option>
                        <option>Real Estate & Property</option>
                        <option>Hospitality & F&B</option>
                        <option>Manufacturing</option>
                        <option>Retail</option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold" style="color: var(--navy); font-size: 0.9rem;">Location</label>
                    <input type="text" class="form-control rounded-3" placeholder="City, State, or Country">
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-semibold" style="color: var(--navy); font-size: 0.9rem;">Price Range (USD)</label>
                    <div class="d-flex">
                        <input type="number" class="form-control rounded-3 me-2" placeholder="Min ($)">
                        <input type="number" class="form-control rounded-3" placeholder="Max ($)">
                    </div>
                </div>

                <button class="btn btn-gold w-100 fw-bold mt-3 rounded-3">Apply Filters</button>
            </div>
        </div>

        <div class="col-lg-9">
            
            <h2 class="featured-header">Featured Opportunities</h2>
            <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
                <div class="col">
                    <div class="card h-100 listing-card shadow-sm rounded-4">
                        <img src="https://picsum.photos/id/19/400/200" class="card-img-top" alt="Modern Office Space">
                        <div class="card-body p-4">
                            <span class="verified-badge mb-2"><i class="fa-solid fa-medal me-1"></i> VERIFIED SELLER</span>
                            <h5 class="card-title mt-2" style="color: var(--navy); font-weight: 700;">Global SaaS Platform</h5>
                            <p class="card-text text-muted mb-3" style="font-size: 0.85rem;">Recurring revenue model with high-margin customer base.</p>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <small class="text-secondary" style="font-size: 0.8rem;"><i class="fa-solid fa-location-dot me-1"></i> Fully Remote</small>
                                <span class="fw-bold fs-5" style="color: var(--navy); font-family: var(--font-heading);">$2,500,000</span>
                            </div>
                            <button class="btn btn-details btn-sm w-100 rounded-3 fw-medium">View Details</button>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card shadow-sm rounded-4">
                        <img src="https://picsum.photos/id/111/400/200" class="card-img-top" alt="Gym Interior">
                        <div class="card-body p-4">
                            <span class="verified-badge mb-2"><i class="fa-solid fa-medal me-1"></i> VERIFIED SELLER</span>
                            <h5 class="card-title mt-2" style="color: var(--navy); font-weight: 700;">Upscale Health Club</h5>
                            <p class="card-text text-muted mb-3" style="font-size: 0.85rem;">Established brand in a fast-growing metropolitan area.</p>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <small class="text-secondary" style="font-size: 0.8rem;"><i class="fa-solid fa-location-dot me-1"></i> New York City</small>
                                <span class="fw-bold fs-5" style="color: var(--navy); font-family: var(--font-heading);">$950,000</span>
                            </div>
                            <button class="btn btn-details btn-sm w-100 rounded-3 fw-medium">View Details</button>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card shadow-sm rounded-4">
                        <img src="https://picsum.photos/id/133/400/200" class="card-img-top" alt="Warehouse Interior">
                        <div class="card-body p-4">
                            <span class="verified-badge mb-2"><i class="fa-solid fa-medal me-1"></i> VERIFIED SELLER</span>
                            <h5 class="card-title mt-2" style="color: var(--navy); font-weight: 700;">B2B Logistics & Warehousing</h5>
                            <p class="card-text text-muted mb-3" style="font-size: 0.85rem;">Asset-heavy operation with stable, high-volume contracts.</p>
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <small class="text-secondary" style="font-size: 0.8rem;"><i class="fa-solid fa-location-dot me-1"></i> Chicago, IL</small>
                                <span class="fw-bold fs-5" style="color: var(--navy); font-family: var(--font-heading);">$1,200,000</span>
                            </div>
                            <button class="btn btn-details btn-sm w-100 rounded-3 fw-medium">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="membership-banner mb-5 shadow-lg rounded-4">
                <h3 class="fw-bold mb-3" style="color: var(--gold); font-weight: 900;">UNLOCK PREMIUM OPPORTUNITIES</h3>
                <p class="lead" style="font-weight: 300; opacity: 0.9;">List your business with confidence and reach a vetted network of serious investors.</p>
                <button class="btn btn-gold btn-lg mt-2 rounded-3">Explore Membership Plans</button>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-bold" style="color: var(--navy); font-weight: 700;">All Business Listings (321 Results)</h4>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-toggle-view active"><i class="fa-solid fa-grip-vertical me-1"></i> Grid</button>
                    <button type="button" class="btn btn-toggle-view"><i class="fa-solid fa-list me-1"></i> List</button>
                </div>
            </div>

            <div class="row row-cols-1 row-cols-md-4 g-4 mb-5">
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/237/300/150" class="card-img-top" alt="Laptop and coffee">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Niche E-Commerce Shop</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Remote</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$350,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/1080/300/150" class="card-img-top" alt="Cafe Latte Art">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Local Cafe & Bakery</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Seattle, WA</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$120,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/1050/300/150" class="card-img-top" alt="Trucking Yard">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Trucking Fleet Operation</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Dallas, TX</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$800,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/1/300/150" class="card-img-top" alt="Office Desk">
                        <div class="card-body p-3">
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Software Reseller Agency</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Global</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$50,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/30/300/150" class="card-img-top" alt="Business Meeting">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">B2B Consulting Firm</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Remote</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$450,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/39/300/150" class="card-img-top" alt="Vending Machines">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Vending Machine Route</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Phoenix, AZ</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$75,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/40/300/150" class="card-img-top" alt="Digital Marketing">
                        <div class="card-body p-3">
                            <span class="verified-badge mb-1"><i class="fa-solid fa-medal me-1"></i> VERIFIED</span>
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Digital Marketing Agency</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> London, UK</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$220,000</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card h-100 listing-card rounded-4">
                        <img src="https://picsum.photos/id/1010/300/150" class="card-img-top" alt="Laundromat Machines">
                        <div class="card-body p-3">
                            <h6 class="card-title fw-bold mt-2" style="color: var(--navy); font-weight: 600;">Local Laundromat Service</h6>
                            <small class="text-secondary" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot me-1"></i> Miami, FL</small>
                            <p class="fw-bold fs-6 mt-2 mb-0" style="color: var(--navy); font-family: var(--font-heading);">$90,000</p>
                        </div>
                    </div>
                </div>
            </div>

            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link rounded-start-3" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
                    <li class="page-item"><a class="page-link" href="#">15</a></li>
                    <li class="page-item">
                        <a class="page-link rounded-end-3" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            
        </div>

    </div>
</div>
@endsection