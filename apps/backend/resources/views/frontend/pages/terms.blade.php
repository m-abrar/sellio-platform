@extends('frontend._layouts._app')

@section('title', __('Terms of Service'))
@section('meta_description', __('Read our terms of service to understand the rules and guidelines for using our marketplace platform.'))
@section('body_class', 'has-body-glow bg-light frontend-page--legal')

@section('hero')
<section class="page-hero-strip page-hero-strip--compact hero-section--dark">
    <div class="container-xl">
        <div class="hero-eyebrow mb-3">
            <span class="hero-eyebrow__line" aria-hidden="true"></span>
            {{ __('Legal') }}
        </div>
        <h1 class="page-hero-title mb-2">{{ __('Terms of Service') }}</h1>
        <p class="page-hero-date">{{ __('Last updated: :date', ['date' => 'January 1, 2025']) }}</p>
    </div>
</section>
@endsection

@section('content')
<x-frontend.page-shell variant="legal">
    <div class="row g-5">

        {{-- ── Document ──────────────────────────────────────── --}}
        <div class="col-lg-8">
            <div class="card detail-sidebar-card p-4 p-lg-5 legal-doc" data-aos="fade-up">

                <section class="legal-section" id="agreement">
                    <h2 class="legal-h2">{{ __('Agreement to Terms') }}</h2>
                    <p>{{ __('These Terms of Service ("Terms") govern your access to and use of the :name marketplace platform, website, and related services (the "Platform") operated by :name ("we", "us", or "our").', ['name' => $siteName ?? config('app.name')]) }}</p>
                    <p>{{ __('By accessing or using the Platform you agree to be bound by these Terms. If you do not agree, you may not access or use the Platform.') }}</p>
                </section>

                <section class="legal-section" id="accounts">
                    <h2 class="legal-h2">{{ __('Accounts') }}</h2>
                    <p>{{ __('To access certain features you must create an account. You agree to:') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('Provide accurate, complete, and current registration information') }}</li>
                        <li>{{ __('Keep your password secure and notify us immediately of any unauthorised access') }}</li>
                        <li>{{ __('Be responsible for all activity that occurs under your account') }}</li>
                        <li>{{ __('Not create accounts for anyone other than yourself without permission') }}</li>
                        <li>{{ __('Be at least 18 years old (or the age of majority in your jurisdiction)') }}</li>
                    </ul>
                    <p>{{ __('We reserve the right to suspend or terminate accounts that violate these Terms or are used for fraudulent purposes.') }}</p>
                </section>

                <section class="legal-section" id="listings">
                    <h2 class="legal-h2">{{ __('Listings and Content') }}</h2>
                    <h3 class="legal-h3">{{ __('Seller Responsibilities') }}</h3>
                    <p>{{ __('If you post listings as a seller/partner, you agree that all content you submit:') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('Is accurate, truthful, and not misleading') }}</li>
                        <li>{{ __('Does not infringe any third-party intellectual property rights') }}</li>
                        <li>{{ __('Does not violate any applicable laws or regulations') }}</li>
                        <li>{{ __('Does not include prohibited items (see "Prohibited Items" below)') }}</li>
                        <li>{{ __('Represents goods or services you have the legal right to sell or offer') }}</li>
                    </ul>
                    <h3 class="legal-h3">{{ __('Prohibited Items and Activities') }}</h3>
                    <p>{{ __('You may not use the Platform to list, sell, or facilitate:') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('Illegal goods, services, or activities') }}</li>
                        <li>{{ __('Counterfeit or stolen items') }}</li>
                        <li>{{ __('Weapons, controlled substances, or hazardous materials') }}</li>
                        <li>{{ __('Adult content without proper age verification and platform approval') }}</li>
                        <li>{{ __('Spam, phishing, or deceptive practices') }}</li>
                        <li>{{ __('Any content that is defamatory, harassing, or threatening') }}</li>
                    </ul>
                    <h3 class="legal-h3">{{ __('Content Moderation') }}</h3>
                    <p>{{ __('We reserve the right to remove any listing or content that violates these Terms, without prior notice. Repeated violations may result in account suspension or termination.') }}</p>
                </section>

                <section class="legal-section" id="transactions">
                    <h2 class="legal-h2">{{ __('Transactions and Payments') }}</h2>
                    <p>{{ __('The Platform facilitates transactions between buyers and sellers. We are not a party to any transaction between users unless explicitly stated.') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('All payments are processed through our third-party payment provider (Stripe).') }}</li>
                        <li>{{ __('Prices displayed are in the configured currency and inclusive of any stated fees.') }}</li>
                        <li>{{ __('Sellers are responsible for any applicable taxes on sales made through the Platform.') }}</li>
                        <li>{{ __('Refunds and cancellations are subject to the seller\'s stated policies and applicable consumer protection laws.') }}</li>
                        <li>{{ __('We reserve the right to withhold funds and/or suspend accounts suspected of fraud.') }}</li>
                    </ul>
                </section>

                <section class="legal-section" id="intellectual-property">
                    <h2 class="legal-h2">{{ __('Intellectual Property') }}</h2>
                    <p>{{ __('The Platform and its original content, features, and functionality are and will remain the exclusive property of :name and its licensors. Our name, logo, and service marks may not be used without our prior written consent.', ['name' => $siteName ?? config('app.name')]) }}</p>
                    <p>{{ __('By posting content on the Platform, you grant us a non-exclusive, royalty-free, worldwide licence to use, display, reproduce, and distribute your content in connection with operating the Platform.') }}</p>
                </section>

                <section class="legal-section" id="privacy">
                    <h2 class="legal-h2">{{ __('Privacy') }}</h2>
                    <p>{{ __('Your use of the Platform is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our ') }}<a href="{{ route('privacy-policy') }}" class="text-decoration-none" style="color:var(--primary-color)">{{ __('Privacy Policy') }}</a>{{ __(' to understand our practices.') }}</p>
                </section>

                <section class="legal-section" id="disclaimers">
                    <h2 class="legal-h2">{{ __('Disclaimers') }}</h2>
                    <p>{{ __('THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.') }}</p>
                    <p>{{ __('We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components. We are not responsible for the accuracy or completeness of user-generated content or listings.') }}</p>
                </section>

                <section class="legal-section" id="limitation">
                    <h2 class="legal-h2">{{ __('Limitation of Liability') }}</h2>
                    <p>{{ __('TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, :NAME AND ITS OFFICERS, DIRECTORS, EMPLOYEES, PARTNERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM.', ['name' => strtoupper($siteName ?? config('app.name'))]) }}</p>
                    <p>{{ __('Our total liability to you for any claims arising out of or related to these Terms or the Platform shall not exceed the amount paid by you to us in the twelve (12) months preceding the claim.') }}</p>
                </section>

                <section class="legal-section" id="termination">
                    <h2 class="legal-h2">{{ __('Termination') }}</h2>
                    <p>{{ __('We may suspend or terminate your access to the Platform at any time, with or without cause, with or without notice, effective immediately. You may also terminate your account at any time by contacting us.') }}</p>
                    <p>{{ __('Upon termination, your right to use the Platform will immediately cease. Provisions that by their nature should survive termination (including Intellectual Property, Disclaimers, Limitation of Liability, and Governing Law) shall survive.') }}</p>
                </section>

                <section class="legal-section" id="governing-law">
                    <h2 class="legal-h2">{{ __('Governing Law') }}</h2>
                    <p>{{ __('These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved in the competent courts of the applicable jurisdiction.') }}</p>
                </section>

                <section class="legal-section" id="changes">
                    <h2 class="legal-h2">{{ __('Changes to Terms') }}</h2>
                    <p>{{ __('We reserve the right to modify these Terms at any time. We will notify you of material changes by updating the date at the top of this page and, where appropriate, providing additional notice. Your continued use of the Platform after changes take effect constitutes acceptance of the revised Terms.') }}</p>
                </section>

                <section class="legal-section" id="contact">
                    <h2 class="legal-h2">{{ __('Contact Us') }}</h2>
                    <p>{{ __('If you have questions about these Terms, please contact us:') }}</p>
                    <div class="p-3 rounded-3" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.12)">
                        <p class="mb-1 fw-semibold text-dark">{{ $siteName ?? config('app.name') }}</p>
                        @if(setting('contact_email') ?: setting('site_email'))
                            <p class="mb-0 small text-muted"><i class="bi bi-envelope me-2" style="color:var(--primary-color)"></i>{{ setting('contact_email') ?: setting('site_email') }}</p>
                        @else
                            <p class="mb-0 small text-muted"><a href="{{ route('contact') }}" class="text-decoration-none" style="color:var(--primary-color)">{{ __('Contact form') }}</a></p>
                        @endif
                    </div>
                </section>

            </div>
        </div>

        {{-- ── Table of Contents ─────────────────────────────── --}}
        <div class="col-lg-4 d-none d-lg-block">
            <div class="sticky-top" style="top:100px" data-aos="fade-left">
                <div class="card detail-sidebar-card p-4">
                    <h5 class="fw-800 text-dark mb-3 small text-uppercase" style="letter-spacing:.05em">{{ __('Contents') }}</h5>
                    <nav class="legal-toc">
                        <ul class="list-unstyled d-flex flex-column gap-1 mb-0">
                            <li><a href="#agreement" class="legal-toc-link">{{ __('Agreement to Terms') }}</a></li>
                            <li><a href="#accounts" class="legal-toc-link">{{ __('Accounts') }}</a></li>
                            <li><a href="#listings" class="legal-toc-link">{{ __('Listings and Content') }}</a></li>
                            <li><a href="#transactions" class="legal-toc-link">{{ __('Transactions and Payments') }}</a></li>
                            <li><a href="#intellectual-property" class="legal-toc-link">{{ __('Intellectual Property') }}</a></li>
                            <li><a href="#privacy" class="legal-toc-link">{{ __('Privacy') }}</a></li>
                            <li><a href="#disclaimers" class="legal-toc-link">{{ __('Disclaimers') }}</a></li>
                            <li><a href="#limitation" class="legal-toc-link">{{ __('Limitation of Liability') }}</a></li>
                            <li><a href="#termination" class="legal-toc-link">{{ __('Termination') }}</a></li>
                            <li><a href="#governing-law" class="legal-toc-link">{{ __('Governing Law') }}</a></li>
                            <li><a href="#changes" class="legal-toc-link">{{ __('Changes to Terms') }}</a></li>
                            <li><a href="#contact" class="legal-toc-link">{{ __('Contact Us') }}</a></li>
                        </ul>
                    </nav>
                </div>

                <div class="card detail-sidebar-card p-4 mt-4 text-center">
                    <i class="bi bi-file-earmark-text fs-2 mb-2 d-block" style="color:var(--primary-color)"></i>
                    <p class="small text-muted mb-3">{{ __('Also see our Privacy Policy for how we handle your data.') }}</p>
                    <a href="{{ route('privacy-policy') }}" class="btn btn-outline-primary btn-sm w-100 fw-semibold">{{ __('Privacy Policy') }}</a>
                </div>
            </div>
        </div>

    </div>
</x-frontend.page-shell>

@push('styles')
<style>
.page-hero-strip { padding: 3.5rem 0 2.5rem; }
.page-hero-strip--compact { padding: 2.5rem 0 2rem; }
.page-hero-title { font-size: clamp(1.75rem, 3.5vw, 2.5rem); }
.page-hero-date { font-size: .85rem; color: rgba(255,255,255,.45); margin: 0; }
.legal-doc { line-height: 1.75; }
.legal-section { margin-bottom: 2.5rem; }
.legal-section:last-child { margin-bottom: 0; }
.legal-h2 {
    font-family: var(--font-heading);
    font-size: 1.3rem;
    color: var(--text-dark);
    margin-bottom: .75rem;
    padding-bottom: .5rem;
    border-bottom: 2px solid var(--primary-light);
}
.legal-h3 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-top: 1.25rem;
    margin-bottom: .5rem;
}
.legal-list {
    padding-left: 1.25rem;
    color: var(--text-muted);
}
.legal-list li { margin-bottom: .4rem; }
.legal-toc-link {
    display: block;
    padding: .35rem .5rem;
    font-size: .875rem;
    color: var(--text-muted);
    text-decoration: none;
    border-radius: 6px;
    transition: background .15s, color .15s;
}
.legal-toc-link:hover {
    background: var(--primary-light);
    color: var(--primary-color);
}
</style>
@endpush
@endsection
