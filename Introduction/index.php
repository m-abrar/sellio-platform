<?php include('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <?php include('header.php'); ?>
</head>
<body>
    <?php include('navbar.php'); ?>

    <section class="hero-section bg-hero">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 py-5">
                    <h1 class="display-3">Deploy <span id="typewriter" class="text-sellio"></span> <br>Experiences</h1>
                    <p class="lead mb-5">Launch, manage, and grow high-performance marketplaces. A self-hosted solution for business owners and agencies that eliminates recurring fees while ensuring full data ownership.</p>
                    <div class="d-flex gap-3">
                        <a href="#demos" class="btn-main">Explore 50+ Demos</a>
                        <a href="#modules" class="btn btn-outline-secondary px-4 py-3 rounded-4 fw-bold">View Industry Modules</a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <?php include('wheel.php'); ?>
                </div>
            </div>
        </div>
    </section>

    <section id="automation" class="py-100 bg-automation border-top border-bottom reveal" data-animation="animate__fadeInLeft">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-lg-5">
                    <h2 class="display-5 fw-800 mb-4">Hands-free <span class="text-sellio">Workflows</span>.</h2>
                    <p class="text-muted mb-4">Eliminate manual admin work. Our platform utilizes automatic background processes to keep your marketplace moving 24/7.</p>
                    <ul class="list-unstyled">
                        <li class="mb-3 d-flex gap-2"><span>⚡</span> <strong>Automatic Approvals:</strong> Auto-review or approve new listings.</li>
                        <li class="mb-3 d-flex gap-2"><span>🔔</span> <strong>Smart Reminders:</strong> Automated alerts and status updates.</li>
                        <li class="mb-3 d-flex gap-2"><span>📅</span> <strong>Expirations:</strong> Hands-free handling of renewals.</li>
                    </ul>
                </div>
                <div class="col-lg-7">
                    <div class="p-5 bg-white rounded-5 shadow-sm border text-center">
                        <h4 class="fw-800 mb-4">Multi-Role Performance</h4>
                        <div class="row g-3">
                            <div class="col-4"><div class="p-3 border rounded-4 small fw-bold">Admin Panel</div></div>
                            <div class="col-4"><div class="p-3 border rounded-4 small fw-bold">Seller Desk</div></div>
                            <div class="col-4"><div class="p-3 border rounded-4 small fw-bold">Buyer Desk</div></div>
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
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y shadow-premium-sm">
                        <div class="icon-box-lg bg-primary-soft text-primary mb-4 mx-auto d-flex align-items-center justify-content-center" style="width:80px; height:80px; border-radius:24px;">
                            <i class="fas fa-shield-alt fa-2x"></i>
                        </div>
                        <h4 class="fw-bold">Admin Hub</h4>
                        <p class="text-muted small">The nerve center. Manage taxes, commissions, users, and full-scale moderation with executive precision.</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y shadow-premium-sm">
                        <div class="icon-box-lg bg-success-soft text-success mb-4 mx-auto d-flex align-items-center justify-content-center" style="width:80px; height:80px; border-radius:24px;">
                            <i class="fas fa-store fa-2x"></i>
                        </div>
                        <h4 class="fw-bold">Seller Desk</h4>
                        <p class="text-muted small">Empower merchants. Advanced inventory management, dynamic pricing, and dedicated shop-fronts.</p>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="p-5 rounded-5 border bg-white h-100 transition-all hover-translate-y shadow-premium-sm">
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

    <section id="modules" class="py-100 bg-modules reveal" data-animation="animate__fadeInUp">
        <div class="container text-center">
            <h2 class="display-5 fw-800 mb-5">One core system. <span class="text-sellio">Bespoke</span> modules.</h2>
            <div class="row g-4">
                <?php foreach($industries as $ind): ?>
                    <div class="col-md-4">
                        <div class="p-4 rounded-4 border bg-white h-100 feature-card text-start shadow-sm">
                            <div class="fs-2 mb-2"><?php echo $ind['icon']; ?></div>
                            <h4 class="fw-bold"><?php echo $ind['title']; ?></h4>
                            <p class="text-muted mb-0 small"><?php echo $ind['desc']; ?></p>
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
                    <div class="p-4 border rounded-4 bg-white shadow-sm">
                        <div class="h2 fw-bold text-sellio mb-1">50+</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Market Demos</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm">
                        <div class="h2 fw-bold text-sellio mb-1">12k+</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Daily Listings</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm">
                        <div class="h2 fw-bold text-sellio mb-1">99.9%</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Uptime SLA</div>
                    </div>
                </div>
                <div class="col-md-3 col-6">
                    <div class="p-4 border rounded-4 bg-white shadow-sm">
                        <div class="h2 fw-bold text-sellio mb-1">$0</div>
                        <div class="small text-muted text-uppercase fw-bold letter-spacing-1">Monthly Fees</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-100 bg-comparison border-top border-bottom reveal" data-animation="animate__slideInUp">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="display-5 fw-800">Stop Paying <span class="text-sellio">Monthly Fees</span></h2>
                <p class="text-muted">Own your platform forever with a single payment.</p>
            </div>
            <div class="table-responsive rounded-5 border shadow-sm bg-white">
                <table class="table table-hover mb-0 align-middle">
                    <thead class="bg-light">
                        <tr>
                            <th class="p-4">Feature</th>
                            <th class="p-4">Standard SaaS</th>
                            <th class="p-4 text-sellio">Your Platform</th>
                        </tr>
                    </thead>
                    <tbody>
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
                        <div class="step-icon">📥</div>
                        <h4 class="fw-bold">Get Your Files</h4>
                        <p class="text-muted">Download the full source code immediately after purchase.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card">
                        <div class="step-number">02</div>
                        <div class="step-icon">⚙️</div>
                        <h4 class="fw-bold">Quick Install</h4>
                        <p class="text-muted">Run our automated 1-click installation wizard in seconds.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card active">
                        <div class="step-number">03</div>
                        <div class="step-icon">🚀</div>
                        <h4 class="fw-bold">Import & Go</h4>
                        <p class="text-muted">Import your favorite demo and start onboarding sellers.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="intelligence" class="py-100 reveal" data-animation="animate__fadeIn">
        <div class="container">
            <div class="row align-items-center g-5">
                <div class="col-lg-6">
                    <h6 class="text-sellio fw-bold text-uppercase mb-3">Data-Driven Insights</h6>
                    <h2 class="display-5 fw-800 mb-4">Marketplace <br><span class="text-sellio">Intelligence</span></h2>
                    <p class="lead text-muted mb-5">Gain absolute visibility into your commercial ecosystem. Monitor every transaction, lead, and user interaction in real-time.</p>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box-sm bg-sellio-solid rounded-circle d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                    <i class="fas fa-chart-line text-white small"></i>
                                </div>
                                <div class="fw-bold small uppercase letter-spacing-1">Predictive Analytics</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex align-items-center gap-3">
                                <div class="icon-box-sm bg-sellio-solid rounded-circle d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                    <i class="fas fa-piggy-bank text-white small"></i>
                                </div>
                                <div class="fw-bold small uppercase letter-spacing-1">Revenue Tracking</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="p-4 bg-white rounded-5 shadow-premium border reveal" data-animation="animate__zoomIn">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold mb-0">Ecosystem Performance</h5>
                            <span class="badge bg-success-soft text-success rounded-pill px-3">Live Feed</span>
                        </div>
                        <div class="chart-mockup d-flex align-items-end gap-2 justify-content-between mb-4" style="height: 200px;">
                            <div class="bg-light w-100 rounded-3" style="height: 40%;"></div>
                            <div class="bg-sellio-solid w-100 rounded-3" style="height: 70%;"></div>
                            <div class="bg-light w-100 rounded-3" style="height: 30%;"></div>
                            <div class="bg-sellio-solid w-100 rounded-3" style="height: 90%;"></div>
                            <div class="bg-light w-100 rounded-3" style="height: 50%;"></div>
                            <div class="bg-sellio-solid w-100 rounded-3" style="height: 100%;"></div>
                        </div>
                        <div class="d-flex justify-content-around text-center mt-3">
                            <div><div class="h6 fw-bold mb-0">94k</div><small class="text-muted smallest uppercase">Sales</small></div>
                            <div><div class="h6 fw-bold mb-0">1.2m</div><small class="text-muted smallest uppercase">Traffic</small></div>
                            <div><div class="h6 fw-bold mb-0">8.4k</div><small class="text-muted smallest uppercase">Leads</small></div>
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
                        <span class="fs-4 fw-bold text-dark">4.95 / 5.0</span>
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
                            <div class="avatar-circle">JD</div>
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
                            <div class="avatar-circle">MS</div>
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
                            <div class="avatar-circle">AL</div>
                            <div><h6 class="mb-0 fw-bold">Anna L.</h6><small class="text-muted">Startup Founder</small></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="faq" class="py-100 bg-faq">
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