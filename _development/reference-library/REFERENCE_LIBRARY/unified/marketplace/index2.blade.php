<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MarketHub - High Fidelity Professional Theme</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            /* NEW PREMIUM COLOR PALETTE */
            --bs-primary: #0F4C81; /* Deep Professional Blue */
            --bs-secondary: #3B7FB9; /* Lighter Blue Accent */
            --bs-primary: #E30613; /* E-commerce Red/Pink */
            --bs-secondary: #c70410; /* Darker red for hover/accents */
            --bs-accent: #FFC107; /* Pop of Yellow for promotions */
            --bs-text-dark: #2c3e50; /* Darker text for readability */
            --bs-bg-light: #F8F9FA; /* Off-white, soft background */
            --bs-bg-content: #ffffff;
            
            /* REFINED SHADOWS FOR HIGH FIDELITY */
            --bs-box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* Stronger, softer overall lift */
            --bs-card-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Soft card shadow */
            --bs-border-radius: 0.75rem; /* Larger, softer radius for containers */
            --bs-border-radius-sm: 0.5rem; /* Medium radius for cards/buttons */

            /* --- Banner Colors (Kept for variety) --- */
            --banner-green: #37C09E;
            --banner-blue: #3A83F1;
            --banner-purple: #9066CC;
            --banner-orange: #FFB340;
            --banner-coral: #FA6B59;
        }

        body {
            font-family: 'Poppins', sans-serif; 
            background-color: var(--bs-bg-light); 
            color: var(--bs-text-dark); 
        }
        
        /* Global Overrides */
        .bg-primary { background-color: var(--bs-primary) !important; }
        .text-primary { color: var(--bs-primary) !important; }
        .text-secondary-blue { color: var(--bs-secondary) !important; }
        .bg-secondary-blue { background-color: var(--bs-secondary) !important; }
        .btn { border-radius: var(--bs-border-radius-sm); font-weight: 500; }
        .btn-primary { 
            --bs-btn-bg: var(--bs-primary);
            --bs-btn-border-color: var(--bs-primary);
            --bs-btn-hover-bg: #0b375e; 
            --bs-btn-hover-border-color: #0b375e;
            padding: 0.6rem 1.5rem; 
        }
        .btn-outline-primary {
            --bs-btn-color: var(--bs-primary);
            --bs-btn-border-color: var(--bs-primary);
            --bs-btn-hover-color: #fff;
            --bs-btn-hover-bg: var(--bs-primary);
            --bs-btn-hover-border-color: var(--bs-primary);
        }
        .bg-accent { background-color: var(--bs-accent) !important; }
        .text-accent { color: var(--bs-accent) !important; }

        /* --- Global Layout --- */
        .main-content-box {
            max-width: 1300px; 
            margin-left: auto;
            margin-right: auto;
            background-color: var(--bs-bg-content);
            box-shadow: var(--bs-box-shadow);
        }
        
        /* --- Header & Navigation Styles --- */
        .main-header { padding-top: 15px; padding-bottom: 15px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
        .navbar-brand h1 { font-size: 1.6rem; font-weight: 700; }
        .search-btn { border-radius: 0 var(--bs-border-radius-sm) var(--bs-border-radius-sm) 0 !important; }
        .bottom-nav { border-bottom: 3px solid var(--bs-primary); box-shadow: none; }
        .nav-link { font-weight: 500; }
        .nav-tabs .nav-link.active { font-weight: 600; }


        /* --- Hero Section --- */
        .hero-split {
            border-radius: var(--bs-border-radius);
            box-shadow: var(--bs-box-shadow); 
        }
        .hero-main-image { height: 400px; }
        .hero-promo-title { font-size: 3.2rem; font-weight: 700; }
        .hero-promotion { background-color: #e9ecef; /* Neutral background for clean promo */ color: var(--bs-text-dark); }
        .promo-discount { color: var(--bs-primary); }

        /* --- Services Grid --- */
        .service-grid-card {
            border-radius: var(--bs-border-radius-sm);
            transition: all 0.3s;
        }
        .service-grid-card:hover {
            background-color: #f0f3f5; /* Subtle hover background */
            transform: scale(1.02);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        .icon-wrapper {
            background-color: var(--bs-secondary); 
            box-shadow: 0 4px 10px rgba(0, 76, 129, 0.2);
            width: 55px; 
            height: 55px;
        }
        .service-grid-icon { font-size: 1.7rem; }
        .service-grid-title { font-weight: 600; }
        
        /* --- Product Cards (High-Fidelity) --- */
        .trending-card {
            border: none;
            border-radius: var(--bs-border-radius-sm);
            box-shadow: var(--bs-card-shadow); 
            transition: all 0.3s ease;
        }
        .trending-card:hover {
            box-shadow: var(--bs-box-shadow); 
            transform: translateY(-5px); 
        }
        .trending-card .card-img-top {
            height: 190px;
            object-fit: cover;
            border-radius: var(--bs-border-radius-sm) var(--bs-border-radius-sm) 0 0;
        }
        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--bs-primary);
            line-height: 1;
        }
        .product-meta {
            font-size: 0.8rem;
            color: #7f8c8d;
            margin-top: 0.5rem;
        }
        .product-meta i {
            margin-right: 0.25rem;
            color: var(--bs-secondary);
        }

        /* --- Banner CTA --- */
        .banner-cta {
            background-color: var(--bs-primary); 
            background-image: none !important; 
            text-align: left;
            padding: 60px;
        }
        .cta-title { font-weight: 700; font-size: 3rem; }

        /* --- Newsletter Footer --- */
        .newsletter-footer {
            background-color: #34495e; 
            padding: 30px 40px;
        }
        .newsletter-footer .btn-subscribe {
            background-color: var(--bs-accent);
            color: var(--bs-text-dark);
        }

        /* --- Dark Mode Styles --- */
        body.dark-mode { background-color: #1a1a1a !important; color: #ecf0f1 !important; }
        body.dark-mode .main-content-box { background-color: #2c3e50 !important; box-shadow: 0 10px 30px rgba(255, 255, 255, 0.05); }
        body.dark-mode .top-bar, body.dark-mode .hero-promotion { background-color: #34495e !important; color: #bbb !important; border-color: #4a637c !important; }
        body.dark-mode .main-header, body.dark-mode .bottom-nav { background-color: #2c3e50 !important; border-color: #4a637c !important; }
        body.dark-mode .nav-link, body.dark-mode .text-dark, body.dark-mode .product-meta { color: #ecf0f1 !important; }
        body.dark-mode .trending-card, body.dark-mode .service-grid-card, body.dark-mode .category-banner-card, body.dark-mode .banner-body { background-color: #34495e !important; border-color: #4a637c !important; }
        body.dark-mode .trending-card:hover { box-shadow: 0 8px 15px rgba(255, 255, 255, 0.15) !important; }
        body.dark-mode .newsletter-footer { background-color: #3b7fb9 !important; }
        body.dark-mode .footer { background-color: #2c3e50 !important; }
        body.dark-mode .search-input-group .form-control, body.dark-mode .search-input-group .input-group-text { background-color: #4a637c !important; color: #ecf0f1 !important; border-color: #5d7999 !important; }
    </style>
</head>
<body>
    <div class="main-content-box">
        
        <div class="top-bar d-none d-md-block">
            <div class="container-xl">
                <div class="d-flex justify-content-between align-items-center small py-1">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-telephone-fill me-2 text-primary"></i>
                        <span class="me-4">Support: 1800-132-3218</span>
                        <i class="bi bi-shield-lock-fill me-2 text-primary"></i>
                        <span>Secure Transactions</span>
                    </div>
                    <div>
                        <a href="#" class="text-decoration-none text-muted me-3">English</a>
                        <a href="#" class="text-decoration-none text-muted">USD</a>
                    </div>
                </div>
            </div>
        </div>

        <header class="main-header border-bottom">
            <div class="container-xl">
                <div class="d-flex align-items-center justify-content-between">
                    
                    <a class="navbar-brand d-flex align-items-center me-4" href="#">
                        <i class="bi bi-building-fill me-2 text-primary" style="font-size: 2rem;"></i>
                        <h1 class="mb-0 text-primary d-none d-lg-block">Market<span class="text-dark">Place</span></h1>
                    </a>
                    
                    <form class="d-flex w-100 me-4 search-input-group" style="max-width: 650px;">
                        <div class="input-group shadow-sm rounded-pill overflow-hidden">
                            <span class="input-group-text p-0 border-0">
                                <select class="form-select border-0 shadow-none h-100 fw-bold" style="width: 150px;">
                                    <option selected>Properties</option>
                                    <option>Autos</option>
                                    <option>Jobs</option>
                                </select>
                            </span>
                            <input type="search" class="form-control shadow-none border-0" placeholder="Search Listings, Jobs, or Autos..." aria-label="Search listings">
                            <button class="btn btn-primary search-btn" type="submit">
                                <i class="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    <div class="d-flex align-items-center">
                        <a href="#" class="btn btn-outline-primary me-3 d-none d-md-block">
                             <i class="bi bi-plus-lg me-1"></i> Post Listing
                        </a>
                        <a href="#" class="text-dark text-decoration-none me-4 text-center d-none d-sm-block">
                            <i class="bi bi-person fs-5"></i><br><small>Account</small>
                        </a>
                        <a href="#" class="text-dark text-decoration-none position-relative text-center me-3">
                            <i class="bi bi-bell fs-4 text-secondary-blue"></i>
                            <span class="badge bg-accent position-absolute top-0 start-100 translate-middle rounded-pill" style="font-size: 0.7em;">7</span>
                            <small class="d-block">Alerts</small>
                        </a>
                        <button class="btn btn-link text-dark p-1 ms-3" id="modeToggle" aria-label="Toggle dark/light mode">
                            <i class="bi bi-sun" style="font-size: 1.25rem;"></i>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <nav class="bottom-nav">
            <div class="container-xl">
                <ul class="nav">
                    <li class="nav-item"><a class="nav-link text-primary" href="#">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Residential Properties</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Commercial Real Estate</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Used & New Autos</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">High-Demand Jobs</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Classifieds</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">Services Directory</a></li>
                </ul>
            </div>
        </nav>

        <main class="container-xl my-5">

            <section class="mb-5 hero-split">
                <div class="row g-0">
                    <div class="col-lg-8">
                        <div class="hero-main-image" style="background-image: url('https://picsum.photos/1000/600?random=101');">
                            <div class="hero-image-overlay"></div>
                            <div class="hero-text">
                                <span class="badge bg-accent mb-3 fw-bold p-2 text-dark">FEATURED LISTING</span>
                                <h2 class="hero-promo-title mb-2">Exclusive Modern Penthouse Living</h2>
                                <p class="lead fw-bold text-white mb-4">Prime Location in the Central Business District. Priced to Sell.</p>
                                <a href="#" class="btn btn-primary fw-bold btn-lg">VIEW DETAILS <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 d-none d-lg-block">
                        <div class="hero-promotion p-4">
                            <p class="text-uppercase fw-bold mb-0 text-primary">Limited Time Offer</p>
                            <h3 class="display-6 fw-bold mb-2">Financing as Low as</h3>
                            <div class="promo-discount mb-3 text-center">
                                <span style="font-size: 4rem;">2.99</span><span style="font-size: 2rem;">%</span>
                            </div>
                            <p class="text-center fw-medium">APR on select property loans. Subject to approval.</p>
                            <img src="https://picsum.photos/100/100?random=102" alt="Promotion Items" class="mb-3 rounded-3" style="width: 150px; height: 100px; object-fit: cover; opacity: 0.5;">
                            <a href="#" class="btn btn-secondary-blue text-white w-100 fw-bold">APPLY NOW</a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mb-5">
                <div class="d-flex flex-nowrap justify-content-between" style="overflow-x: auto; padding-bottom: 10px;">
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-1"><i class="bi bi-cash-coin service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Best Rates</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-2"><i class="bi bi-search service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Advanced Search</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-3"><i class="bi bi-people service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Dedicated Agent</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-4"><i class="bi bi-house service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">New Listings Daily</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-5"><i class="bi bi-award service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Certified Dealers</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-6"><i class="bi bi-chat-dots service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">24/7 Support</p>
                        </div>
                    </div>
                    
                    <div class="text-center service-grid-item mx-2">
                        <div class="service-grid-card round-2">
                            <div class="icon-wrapper service-7"><i class="bi bi-graph-up-arrow service-grid-icon text-white"></i></div>
                            <p class="service-grid-title mb-0">Market Analytics</p>
                        </div>
                    </div>
                    
                </div>
            </section>

            <style>
                /* NEW COLORS FOR UNIQUE SERVICE ITEMS */
                .icon-wrapper.service-1 { background-color: var(--banner-green); }
                .icon-wrapper.service-2 { background-color: var(--banner-blue); }
                .icon-wrapper.service-3 { background-color: var(--banner-purple); }
                .icon-wrapper.service-4 { background-color: var(--banner-orange); }
                .icon-wrapper.service-5 { background-color: var(--banner-coral); }
                .icon-wrapper.service-6 { background-color: #6C757D; /* Gray */ }
                .icon-wrapper.service-7 { background-color: #00ADB5; /* Teal */ }

                /* REFINED FLEX FOR SPACING */
                .service-grid-item {
                    flex: 1 1 0; /* Ensures all items take up equal minimal space and can grow */
                    max-width: 14%; /* Ensures a reasonable maximum width for each of the 7 items */
                }

                /* UPDATED: Centering and Rounded Icon Wrapper */
                .icon-wrapper {
                    background-color: var(--bs-secondary); 
                    box-shadow: 0 4px 10px rgba(227, 6, 19, 0.2); 
                    width: 55px; 
                    height: 55px;
                    /* NEW: Flexbox for perfect centering */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /* NEW: Rounded corners */
                    border-radius: 50% !important; /* Forces perfect circle */
                    margin: 0 auto 10px auto; /* Centers the icon-wrapper itself */
                }

                /* REMOVED: No border on service grid card */
                .service-grid-card {
                    border-radius: var(--bs-border-radius-sm);
                    transition: all 0.3s;
                    border: none !important; /* Explicitly remove border */
                }
            </style>



<section class="mb-5">
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
        
        <div class="col">
            <div class="category-banner-card rounded-4 shadow-sm" style="background-color: var(--banner-green);">
                <div class="banner-body p-3 text-white">
                    <p class="small fw-bold mb-1">10%-30%</p>
                    <h5 class="fw-bolder">LONG WEEKEND</h5>
                    <p class="small mb-0">SAT - MON</p>
                </div>
                <div class="banner-footer p-3 bg-white text-center rounded-bottom-4">
                    <h6 class="fw-bold mb-1 text-dark">TABLET & ACCESSORIES</h6>
                    <a href="#" class="small text-primary text-decoration-none">Shop Now <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="category-banner-card rounded-4 shadow-sm" style="background-color: var(--banner-blue);">
                <div class="banner-body p-3 text-white">
                    <p class="small fw-bold mb-1">SALE OFF 50%</p>
                    <h5 class="fw-bolder">BLACK FRIDAY</h5>
                    <p class="small mb-0">SAT - MON</p>
                </div>
                <div class="banner-footer p-3 bg-white text-center rounded-bottom-4">
                    <h6 class="fw-bold mb-1 text-dark">ELECTRONIC</h6>
                    <a href="#" class="small text-primary text-decoration-none">Shop Now <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="category-banner-card rounded-4 shadow-sm" style="background-color: var(--banner-purple);">
                <div class="banner-body p-3 text-white">
                    <p class="small fw-bold mb-1">30%-50%</p>
                    <h5 class="fw-bolder">LONG WEEKEND</h5>
                    <p class="small mb-0">SAT - MON</p>
                </div>
                <div class="banner-footer p-3 bg-white text-center rounded-bottom-4">
                    <h6 class="fw-bold mb-1 text-dark">FASHION & ACCESSORIES</h6>
                    <a href="#" class="small text-primary text-decoration-none">Shop Now <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="category-banner-card rounded-4 shadow-sm" style="background-color: var(--banner-orange);">
                <div class="banner-body p-3 text-white">
                    <p class="small fw-bold mb-1">FURNITURE DESIGN</p>
                    <h5 class="fw-bolder">BEST SALE</h5>
                    <p class="small mb-0">SAT - MON</p>
                </div>
                <div class="banner-footer p-3 bg-white text-center rounded-bottom-4">
                    <h6 class="fw-bold mb-1 text-dark">FURNITURE & DECOR</h6>
                    <a href="#" class="small text-primary text-decoration-none">Shop Now <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </div>

        <div class="col">
            <div class="category-banner-card rounded-4 shadow-sm" style="background-color: var(--banner-coral);">
                <div class="banner-body p-3 text-white">
                    <p class="small fw-bold mb-1">20%-40%</p>
                    <h5 class="fw-bolder">CLEAR TREE</h5>
                    <p class="small mb-0">SAT - MON</p>
                </div>
                <div class="banner-footer p-3 bg-white text-center rounded-bottom-4">
                    <h6 class="fw-bold mb-1 text-dark">HEALTH & BEAUTY</h6>
                    <a href="#" class="small text-primary text-decoration-none">Shop Now <i class="bi bi-arrow-right"></i></a>
                </div>
            </div>
        </div>

    </div>
</section>

            <section class="mb-5">
                <h2 class="mb-4 display-6 fw-bold">Premium Featured Listings</h2>
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    
                    <div class="col">
                        <div class="card trending-card">
                            <img src="https://picsum.photos/400/250?random=103" class="card-img-top" alt="Luxury Condo">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="badge bg-accent text-dark fw-bold">HOT DEAL</span>
                                    <span class="badge bg-primary">For Sale</span>
                                </div>
                                <h5 class="card-title fw-bold fs-6 mb-1">Luxury Waterfront Condo</h5>
                                <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Miami Beach, USA</div>
                                
                                <div class="product-meta d-flex justify-content-between">
                                    <div><i class="bi bi-house-door"></i> 3 Beds</div>
                                    <div><i class="bi bi-rulers"></i> 2,100 sqft</div>
                                    <div><i class="bi bi-car-fill"></i> 2 Garages</div>
                                </div>
                                <hr class="my-2">
                                <div class="product-price mb-0">$5,500,000</div>
                                <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">Explore Property</a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="card trending-card">
                            <img src="https://picsum.photos/400/250?random=104" class="card-img-top" alt="Electric Scooter">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="badge bg-secondary-blue text-white fw-bold">NEW LISTING</span>
                                    <span class="badge bg-primary">Auto</span>
                                </div>
                                <h5 class="card-title fw-bold fs-6 mb-1">2024 Electric Sedan Model X</h5>
                                <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Los Angeles, USA</div>
                                
                                <div class="product-meta d-flex justify-content-between">
                                    <div><i class="bi bi-speedometer"></i> 5k mi</div>
                                    <div><i class="bi bi-battery-half"></i> 300 mi range</div>
                                    <div><i class="bi bi-calendar-check"></i> Certified</div>
                                </div>
                                <hr class="my-2">
                                <div class="product-price mb-0">$85,999</div>
                                <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Vehicle</a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="card trending-card">
                            <img src="https://picsum.photos/400/250?random=105" class="card-img-top" alt="Rare Comic Book">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="badge bg-accent text-dark fw-bold">AUCTION</span>
                                    <span class="badge bg-primary">Classified</span>
                                </div>
                                <h5 class="card-title fw-bold fs-6 mb-1">Vintage Collector's Watch</h5>
                                <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Online (Ends Soon)</div>
                                
                                <div class="product-meta d-flex justify-content-between">
                                    <div><i class="bi bi-stopwatch"></i> Limited Ed.</div>
                                    <div><i class="bi bi-tags"></i> Rare Item</div>
                                    <div><i class="bi bi-hammer"></i> 25 Bids</div>
                                </div>
                                <hr class="my-2">
                                <div class="product-price mb-0">$12,000+</div>
                                <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">Place Bid</a>
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="card trending-card">
                            <img src="https://picsum.photos/400/250?random=106" class="card-img-top" alt="Marketing Manager">
                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="badge bg-secondary-blue text-white fw-bold">URGENT</span>
                                    <span class="badge bg-primary">Job</span>
                                </div>
                                <h5 class="card-title fw-bold fs-6 mb-1">Director of Finance (VP Level)</h5>
                                <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Remote/Global HQ</div>
                                
                                <div class="product-meta d-flex justify-content-between">
                                    <div><i class="bi bi-briefcase"></i> Full-Time</div>
                                    <div><i class="bi bi-clock"></i> 3 Days Left</div>
                                    <div><i class="bi bi-star"></i> Executive</div>
                                </div>
                                <hr class="my-2">
                                <div class="product-price mb-0 text-muted small">Competitive Salary</div>
                                <a href="#" class="btn btn-sm btn-primary mt-3 w-100">Apply Now</a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            
            <section class="mb-5">
                <div class="banner-cta rounded-4 shadow">
                    <div class="cta-overlay"></div>
                    <div class="cta-content row align-items-center">
                        <div class="col-md-9 text-white">
                            <h3 class="cta-title">Looking for the Perfect Home?</h3>
                            <p class="lead mb-0 fw-light">Access our exclusive database of off-market properties and get matched with a trusted agent today.</p>
                        </div>
                        <div class="col-md-3 text-end mt-4 mt-md-0">
                            <a href="#" class="btn btn-lg btn-warning fw-bold text-dark shadow-lg">
                                FIND YOUR DREAM HOME <i class="bi bi-house-heart-fill ms-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="mb-5">
                
                <h2 class="mb-4 display-6 fw-bold">Residential Properties</h2>
                
                <ul class="nav nav-tabs border-bottom-0 mb-4" id="propertyTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="sale-tab" data-bs-toggle="tab" data-bs-target="#sale-listings" type="button" role="tab" aria-controls="sale-listings" aria-selected="true">Properties For Sale</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="rental-tab" data-bs-toggle="tab" data-bs-target="#rental-listings" type="button" role="tab" aria-controls="rental-listings" aria-selected="false">Exclusive Rentals</button>
                    </li>
                </ul>

                <div class="tab-content" id="propertyTabsContent">
                    
                    <div class="tab-pane fade show active" id="sale-listings" role="tabpanel" aria-labelledby="sale-tab">
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                            <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=201" class="card-img-top" alt="Villa Sale">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-accent text-dark fw-bold">GATED</span>
                                            <span class="badge bg-primary">For Sale</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Private Country Estate</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Aspen, USA</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 6 Beds</div>
                                            <div><i class="bi bi-rulers"></i> 8,500 sqft</div>
                                            <div><i class="bi bi-car-fill"></i> 4 Garages</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$9,800,000</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=202" class="card-img-top" alt="City Apartment">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-secondary-blue text-white fw-bold">NEWLY BUILT</span>
                                            <span class="badge bg-primary">For Sale</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Luxury High-Rise Suite</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> London, UK</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 2 Beds</div>
                                            <div><i class="bi bi-rulers"></i> 1,100 sqft</div>
                                            <div><i class="bi bi-car-fill"></i> 1 Garage</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$1,450,000</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=203" class="card-img-top" alt="Land Plot">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-accent text-dark fw-bold">DEVELOPMENT</span>
                                            <span class="badge bg-primary">For Sale</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Prime Commercial Land</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Houston, USA</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-rulers"></i> 5 Acres</div>
                                            <div><i class="bi bi-bar-chart"></i> Zoning: C2</div>
                                            <div><i class="bi bi-tree"></i> Near Park</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$2,150,000</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=204" class="card-img-top" alt="Suburban Home">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-secondary-blue text-white fw-bold">POPULAR</span>
                                            <span class="badge bg-primary">For Sale</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Classic Suburban Home</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Dallas, USA</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 4 Beds</div>
                                            <div><i class="bi bi-rulers"></i> 2,800 sqft</div>
                                            <div><i class="bi bi-car-fill"></i> 2 Garages</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$720,000</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="rental-listings" role="tabpanel" aria-labelledby="rental-tab">
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                             <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=205" class="card-img-top" alt="Loft Rental">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-accent text-dark fw-bold">LOFT</span>
                                            <span class="badge bg-secondary-blue">For Rent</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Industrial Modern Loft</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Brooklyn, USA</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 1 Bed</div>
                                            <div><i class="bi bi-rulers"></i> 950 sqft</div>
                                            <div><i class="bi bi-car-fill"></i> Street Prkg</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$2,500/mo</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                             <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=206" class="card-img-top" alt="Cozy Apartment">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-secondary-blue text-white fw-bold">FURNISHED</span>
                                            <span class="badge bg-secondary-blue">For Rent</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Cozy Studio Apartment</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Paris, FR</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> Studio</div>
                                            <div><i class="bi bi-rulers"></i> 450 sqft</div>
                                            <div><i class="bi bi-clock"></i> Min 6 Mos</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$950/mo</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                             <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=207" class="card-img-top" alt="Townhouse">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-accent text-dark fw-bold">FAMILY</span>
                                            <span class="badge bg-secondary-blue">For Rent</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Modern Family Townhouse</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Sydney, AUS</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 3 Beds</div>
                                            <div><i class="bi bi-rulers"></i> 1,600 sqft</div>
                                            <div><i class="bi bi-car-fill"></i> 1 Garage</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$3,200/mo</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                             <div class="col">
                                <div class="card trending-card">
                                    <img src="https://picsum.photos/400/250?random=208" class="card-img-top" alt="Luxury Penthouse">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="badge bg-secondary-blue text-white fw-bold">PREMIER</span>
                                            <span class="badge bg-secondary-blue">For Rent</span>
                                        </div>
                                        <h5 class="card-title fw-bold fs-6 mb-1">Exclusive Sky Penthouse</h5>
                                        <div class="product-location mb-2"><i class="bi bi-geo-alt"></i> Dubai, UAE</div>
                                        <div class="product-meta d-flex justify-content-between">
                                            <div><i class="bi bi-house-door"></i> 5 Beds</div>
                                            <div><i class="bi bi-rulers"></i> 7,000 sqft</div>
                                            <div><i class="bi bi-clock"></i> Min 1 Yr</div>
                                        </div>
                                        <hr class="my-2">
                                        <div class="product-price mb-0">$6,500/mo</div>
                                        <a href="#" class="btn btn-sm btn-outline-primary mt-3 w-100">View Listing</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main> </div> <section class="newsletter-footer">
        <div class="container-xl">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-3 mb-lg-0">
                    <h5 class="fw-bold mb-1"><i class="bi bi-envelope-fill me-2 text-accent"></i> Subscribe to our Exclusive Listings</h5>
                    <p class="small opacity-75 mb-0 text-white">Get early access to premium listings and market analysis delivered weekly.</p>
                </div>
                <div class="col-lg-6">
                    <form class="d-flex">
                        <input type="email" class="form-control" placeholder="Enter your professional email address" required>
                        <button class="btn btn-subscribe" type="submit">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer bg-dark py-4"> 
        <div class="container-xl text-center text-muted">
            <p class="mb-0 text-white opacity-75">&copy; 2024 Marketplace Inc. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        document.getElementById('modeToggle').addEventListener('click', function() {
            const body = document.body;
            const icon = this.querySelector('i');

            // Toggle the main dark-mode class on the body
            body.classList.toggle('dark-mode');

            // Change the button icon and color
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
</body>
</html>