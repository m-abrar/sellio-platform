@extends('frontend._layouts._app')

@section('title', __('Frequently Asked Questions'))
@section('meta_description', __('Find answers to common questions about buying, selling, and using the marketplace.'))
@section('body_class', 'has-body-glow bg-light frontend-page--faq')

@section('hero')
<section class="page-hero-strip">
    <div class="container-xl">
        <div class="row align-items-center g-4">
            <div class="col-lg-7" data-aos="fade-right">
                <div class="hero-eyebrow mb-3">
                    <span class="hero-eyebrow__line" aria-hidden="true"></span>
                    {{ __('Help Center') }}
                </div>
                <h1 class="page-hero-title mb-3">{{ __('Frequently Asked') }} <span class="text-primary">{{ __('Questions') }}</span></h1>
                <p class="page-hero-subtitle mb-0">{{ __('Everything you need to know about the marketplace. Can\'t find what you\'re looking for? Reach out to our support team.') }}</p>
            </div>
            <div class="col-lg-5 d-none d-lg-flex justify-content-end" data-aos="fade-left">
                <div class="page-hero-icon-wrap">
                    <i class="bi bi-question-circle-fill page-hero-icon" aria-hidden="true"></i>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section('content')
<x-frontend.page-shell variant="faq">

    {{-- Category nav pills --}}
    <div class="d-flex flex-wrap gap-2 mb-5" data-aos="fade-up">
        <button class="btn btn-sm btn-primary rounded-pill px-4 faq-filter-btn active" data-filter="all">{{ __('All') }}</button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-4 faq-filter-btn" data-filter="general">{{ __('General') }}</button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-4 faq-filter-btn" data-filter="buyers">{{ __('Buyers') }}</button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-4 faq-filter-btn" data-filter="sellers">{{ __('Sellers') }}</button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-4 faq-filter-btn" data-filter="payments">{{ __('Payments') }}</button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-4 faq-filter-btn" data-filter="account">{{ __('Account') }}</button>
    </div>

    <div class="row g-4 g-lg-5">
        <div class="col-lg-8">

            {{-- General --}}
            <div class="faq-group mb-4" data-group="general" data-aos="fade-up">
                <h2 class="faq-group-title">
                    <i class="bi bi-info-circle-fill me-2 text-primary"></i>{{ __('General') }}
                </h2>
                <div class="accordion faq-accordion" id="faqGeneral">

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-g1">
                                {{ __('What is this marketplace?') }}
                            </button>
                        </h3>
                        <div id="faq-g1" class="accordion-collapse collapse" data-bs-parent="#faqGeneral">
                            <div class="accordion-body text-muted">
                                {{ __('Our marketplace is a multi-vertical platform where you can buy, sell, rent, and discover listings across real estate, vehicles, events, services, jobs, classifieds, and products — all in one place.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-g2">
                                {{ __('Is it free to browse listings?') }}
                            </button>
                        </h3>
                        <div id="faq-g2" class="accordion-collapse collapse" data-bs-parent="#faqGeneral">
                            <div class="accordion-body text-muted">
                                {{ __('Yes — browsing, searching, and viewing listing details is completely free. You only need an account to contact sellers, make bookings, or post listings.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-g3">
                                {{ __('Which categories are available?') }}
                            </button>
                        </h3>
                        <div id="faq-g3" class="accordion-collapse collapse" data-bs-parent="#faqGeneral">
                            <div class="accordion-body text-muted">
                                {{ __('The marketplace supports Properties (sale & rental), Vehicles, Products, Services, Jobs, Events, and Classifieds. Categories are managed by the platform administrator and may vary.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-g4">
                                {{ __('How do I report a suspicious listing?') }}
                            </button>
                        </h3>
                        <div id="faq-g4" class="accordion-collapse collapse" data-bs-parent="#faqGeneral">
                            <div class="accordion-body text-muted">
                                {{ __('If you encounter a listing that looks suspicious or fraudulent, please use the "Report" option on the listing page or contact our support team directly. We review all reports within 24 hours.') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Buyers --}}
            <div class="faq-group mb-4" data-group="buyers" data-aos="fade-up" data-aos-delay="50">
                <h2 class="faq-group-title">
                    <i class="bi bi-bag-check-fill me-2 text-primary"></i>{{ __('Buyers') }}
                </h2>
                <div class="accordion faq-accordion" id="faqBuyers">

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-b1">
                                {{ __('How do I make a booking or purchase?') }}
                            </button>
                        </h3>
                        <div id="faq-b1" class="accordion-collapse collapse" data-bs-parent="#faqBuyers">
                            <div class="accordion-body text-muted">
                                {{ __('Find a listing you\'re interested in, click through to the detail page, and follow the booking or purchase flow. For properties you\'ll select dates; for events you\'ll choose tickets; for products you\'ll add to cart.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-b2">
                                {{ __('Can I cancel a booking?') }}
                            </button>
                        </h3>
                        <div id="faq-b2" class="accordion-collapse collapse" data-bs-parent="#faqBuyers">
                            <div class="accordion-body text-muted">
                                {{ __('Cancellation policies vary by listing type and seller. Property and event bookings may be eligible for a refund depending on the cancellation window. Check the specific listing\'s policy or contact the seller directly.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-b3">
                                {{ __('How do I contact a seller?') }}
                            </button>
                        </h3>
                        <div id="faq-b3" class="accordion-collapse collapse" data-bs-parent="#faqBuyers">
                            <div class="accordion-body text-muted">
                                {{ __('Each listing page has a "Send Message" or "Contact" button. You need a free buyer account to send messages. Responses are delivered to your buyer dashboard inbox.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-b4">
                                {{ __('Is my personal information safe?') }}
                            </button>
                        </h3>
                        <div id="faq-b4" class="accordion-collapse collapse" data-bs-parent="#faqBuyers">
                            <div class="accordion-body text-muted">
                                {{ __('Yes. We take data privacy seriously and never sell your personal information to third parties. All transactions use encrypted connections. See our Privacy Policy for full details.') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Sellers --}}
            <div class="faq-group mb-4" data-group="sellers" data-aos="fade-up" data-aos-delay="100">
                <h2 class="faq-group-title">
                    <i class="bi bi-shop-window me-2 text-primary"></i>{{ __('Sellers & Partners') }}
                </h2>
                <div class="accordion faq-accordion" id="faqSellers">

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-s1">
                                {{ __('How do I become a seller?') }}
                            </button>
                        </h3>
                        <div id="faq-s1" class="accordion-collapse collapse" data-bs-parent="#faqSellers">
                            <div class="accordion-body text-muted">
                                {{ __('Click "Post Listing" in the navigation and register for a partner/seller account. After your application is reviewed and approved, you can access the seller dashboard and start posting listings.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-s2">
                                {{ __('Are there fees for listing?') }}
                            </button>
                        </h3>
                        <div id="faq-s2" class="accordion-collapse collapse" data-bs-parent="#faqSellers">
                            <div class="accordion-body text-muted">
                                {{ __('Sellers access the platform through subscription plans. Plans may vary in listing quotas, feature access, and commission rates. View available plans in the seller dashboard after registration.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-s3">
                                {{ __('How do I receive payments?') }}
                            </button>
                        </h3>
                        <div id="faq-s3" class="accordion-collapse collapse" data-bs-parent="#faqSellers">
                            <div class="accordion-body text-muted">
                                {{ __('Payments collected via the marketplace are credited to your seller wallet. You can withdraw your balance via the available payout methods in your seller dashboard settings.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-s4">
                                {{ __('How long until my listing goes live?') }}
                            </button>
                        </h3>
                        <div id="faq-s4" class="accordion-collapse collapse" data-bs-parent="#faqSellers">
                            <div class="accordion-body text-muted">
                                {{ __('New listings enter a review queue and are typically approved within a few hours. You\'ll receive a notification when your listing is approved and live. Listings that violate our guidelines will be declined with feedback.') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Payments --}}
            <div class="faq-group mb-4" data-group="payments" data-aos="fade-up" data-aos-delay="150">
                <h2 class="faq-group-title">
                    <i class="bi bi-credit-card-fill me-2 text-primary"></i>{{ __('Payments') }}
                </h2>
                <div class="accordion faq-accordion" id="faqPayments">

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-p1">
                                {{ __('What payment methods are accepted?') }}
                            </button>
                        </h3>
                        <div id="faq-p1" class="accordion-collapse collapse" data-bs-parent="#faqPayments">
                            <div class="accordion-body text-muted">
                                {{ __('We accept all major credit and debit cards (Visa, Mastercard, American Express) via Stripe. Payment availability may vary by region.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-p2">
                                {{ __('Is my payment information secure?') }}
                            </button>
                        </h3>
                        <div id="faq-p2" class="accordion-collapse collapse" data-bs-parent="#faqPayments">
                            <div class="accordion-body text-muted">
                                {{ __('All payments are processed by Stripe, a PCI-DSS Level 1 certified payment processor. We never store your full card details on our servers.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-p3">
                                {{ __('When will I see a charge on my statement?') }}
                            </button>
                        </h3>
                        <div id="faq-p3" class="accordion-collapse collapse" data-bs-parent="#faqPayments">
                            <div class="accordion-body text-muted">
                                {{ __('Charges appear on your statement immediately upon successful payment. For bookings, payment is captured at time of booking. You\'ll receive a confirmation email with the transaction reference.') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- Account --}}
            <div class="faq-group mb-4" data-group="account" data-aos="fade-up" data-aos-delay="200">
                <h2 class="faq-group-title">
                    <i class="bi bi-person-fill me-2 text-primary"></i>{{ __('Account') }}
                </h2>
                <div class="accordion faq-accordion" id="faqAccount">

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-a1">
                                {{ __('How do I reset my password?') }}
                            </button>
                        </h3>
                        <div id="faq-a1" class="accordion-collapse collapse" data-bs-parent="#faqAccount">
                            <div class="accordion-body text-muted">
                                {{ __('Click "Forgot password?" on the login page and enter your email address. We\'ll send you a password reset link that expires in 60 minutes.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-a2">
                                {{ __('Can I have both a buyer and seller account?') }}
                            </button>
                        </h3>
                        <div id="faq-a2" class="accordion-collapse collapse" data-bs-parent="#faqAccount">
                            <div class="accordion-body text-muted">
                                {{ __('Yes. You can register as a buyer and later apply to become a partner/seller from your dashboard. The two roles are managed separately with their own portals.') }}
                            </div>
                        </div>
                    </div>

                    <div class="accordion-item faq-item">
                        <h3 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-a3">
                                {{ __('How do I delete my account?') }}
                            </button>
                        </h3>
                        <div id="faq-a3" class="accordion-collapse collapse" data-bs-parent="#faqAccount">
                            <div class="accordion-body text-muted">
                                {{ __('Account deletion requests can be submitted by contacting support. Active listings, pending bookings, and unsettled wallet balances must be resolved before deletion.') }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        {{-- Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top:100px">

                {{-- Still have questions --}}
                <div class="card detail-sidebar-card p-4 mb-4 text-center" data-aos="fade-left">
                    <div class="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style="width:56px;height:56px;background:var(--primary-light);color:var(--primary-color)">
                        <i class="bi bi-headset fs-4"></i>
                    </div>
                    <h5 class="fw-800 text-dark mb-2">{{ __('Still need help?') }}</h5>
                    <p class="text-muted small mb-4">{{ __('Our support team is happy to answer any questions not covered here.') }}</p>
                    <a href="{{ route('contact') }}" class="btn btn-primary btn-header-cta w-100">
                        {{ __('Contact Support') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>

                {{-- Quick links --}}
                <div class="card detail-sidebar-card p-4">
                    <h5 class="fw-800 text-dark mb-3 small text-uppercase" style="letter-spacing:.05em">{{ __('Quick Links') }}</h5>
                    <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
                        <li><a href="{{ route('properties.index') }}" class="text-decoration-none text-muted small hover-primary"><i class="bi bi-house me-2" style="color:var(--primary-color)"></i>{{ __('Browse Properties') }}</a></li>
                        <li><a href="{{ route('autos.index') }}" class="text-decoration-none text-muted small hover-primary"><i class="bi bi-car-front me-2" style="color:var(--primary-color)"></i>{{ __('Browse Vehicles') }}</a></li>
                        <li><a href="{{ route('events.index') }}" class="text-decoration-none text-muted small hover-primary"><i class="bi bi-calendar-event me-2" style="color:var(--primary-color)"></i>{{ __('Browse Events') }}</a></li>
                        <li><a href="{{ route('jobs.index') }}" class="text-decoration-none text-muted small hover-primary"><i class="bi bi-briefcase me-2" style="color:var(--primary-color)"></i>{{ __('Browse Jobs') }}</a></li>
                        <li><a href="{{ route('register') }}" class="text-decoration-none text-muted small hover-primary"><i class="bi bi-person-plus me-2" style="color:var(--primary-color)"></i>{{ __('Create Account') }}</a></li>
                    </ul>
                </div>

            </div>
        </div>
    </div>

</x-frontend.page-shell>

@push('styles')
<style>
.page-hero-strip {
    padding: 4rem 0 3rem;
    background: var(--color-surface);
    border-bottom: 1.5px solid var(--color-border);
}
.page-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    color: var(--text-dark);
    line-height: 1.15;
}
.page-hero-subtitle {
    font-size: 1.05rem;
    color: var(--text-muted);
    max-width: 40rem;
}
.page-hero-icon-wrap {
    width: 160px; height: 160px;
    border-radius: 50%;
    background: var(--primary-light);
    display: flex; align-items: center; justify-content: center;
}
.page-hero-icon { font-size: 5rem; color: var(--primary-color); opacity: .7; }

.faq-group-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
}
.faq-accordion .accordion-item.faq-item {
    border: none;
    border-bottom: 1.5px solid var(--color-border);
    border-radius: 0 !important;
    background: transparent;
}
.faq-accordion .accordion-item.faq-item:first-child {
    border-top: 1.5px solid var(--color-border);
}
.faq-accordion .accordion-button {
    font-size: .9375rem;
    font-weight: 600;
    color: var(--text-dark);
    background: transparent;
    box-shadow: none;
    padding: 1rem 0;
}
.faq-accordion .accordion-button:not(.collapsed) {
    color: var(--primary-color);
    background: transparent;
}
.faq-accordion .accordion-button::after {
    filter: none;
    color: var(--primary-color);
}
.faq-accordion .accordion-body {
    padding: 0 0 1rem;
    font-size: .9375rem;
    line-height: 1.65;
}
.faq-filter-btn { transition: all .15s ease; }
.hover-primary:hover { color: var(--primary-color) !important; }
</style>
@endpush

@push('scripts')
<script>
(function () {
    var btns = document.querySelectorAll('.faq-filter-btn');
    var groups = document.querySelectorAll('.faq-group');

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.dataset.filter;

            btns.forEach(function (b) {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-secondary');
            });
            this.classList.add('active', 'btn-primary');
            this.classList.remove('btn-outline-secondary');

            groups.forEach(function (g) {
                var show = filter === 'all' || g.dataset.group === filter;
                g.style.display = show ? '' : 'none';
            });
        });
    });
})();
</script>
@endpush
@endsection
