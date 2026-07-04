<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Take an interactive product tour of Sellio, the self-hosted multi-purpose marketplace platform for products, properties, services, jobs, events and more.">
<title>Sellio Interactive Product Tour | Multi-Purpose Marketplace Platform</title>
<link href="../assets/vendor/fontsource/bundle.css" rel="stylesheet">
<link href="../assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="../assets/vendor/fontawesome/css/all.min.css">
<link rel="stylesheet" href="css/product-tour.css">
</head>
<body>
<div class="fb-topbar">
    <div class="fb-brand"><img src="../images/logo-light.png" alt="Sellio"><span>Sellio Product Tour</span></div>
    <a class="fb-close" href="../index.php">&larr; Back to overview</a>
</div>

<main class="flipbook-shell" aria-label="Sellio interactive product tour">
    <button class="fb-nav fb-prev" aria-label="Previous page">&#8249;</button>
    <div class="fb-hotzone fb-hotzone-prev"></div>
    <div class="flipbook" id="flipbook">

        <!-- Page 1: Cover -->
        <article class="fb-page">
            <div class="fb-face pg-cover">
                <div class="pg-eyebrow">Production Ready &middot; v2.4.0</div>
                <img src="../images/logo-light.png" alt="Sellio">
                <div class="pg-cover-name">SELLIO</div>
                <h1>The Complete <span class="text-sellio">Multi-Purpose Marketplace</span> Platform</h1>
                <div class="pg-cover-quote">Every great marketplace starts with a single idea&hellip;</div>
            </div>
            <div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 2: Imagine -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Imagine</div>
                <div class="pg-title">One platform. <span class="text-sellio">Unlimited possibilities.</span></div>
                <p class="pg-lead">Start with your idea, then shape Sellio around the marketplace your audience needs.</p>
                <div class="pg-market-cloud">
                    <span><i class="fas fa-house"></i> Properties</span><span><i class="fas fa-briefcase"></i> Jobs</span>
                    <span><i class="fas fa-screwdriver-wrench"></i> Services</span><span><i class="fas fa-calendar-days"></i> Events</span>
                    <span><i class="fas fa-bullhorn"></i> Classifieds</span><span><i class="fas fa-bag-shopping"></i> Shopping</span><span><i class="fas fa-car"></i> Vehicles</span>
                </div>
                <a class="pg-more" href="../index.php#modules" target="_blank" rel="noopener">Explore marketplace modules <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">02</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 3: Discover -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Discover</div>
                <div class="pg-title">Describe it. <span class="text-sellio">Discover it.</span></div>
                <p class="pg-lead">Sellio transforms a natural request into an organized shortlist customers can understand and act on.</p>
                <div class="discovery-three-steps" aria-label="Three-step AI discovery process">
                    <div class="discovery-step-card step-input">
                        <span class="step-count">01</span>
                        <div class="step-circle"><i class="fas fa-keyboard"></i><i class="fas fa-microphone"></i></div>
                        <h3>Natural Input</h3>
                        <p>Customers type or speak naturally—no complicated filters required.</p>
                        <div class="input-example"><i class="fas fa-quote-left"></i><span>Two bedrooms near the city centre&hellip;</span><i class="fas fa-microphone"></i></div>
                    </div>
                    <div class="discovery-step-arrow"><span></span><i class="fas fa-arrow-right"></i></div>
                    <div class="discovery-step-card step-engine">
                        <span class="step-count">02</span>
                        <div class="step-circle ai-circle"><i class="fas fa-brain"></i><span></span></div>
                        <h3>AI Engine</h3>
                        <p>Sellio understands the intent and converts it into structured search criteria.</p>
                        <div class="engine-tags"><span>Property</span><span>2 beds</span><span>Central</span><span>Dates</span></div>
                    </div>
                    <div class="discovery-step-arrow"><span></span><i class="fas fa-arrow-right"></i></div>
                    <div class="discovery-step-card step-results">
                        <span class="step-count">03</span>
                        <div class="step-circle"><i class="fas fa-window-maximize"></i></div>
                        <h3>Website Results</h3>
                        <p>Relevant matches appear directly on the marketplace, ready to explore.</p>
                        <!-- Temporary Pexels placeholder; replace with a real Sellio result screenshot. -->
                        <div class="mini-result"><img src="images/property-interior.jpg" alt="Temporary property search result" loading="lazy"><span><small>96% match</small><b>City Apartment</b></span></div>
                    </div>
                </div>
                <a class="pg-more" href="../index.php#demos" target="_blank" rel="noopener">Explore live marketplace experiences <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">03</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 4: Connect -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Connect</div>
                <div class="pg-title">Every conversation. <span class="text-sellio">One place.</span></div>
                <p class="pg-lead">Every question, offer, and decision stays connected to the listing that started the conversation.</p>
                <div class="pg-connect-layout">
                    <div class="connect-window">
                        <div class="connect-header">
                            <div class="connect-listing-icon"><i class="fas fa-house"></i></div>
                            <div><b>Harbour View Apartment</b><span><i></i> Seller online</span></div>
                            <button type="button" aria-label="Conversation options"><i class="fas fa-ellipsis"></i></button>
                        </div>
                        <div class="connect-thread">
                            <div class="message-row buyer-message"><div class="message-avatar">AK</div><div class="message-body"><small>10:24 AM</small><p>Is this available next weekend?</p></div></div>
                            <div class="message-row seller-message"><div class="message-body"><small>10:25 AM</small><p>Yes. I can confirm those dates for you.</p></div><div class="message-avatar">SM</div></div>
                            <div class="connect-offer"><i class="fas fa-tag"></i><div><small>Offer attached</small><b>Weekend booking request</b></div><span>Review</span></div>
                        </div>
                        <div class="connect-composer"><i class="fas fa-paperclip"></i><span>Write a message&hellip;</span><button type="button" aria-label="Send message"><i class="fas fa-paper-plane"></i></button></div>
                    </div>
                    <div class="connect-outcomes">
                        <div><i class="fas fa-circle-question"></i><span><b>Ask clearly</b><small>Listing context stays visible</small></span></div>
                        <div><i class="fas fa-tag"></i><span><b>Make offers</b><small>Terms stay organized</small></span></div>
                        <div><i class="fas fa-handshake"></i><span><b>Move forward</b><small>Decisions become action</small></span></div>
                        <p><i class="fas fa-lock"></i> One private, organized thread</p>
                    </div>
                </div>
                <a class="pg-more" href="../index.php#ecosystem" target="_blank" rel="noopener">Explore the connected ecosystem <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">04</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 5: Buyer journey -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Buyer Journey</div>
                <div class="pg-title">From discovery to payment. <span class="text-sellio">Seamlessly.</span></div>
                <p class="pg-lead">One connected path supports purchases, bookings, appointments, tickets, and inquiries.</p>
                <div class="pg-journey">
                    <span><i class="fas fa-search"></i><b>Search</b></span><i class="fas fa-chevron-right"></i><span><i class="fas fa-eye"></i><b>View</b></span><i class="fas fa-chevron-right"></i>
                    <span><i class="fas fa-comment"></i><b>Chat</b></span><i class="fas fa-chevron-right"></i><span><i class="fas fa-calendar-check"></i><b>Book</b></span><i class="fas fa-chevron-right"></i><span><i class="fas fa-credit-card"></i><b>Pay</b></span>
                </div>
                <a class="pg-more" href="../index.php#demos" target="_blank" rel="noopener">See complete buyer experiences <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">05</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 6: Seller success -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Seller Success</div>
                <div class="pg-title">List faster. <span class="text-sellio">Operate with clarity.</span></div>
                <p class="pg-lead">Sellers move from publishing to daily operations without juggling disconnected tools.</p>
                <!-- Temporary Pexels placeholder; replace with a real seller-panel screenshot. -->
                <div class="pg-photo-banner"><img src="images/seller-operations.jpg" alt="Team working together at laptops as a temporary seller operations visual" loading="lazy"><span><b>From first listing</b> to everyday operations</span></div>
                <div class="pg-seller-split">
                    <div><h4><i class="fas fa-circle-plus"></i> Create</h4><span>Images</span><span>Pricing</span><span>Availability</span><span>Inventory</span></div>
                    <div><h4><i class="fas fa-chart-line"></i> Manage</h4><span>Listings</span><span>Orders</span><span>Analytics</span><span>Earnings</span></div>
                </div>
                <a class="pg-more" href="../index.php#ecosystem" target="_blank" rel="noopener">Explore seller tools <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">06</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 7: Admin control -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Admin Control</div>
                <div class="pg-title">Your marketplace. <span class="text-sellio">Under control.</span></div>
                <p class="pg-lead">Configure, moderate, monetize, and understand the platform from one administration system.</p>
                <div class="pg-control-centre"><div class="control-core"><i class="fas fa-shield-halved"></i><b>Admin</b></div><div class="control-items"><span>Users</span><span>Modules</span><span>Listings</span><span>Payments</span><span>Memberships</span><span>Reports</span></div></div>
                <a class="pg-more" href="../index.php#ecosystem" target="_blank" rel="noopener">Explore administration tools <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">07</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 8: Marketplace universe -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Marketplace Universe</div>
                <div class="pg-title">Specialized experiences. <span class="text-sellio">One connected core.</span></div>
                <div class="pg-universe"><div class="universe-core">SELLIO</div><span class="u1"><i class="fas fa-bag-shopping"></i> Shop</span><span class="u2"><i class="fas fa-house"></i> Property</span><span class="u3"><i class="fas fa-car"></i> Vehicles</span><span class="u4"><i class="fas fa-ticket"></i> Events</span><span class="u5"><i class="fas fa-briefcase"></i> Jobs</span><span class="u6"><i class="fas fa-screwdriver-wrench"></i> Services</span></div>
                <a class="pg-more" href="../index.php#modules" target="_blank" rel="noopener">Explore every marketplace module <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">08</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 9: Automation -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Automation</div>
                <div class="pg-title">Keep work moving. <span class="text-sellio">Even when you step away.</span></div>
                <p class="pg-lead">Routine marketplace events can trigger the next useful action automatically.</p>
                <div class="pg-automation-track"><div><i class="fas fa-file-circle-plus"></i><b>Listing created</b></div><i class="fas fa-arrow-right"></i><div><i class="fas fa-check-double"></i><b>Rules applied</b></div><i class="fas fa-arrow-right"></i><div><i class="fas fa-bell"></i><b>People notified</b></div><i class="fas fa-arrow-right"></i><div><i class="fas fa-rotate"></i><b>Status maintained</b></div></div>
                <a class="pg-more" href="../index.php#automation" target="_blank" rel="noopener">Explore marketplace automation <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">09</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 10: Every screen -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Every Screen</div>
                <div class="pg-title">A consistent experience, <span class="text-sellio">wherever people browse.</span></div>
                <p class="pg-lead">Sellio adapts from a detailed desktop workspace to a focused mobile journey.</p>
                <div class="pg-devices"><div class="device desktop"><div class="device-screen"><i class="fas fa-store"></i></div><span>Desktop</span></div><i class="fas fa-arrow-right"></i><div class="device tablet"><div class="device-screen"><i class="fas fa-store"></i></div><span>Tablet</span></div><i class="fas fa-arrow-right"></i><div class="device mobile"><div class="device-screen"><i class="fas fa-store"></i></div><span>Mobile</span></div></div>
                <a class="pg-more" href="../index.php#mobile-ready" target="_blank" rel="noopener">Explore the responsive experience <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">10</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 11: Built to own -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Built to Own</div>
                <div class="pg-title">Own your marketplace. <span class="text-sellio">Shape its future.</span></div>
                <p class="pg-lead">A self-hosted, multi-vertical platform with source access, data ownership, and no recurring platform subscription.</p>
                <div class="pg-ownership"><div class="rent"><small>RENTED SAAS</small><b>Recurring platform fees</b><span>Locked source</span><span>Provider-controlled roadmap</span></div><div class="own"><small>YOUR SELLIO PLATFORM</small><b>One-time license</b><span>Source-code access</span><span>Your data and deployment</span></div></div>
                <a class="pg-more" href="../index.php#comparison" target="_blank" rel="noopener">Review the ownership comparison <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">11</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 12: Technology -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Technology</div>
                <div class="pg-title">Modern tools. <span class="text-sellio">Practical architecture.</span></div>
                <div class="pg-grid pg-grid-4 pg-tech-grid"><div class="pg-card"><i class="fab fa-php"></i><h4>PHP 8.3</h4></div><div class="pg-card"><i class="fab fa-laravel"></i><h4>Laravel</h4></div><div class="pg-card"><i class="fas fa-database"></i><h4>MySQL 8</h4></div><div class="pg-card"><i class="fab fa-react"></i><h4>React</h4></div><div class="pg-card"><i class="fas fa-n"></i><h4>Next.js</h4></div><div class="pg-card"><i class="fab fa-bootstrap"></i><h4>Bootstrap</h4></div><div class="pg-card"><i class="fab fa-js"></i><h4>Alpine / ES6+</h4></div><div class="pg-card"><i class="fas fa-mobile-screen"></i><h4>Expo / RN</h4></div></div>
                <a class="pg-more" href="../index.php#technology" target="_blank" rel="noopener">View the complete technology stack <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">12</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 13: Launch journey -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Launch Journey</div>
                <div class="pg-title">From source code to <span class="text-sellio">your marketplace.</span></div>
                <p class="pg-lead">A clear setup path helps you move from purchase to a marketplace configured around your business.</p>
                <div class="pg-launch-track"><span><b>1</b>Download</span><i class="fas fa-chevron-right"></i><span><b>2</b>Install</span><i class="fas fa-chevron-right"></i><span><b>3</b>Import</span><i class="fas fa-chevron-right"></i><span><b>4</b>Configure</span><i class="fas fa-chevron-right"></i><span><b>5</b>Launch</span></div>
                <a class="pg-more" href="../index.php#how-it-works" target="_blank" rel="noopener">See how installation works <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">13</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 14: Customer proof -->
        <article class="fb-page">
            <div class="fb-face pg-story">
                <div class="pg-eyebrow">Customer Perspective</div>
                <div class="pg-title">Built for people who <span class="text-sellio">build marketplaces.</span></div>
                <div class="pg-proof-layout">
                    <!-- Temporary Pexels placeholder; replace with verified customer imagery. -->
                    <img src="images/customer-collaboration.jpg" alt="Colleagues collaborating at a laptop as temporary customer imagery" loading="lazy">
                    <div><div class="pg-quote"><p>&ldquo;The automation features saved me at least 20 hours a week in admin work.&rdquo;</p><small>John D. &mdash; Agency Owner</small></div><div class="pg-quote"><p>&ldquo;I've tried many scripts, but this is by far the cleanest code encountered.&rdquo;</p><small>Marco S. &mdash; Developer</small></div><div class="pg-quote"><p>&ldquo;The support team helped me with a custom integration fast.&rdquo;</p><small>Anna L. &mdash; Startup Founder</small></div></div>
                </div>
                <a class="pg-more" href="../index.php#reviews" target="_blank" rel="noopener">Read customer perspectives <i class="fas fa-arrow-right"></i></a>
                <div class="pg-number">14</div>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>

        <!-- Page 15: Final page -->
        <article class="fb-page">
            <div class="fb-face pg-back">
                <div class="pg-eyebrow">Ready When You Are</div>
                <div class="pg-final-kicker">One Platform. Unlimited Marketplaces.</div>
                <h2 class="pg-title">Build your next marketplace with <span class="text-sellio">Sellio.</span></h2>
                <p>Explore the live experiences, choose your direction, and start shaping the marketplace you want to launch.</p>
                <div class="pg-final-line">Build faster. Launch sooner. Grow bigger.</div>
                <a class="btn-fb" href="../index.php#demos">Explore Live Demos</a>
            </div><div class="fb-face fb-back"><div class="fb-back-mark">S</div></div>
        </article>
    </div>
    <div class="fb-hotzone fb-hotzone-next"></div>
    <button class="fb-nav fb-next" aria-label="Next page">&#8250;</button>
</main>

<div class="fb-footer"><div class="fb-progress"><div class="fb-progress-bar"></div></div><div class="fb-counter"><span id="fbCurrent">1</span> / <span id="fbTotal">15</span></div></div>
<div class="fb-hint">Use the arrows, click the page edges, or press &larr; / &rarr; to turn the page.</div>
<script src="js/product-tour.js"></script>
</body>
</html>
