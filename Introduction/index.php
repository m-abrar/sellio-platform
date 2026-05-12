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

    <section id="automation" class="py-100 bg-automation border-top border-bottom">
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

    <section id="modules" class="py-100 bg-modules">
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

    <section class="py-100 bg-comparison border-top border-bottom">
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

    <section id="reviews" class="py-100 bg-reviews">
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

    <section id="mobile-ready" class="py-100 bg-mobile">
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