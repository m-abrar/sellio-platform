<?php include('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include('header.php'); ?>
</head>
<body>
    <?php include('navbar.php'); ?>

    <section class="hero-section bg-hero position-relative overflow-hidden pb-0">
        <div class="hero-bg-accent position-absolute top-0 end-0 opacity-10">
            <svg width="800" height="800" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="300" cy="300" r="300" fill="url(#hero-grad)"/>
                <defs><radialGradient id="hero-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 300) rotate(90) scale(300)"><stop stop-color="#76c043"/><stop offset="1" stop-color="#76c043" stop-opacity="0"/></radialGradient></defs>
            </svg>
        </div>
        <div class="container position-relative z-1">
            <div class="row align-items-center">
                <div class="col-lg-6 py-5">
                    <div class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-4 animate__animated animate__fadeInDown shadow-sm">PRODUCTION READY v2.4</div>
                    <h1 class="display-3 fw-800">Deploy <span id="typewriter" class="text-sellio"></span> <br>Experiences</h1>
                    <p class="lead mb-5 opacity-75">Launch, manage, and grow high-performance marketplaces. A self-hosted solution that eliminates recurring fees while ensuring full data ownership.</p>
                    <div class="d-flex gap-3 animate__animated animate__fadeInUp">
                        <a href="#demos" class="btn-main shadow-executive">Explore 50+ Demos</a>
                        <a href="#modules" class="btn-premium-outline">Industry Modules</a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <?php include('wheel.php'); ?>
                </div>
            </div>
        </div>
    </section>

    <section id="automation" class="py-100 bg-automation border-bottom reveal position-relative" data-animation="animate__fadeIn">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-lg-5">
                    <h6 class="text-sellio fw-bold text-uppercase mb-3">Workflow Orchestration</h6>
                    <h2 class="display-5 fw-800 mb-4">Hands-free <span class="text-sellio">Workflows</span>.</h2>
                    <p class="text-muted mb-5">Eliminate manual admin work. Our platform utilizes automatic background processes to keep your marketplace moving 24/7.</p>
                    <div class="automation-steps">
                        <div class="d-flex gap-3 mb-4">
                            <div class="step-icon-sm bg-white shadow-sm rounded-3 d-flex align-items-center justify-content-center" style="width:48px; height:48px; min-width:48px;">
                                <i class="fas fa-bolt text-warning"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Automatic Approvals</h6>
                                <p class="small text-muted mb-0">Auto-review or approve new listings based on your custom rule-set.</p>
                            </div>
                        </div>
                        <div class="d-flex gap-3 mb-4">
                            <div class="step-icon-sm bg-white shadow-sm rounded-3 d-flex align-items-center justify-content-center" style="width:48px; height:48px; min-width:48px;">
                                <i class="fas fa-bell text-primary"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Smart Reminders</h6>
                                <p class="small text-muted mb-0">Automated alerts and status updates sent via email and in-app notifications.</p>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <div class="step-icon-sm bg-white shadow-sm rounded-3 d-flex align-items-center justify-content-center" style="width:48px; height:48px; min-width:48px;">
                                <i class="fas fa-calendar-check text-success"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Expiration Handling</h6>
                                <p class="small text-muted mb-0">Hands-free handling of renewals and listing expirations.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="p-5 bg-white rounded-5 shadow-executive border text-center position-relative overflow-hidden nexus-container">
                        <div class="position-absolute top-0 start-0 w-100 h-2 bg-sellio-solid"></div>
                        
                        <h4 class="fw-800 mb-2">Multi-Role Performance</h4>
                        <p class="text-muted small mb-5">One unified core engine powering three distinct commercial experiences.</p>

                        <div class="row g-4 position-relative">
                            <!-- Connectivity Line (CSS) -->
                            <div class="nexus-line"></div>

                            <div class="col-4">
                                <div class="persona-node p-4 border rounded-4 transition-all" data-role="admin">
                                    <div class="icon-circle bg-primary-soft text-primary mb-3 mx-auto">
                                        <i class="fas fa-shield-halved"></i>
                                    </div>
                                    <div class="fw-800 smallest text-uppercase mb-2">Admin</div>
                                    <div class="persona-power small text-muted">Full Control</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="persona-node p-4 border rounded-4 transition-all" data-role="seller">
                                    <div class="icon-circle bg-success-soft text-success mb-3 mx-auto">
                                        <i class="fas fa-store"></i>
                                    </div>
                                    <div class="fw-800 smallest text-uppercase mb-2">Seller</div>
                                    <div class="persona-power small text-muted">Global Sales</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="persona-node p-4 border rounded-4 transition-all" data-role="buyer">
                                    <div class="icon-circle bg-info-soft text-info mb-3 mx-auto">
                                        <i class="fas fa-shopping-cart"></i>
                                    </div>
                                    <div class="fw-800 smallest text-uppercase mb-2">Buyer</div>
                                    <div class="persona-power small text-muted">Instant Buy</div>
                                </div>
                            </div>
                        </div>

                        <!-- Dynamic Role Description -->
                        <div class="mt-5 p-4 rounded-4 bg-light border-dashed role-detail-box">
                            <div id="role-text" class="small fw-bold text-sellio">Hover over a role to explore its core capabilities.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="ecosystem" class="py-100 bg-light reveal" data-animation="animate__fadeIn">
        <div class="container text-center">
            <h6 class="text-sellio fw-bold text-uppercase mb-3">Holistic Architecture</h6>
            <h2 class="display-5 fw-800 mb-5">The <span class="text-sellio">360°</span> Ecosystem</h2>
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y hover-border-sellio shadow-premium-sm">
                        <div class="icon-box-lg bg-primary-soft text-primary mb-4 mx-auto d-flex align-items-center justify-content-center" style="width:80px; height:80px; border-radius:24px;">
                            <i class="fas fa-shield-alt fa-2x"></i>
                        </div>
                        <h4 class="fw-bold">Admin Hub</h4>
                        <p class="text-muted small">The nerve center. Manage taxes, commissions, users, and full-scale moderation with executive precision.</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y hover-border-sellio shadow-premium-sm">
                        <div class="icon-box-lg bg-success-soft text-success mb-4 mx-auto d-flex align-items-center justify-content-center" style="width:80px; height:80px; border-radius:24px;">
                            <i class="fas fa-store fa-2x"></i>
                        </div>
                        <h4 class="fw-bold">Seller Desk</h4>
                        <p class="text-muted small">Empower merchants. Advanced inventory management, dynamic pricing, and dedicated shop-fronts.</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y hover-border-sellio shadow-premium-sm">
                        <div class="icon-box-lg bg-info-soft text-info mb-4 mx-auto d-flex align-items-center justify-content-center" style="width:80px; height:80px; border-radius:24px;">
                            <i class="fas fa-shopping-bag fa-2x"></i>
                        </div>
                        <h4 class="fw-bold">Buyer Experience</h4>
                        <p class="text-muted small">Convert visitors. AI-driven searches, seamless checkouts, and premium tracking interfaces.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <style>
        .bg-primary-soft { background-color: rgba(13, 110, 253, 0.05); }
        .bg-success-soft { background-color: rgba(25, 135, 84, 0.05); }
        .bg-info-soft { background-color: rgba(13, 202, 240, 0.05); }
    </style>

    <section id="modules" class="py-100 position-relative reveal" data-animation="animate__fadeInUp">
        <div class="bg-light-pattern position-absolute top-0 start-0 w-100 h-100" style="z-index: -1;"></div>
        <div class="container text-center">
            <h2 class="display-5 fw-800 mb-5">One core system. <span class="text-sellio">Bespoke</span> modules.</h2>
            <div class="row g-4">
                <?php foreach($industries as $ind): ?>
                    <div class="<?php echo $ind['size']; ?>">
                        <div class="p-5 rounded-5 card-luxury h-100 feature-card text-start position-relative overflow-hidden">
                            <!-- Decorative Glow -->
                            <div class="ambient-glow" style="background: <?php echo $ind['color']; ?>;"></div>
                            
                            <div class="icon-box-lg mb-4 d-flex align-items-center justify-content-center" style="width:70px; height:70px; border-radius:20px; background: <?php echo $ind['color']; ?>15; color: <?php echo $ind['color']; ?>;">
                                <i class="<?php echo $ind['icon']; ?> fs-2"></i>
                            </div>
                            
                            <h3 class="fw-800 mb-3"><?php echo $ind['title']; ?></h3>
                            <p class="text-muted mb-4 lead-sm"><?php echo $ind['desc']; ?></p>
                            
                            <!-- Capability Pills -->
                            <div class="d-flex flex-wrap gap-2 mb-4">
                                <?php foreach($ind['features'] as $feature): ?>
                                    <span class="feature-pill"><?php echo $feature; ?></span>
                                <?php endforeach; ?>
                            </div>

                            <div class="mt-auto d-flex align-items-center gap-2">
                                <?php if(isset($ind['tag'])): ?>
                                    <span class="badge rounded-pill px-3 py-2 small fw-bold" style="background: <?php echo $ind['color']; ?>10; color: <?php echo $ind['color']; ?>;"><?php echo $ind['tag']; ?></span>
                                <?php endif; ?>
                            </div>

                            <!-- Hover Interaction -->
                            <div class="hover-arrow">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <section class="py-100 bg-comparison border-top border-bottom reveal" data-animation="animate__fadeIn">
        <div class="container text-center mb-5">
            <h2 class="display-5 fw-800 mb-5">Intelligence & <span class="text-sellio">Scale</span></h2>
            <div class="row g-4">
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                        <div class="h2 fw-bold text-sellio mb-1">50+</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Market Demos</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                        <div class="h2 fw-bold text-sellio mb-1">12k+</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Daily Listings</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                        <div class="h2 fw-bold text-sellio mb-1">99.9%</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Uptime SLA</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                        <div class="h2 fw-bold text-sellio mb-1">$0</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Monthly Fees</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="comparison" class="py-100 bg-comparison border-top border-bottom reveal" data-animation="animate__slideInUp">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-800">Stop Paying <span class="text-sellio">Monthly Fees</span></h2>
                <p class="text-muted">Own your platform forever with a single payment.</p>
            </div>
            <div class="table-responsive rounded-5 border-0 shadow-executive bg-white p-2">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr class="border-0">
                            <th class="p-4 rounded-start-4">Feature</th>
                            <th class="p-4">Standard SaaS</th>
                            <th class="p-4 text-sellio rounded-end-4">Your Platform</th>
                        </tr>
                    </thead>
                    <tbody class="border-top-0">
                        <tr><td class="p-4 fw-bold">Upfront Cost</td><td class="p-4">$0</td><td class="p-4">One-time License</td></tr>
                        <tr><td class="p-4 fw-bold">Monthly Subscription</td><td class="p-4 text-danger">$99 - $500+</td><td class="p-4 text-success">$0 (Forever)</td></tr>
                        <tr><td class="p-4 fw-bold">Source Code Access</td><td class="p-4">Locked</td><td class="p-4 text-success">100% Full Access</td></tr>
                        <tr><td class="p-4 fw-bold">Data Ownership</td><td class="p-4">Proprietary</td><td class="p-4 text-success">You own everything</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <section id="how-it-works" class="py-100 bg-features">
        <div class="container text-center">
            <h2 class="display-5 fw-800 mb-2">3 Steps to <span class="text-sellio">Profit</span></h2>
            <p class="text-muted mb-5 lead">Launch your marketplace in minutes, not months.</p>
            <div class="row g-5">
                <div class="col-md-4">
                    <div class="step-card">
                        <div class="step-number">01</div>
                        <div class="step-icon text-sellio"><i class="fas fa-cloud-download-alt"></i></div>
                        <h4 class="fw-bold">Get Your Files</h4>
                        <p class="text-muted">Download the full source code immediately after purchase.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card">
                        <div class="step-number">02</div>
                        <div class="step-icon text-sellio"><i class="fas fa-screwdriver-wrench"></i></div>
                        <h4 class="fw-bold">Quick Install</h4>
                        <p class="text-muted">Run our automated 1-click installation wizard in seconds.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card active">
                        <div class="step-number">03</div>
                        <div class="step-icon text-sellio"><i class="fas fa-rocket"></i></div>
                        <h4 class="fw-bold">Import & Go</h4>
                        <p class="text-muted">Import your favorite demo and start onboarding sellers.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="intelligence" class="py-100 position-relative overflow-hidden reveal" data-animation="animate__fadeIn">
        <!-- Background Data Grid -->
        <div class="position-absolute top-0 start-0 w-100 h-100 opacity-05" style="background-image: radial-gradient(#76c043 1px, transparent 1px); background-size: 30px 30px; pointer-events: none;"></div>

        <div class="container position-relative">
            <div class="row align-items-center g-5">
                <div class="col-lg-6">
                    <div class="badge bg-sellio-solid rounded-pill px-3 py-2 mb-3">PERFORMANCE ARCHITECTURE</div>
                    <h2 class="display-5 fw-800 mb-4">Intelligence & <span class="text-sellio">Scale</span></h2>
                    <p class="text-muted lead mb-5">Sellio is engineered for high-volume marketplaces. Built on a performance-first architecture that handles millions of listings without breaking a sweat.</p>
                    
                    <div class="row g-4">
                        <div class="col-6">
                            <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <div class="h2 fw-800 text-sellio mb-0 data-font">50+</div>
                                    <i class="fas fa-chart-line text-muted opacity-25"></i>
                                </div>
                                <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Market Demos</div>
                                <div class="mt-2 progress" style="height: 4px;">
                                    <div class="progress-bar bg-sellio-solid" style="width: 85%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <div class="h2 fw-800 text-sellio mb-0 data-font">12k+</div>
                                    <i class="fas fa-bolt text-muted opacity-25"></i>
                                </div>
                                <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Daily Listings</div>
                                <div class="mt-2 progress" style="height: 4px;">
                                    <div class="progress-bar bg-sellio-solid" style="width: 60%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <div class="h2 fw-800 text-sellio mb-0 data-font">99.9<small>%</small></div>
                                    <i class="fas fa-server text-muted opacity-25"></i>
                                </div>
                                <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Uptime SLA</div>
                                <div class="mt-2 progress" style="height: 4px;">
                                    <div class="progress-bar bg-sellio-solid" style="width: 99%"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="p-4 border rounded-4 bg-white shadow-sm transition-all hover-translate-y hover-border-sellio">
                                <div class="d-flex align-items-center justify-content-between mb-2">
                                    <div class="h2 fw-800 text-sellio mb-0 data-font">$0</div>
                                    <i class="fas fa-coins text-muted opacity-25"></i>
                                </div>
                                <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Monthly Fees</div>
                                <div class="mt-2 progress" style="height: 4px;">
                                    <div class="progress-bar bg-sellio-solid" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="dashboard-mockup p-4 p-md-5 rounded-5 border shadow-executive bg-white position-relative">
                        <!-- Glass Top Bar -->
                        <div class="d-flex justify-content-between align-items-center mb-5">
                            <div>
                                <h5 class="fw-800 mb-0">Global Listings Feed</h5>
                                <div class="d-flex align-items-center gap-2">
                                    <span class="pulsate-dot"></span>
                                    <small class="text-muted fw-bold">LIVE ACTIVITY</small>
                                </div>
                            </div>
                            <div class="dropdown">
                                <button class="btn btn-light btn-sm rounded-pill px-3">Last 24h</button>
                            </div>
                        </div>

                        <!-- Enhanced Chart -->
                        <div class="chart-mockup d-flex align-items-end gap-3 justify-content-between mb-5" style="height: 250px;">
                            <div class="chart-bar bg-light w-100 rounded-3" style="height: 40%;"></div>
                            <div class="chart-bar bg-sellio-solid w-100 rounded-3" style="height: 70%;"></div>
                            <div class="chart-bar bg-light w-100 rounded-3" style="height: 30%;"></div>
                            <div class="chart-bar bg-sellio-solid pulsate-bar w-100 rounded-3" style="height: 95%;"></div>
                            <div class="chart-bar bg-light w-100 rounded-3" style="height: 50%;"></div>
                            <div class="chart-bar bg-sellio-solid w-100 rounded-3" style="height: 80%;"></div>
                            <div class="chart-bar bg-light w-100 rounded-3" style="height: 40%;"></div>
                        </div>

                        <!-- Stats Footer -->
                        <div class="row g-3 text-center pt-4 border-top">
                            <div class="col-4 border-end">
                                <div class="h5 fw-800 mb-0 data-font">942.8k</div>
                                <small class="text-muted smallest uppercase fw-bold">Total Sales</small>
                            </div>
                            <div class="col-4 border-end">
                                <div class="h5 fw-800 mb-0 data-font">1.24m</div>
                                <small class="text-muted smallest uppercase fw-bold">Visitors</small>
                            </div>
                            <div class="col-4">
                                <div class="h5 fw-800 mb-0 data-font">8.4k</div>
                                <small class="text-muted smallest uppercase fw-bold">New Leads</small>
                            </div>
                        </div>

                        <!-- Floating Badge -->
                        <div class="position-absolute top-0 start-0 translate-middle-y bg-white border shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-2" style="margin-left: 50px;">
                            <i class="fas fa-check-circle text-success"></i>
                            <span class="smallest fw-800 text-uppercase">Enterprise Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="reviews" class="py-100 bg-reviews reveal" data-animation="animate__fadeInUp">
        <div class="container">
            <div class="row align-items-end mb-5">
                <div class="col-lg-6 text-start">
                    <h2 class="display-5 fw-800">Trusted by <span class="text-sellio">Thousands</span>.</h2>
                    <p class="text-muted lead">Join 5,000+ business owners building on our core system.</p>
                </div>
                <div class="col-lg-6 text-md-end pb-2">
                    <div class="d-inline-flex align-items-center gap-2 bg-light p-3 rounded-4 border">
                        <span class="fs-4 fw-bold">4.95 / 5.0</span>
                        <div class="text-warning fs-5">★★★★★</div>
                        <span class="small text-muted border-start ps-2">Average Rating</span>
                    </div>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="review-card">
                        <div class="d-flex gap-2 text-warning mb-3">★★★★★</div>
                        <p class="review-text">"The automation features saved me at least 20 hours a week in admin work."</p>
                        <hr>
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-circle bg-sellio-solid text-white fw-bold d-flex align-items-center justify-content-center mb-3" style="width:50px; height:50px; border-radius:50%; font-size: 1.2rem;">JD</div>
                            <div><h6 class="mb-0 fw-bold">John D.</h6><small class="text-muted">Agency Owner</small></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="review-card highlighted">
                        <div class="d-flex gap-2 text-warning mb-3">★★★★★</div>
                        <p class="review-text">"I've tried many scripts, but this is by far the cleanest code encountered."</p>
                        <hr>
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center mb-3" style="width:50px; height:50px; border-radius:50%; font-size: 1.2rem;">MS</div>
                            <div><h6 class="mb-0 fw-bold">Marco S.</h6><small class="text-muted">Developer</small></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="review-card">
                        <div class="d-flex gap-2 text-warning mb-3">★★★★★</div>
                        <p class="review-text">"The support team is incredible. Helped me with a custom integration fast!"</p>
                        <hr>
                        <div class="d-flex align-items-center gap-3">
                            <div class="avatar-circle bg-info text-white fw-bold d-flex align-items-center justify-content-center mb-3" style="width:50px; height:50px; border-radius:50%; font-size: 1.2rem;">AL</div>
                            <div><h6 class="mb-0 fw-bold">Anna L.</h6><small class="text-muted">Startup Founder</small></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="faq" class="py-100 bg-white">
        <?php include('faqs.php'); ?>
    </section>

    <section id="mobile-ready" class="py-100 bg-mobile reveal" data-animation="animate__fadeInRight">
        <?php include('mobile-ready.php'); ?>
    </section>
    
    <section class="py-100 bg-tech-stack">
        <?php include('tech-stack.php'); ?>
    </section>

    <section id="demos" class="py-100 bg-demos">
        <?php include('demos.php'); ?>
    </section>

    <?php include('footer.php'); ?>
    <?php include('popup-exit-intent.php'); ?>
    <?php include('floating-buy-bar.php'); ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
</body>
</html>