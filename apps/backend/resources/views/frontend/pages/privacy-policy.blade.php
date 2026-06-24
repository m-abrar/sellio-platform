@extends('frontend._layouts._app')

@section('title', __('Privacy Policy'))
@section('meta_description', __('Learn how we collect, use, and protect your personal information on our marketplace platform.'))
@section('body_class', 'has-body-glow bg-light frontend-page--legal')

@section('hero')
<section class="page-hero-strip page-hero-strip--compact hero-section--dark">
    <div class="container-xl">
        <div class="hero-eyebrow mb-3">
            <span class="hero-eyebrow__line" aria-hidden="true"></span>
            {{ __('Legal') }}
        </div>
        <h1 class="page-hero-title mb-2">{{ __('Privacy Policy') }}</h1>
        <p class="page-hero-date">{{ __('Last updated: :date', ['date' => setting('legal_last_updated', 'January 1, 2025')]) }}</p>
    </div>
</section>
@endsection

@section('content')
<x-frontend.page-shell variant="legal">
    <div class="row g-5">

        {{-- ── Document ──────────────────────────────────────── --}}
        <div class="col-lg-8">
            <div class="card detail-sidebar-card p-4 p-lg-5 legal-doc" data-aos="fade-up">

                <section class="legal-section" id="overview">
                    <h2 class="legal-h2">{{ __('Overview') }}</h2>
                    <p>{{ __('This Privacy Policy describes how :name ("we", "us", or "our") collects, uses, and shares information about you when you use our marketplace platform, website, and related services (collectively, the "Platform").', ['name' => $siteName ?? config('app.name')]) }}</p>
                    <p>{{ __('By using the Platform you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use our services.') }}</p>
                </section>

                <section class="legal-section" id="information-we-collect">
                    <h2 class="legal-h2">{{ __('Information We Collect') }}</h2>
                    <h3 class="legal-h3">{{ __('Information You Provide') }}</h3>
                    <ul class="legal-list">
                        <li>{{ __('Account registration details (name, email address, password)') }}</li>
                        <li>{{ __('Profile information (phone number, location, bio, profile photo)') }}</li>
                        <li>{{ __('Listing content (photos, descriptions, pricing) when you post as a seller') }}</li>
                        <li>{{ __('Communications sent through our messaging system') }}</li>
                        <li>{{ __('Payment information processed through our third-party payment provider') }}</li>
                        <li>{{ __('Support requests and correspondence with our team') }}</li>
                    </ul>
                    <h3 class="legal-h3">{{ __('Information Collected Automatically') }}</h3>
                    <ul class="legal-list">
                        <li>{{ __('Log data: IP address, browser type, pages visited, time and date of visits') }}</li>
                        <li>{{ __('Device information: hardware model, operating system, unique device identifiers') }}</li>
                        <li>{{ __('Usage data: features accessed, listings viewed, searches performed') }}</li>
                        <li>{{ __('Cookies and similar tracking technologies (see "Cookies" below)') }}</li>
                    </ul>
                </section>

                <section class="legal-section" id="how-we-use">
                    <h2 class="legal-h2">{{ __('How We Use Your Information') }}</h2>
                    <p>{{ __('We use the information we collect to:') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('Operate and improve the Platform') }}</li>
                        <li>{{ __('Process transactions and send related confirmations') }}</li>
                        <li>{{ __('Send service notices, security alerts, and account-related emails') }}</li>
                        <li>{{ __('Respond to comments, questions, and support requests') }}</li>
                        <li>{{ __('Monitor and analyse usage and activity trends') }}</li>
                        <li>{{ __('Detect, investigate, and prevent fraudulent transactions and other illegal activities') }}</li>
                        <li>{{ __('Personalise and improve your experience on the Platform') }}</li>
                        <li>{{ __('Send promotional communications (only with your consent, and you may opt out at any time)') }}</li>
                    </ul>
                </section>

                <section class="legal-section" id="sharing">
                    <h2 class="legal-h2">{{ __('Information Sharing') }}</h2>
                    <p>{{ __('We do not sell or rent your personal data to third parties. We may share your information with:') }}</p>
                    <ul class="legal-list">
                        <li><strong>{{ __('Service providers') }}</strong> — {{ __('Third parties that perform services on our behalf, such as payment processing (Stripe), email delivery, analytics, and hosting. These providers are contractually bound to protect your information.') }}</li>
                        <li><strong>{{ __('Other users') }}</strong> — {{ __('Certain profile and listing information is publicly visible. When you transact with another user, their name and contact details (as permitted by your privacy settings) may be shared.') }}</li>
                        <li><strong>{{ __('Legal requirements') }}</strong> — {{ __('We may disclose information if required by law or in the good-faith belief that disclosure is necessary to comply with legal process or protect the rights, property, or safety of our users or the public.') }}</li>
                        <li><strong>{{ __('Business transfers') }}</strong> — {{ __('If we merge with or are acquired by another company, your information may be transferred as part of that transaction.') }}</li>
                    </ul>
                </section>

                <section class="legal-section" id="cookies">
                    <h2 class="legal-h2">{{ __('Cookies') }}</h2>
                    <p>{{ __('We use cookies and similar technologies to remember your preferences, keep you logged in, understand how the Platform is used, and show relevant content. You can control cookies through your browser settings, though disabling cookies may affect functionality.') }}</p>
                    <p>{{ __('Types of cookies we use:') }}</p>
                    <ul class="legal-list">
                        <li><strong>{{ __('Essential cookies') }}</strong> — {{ __('Required for the Platform to function (session management, CSRF protection).') }}</li>
                        <li><strong>{{ __('Preference cookies') }}</strong> — {{ __('Store your settings such as language and theme preferences.') }}</li>
                        <li><strong>{{ __('Analytics cookies') }}</strong> — {{ __('Help us understand how visitors interact with the Platform.') }}</li>
                    </ul>
                </section>

                <section class="legal-section" id="data-retention">
                    <h2 class="legal-h2">{{ __('Data Retention') }}</h2>
                    <p>{{ __('We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting support. We may retain certain information as required by law or for legitimate business purposes (e.g., transaction records).') }}</p>
                </section>

                <section class="legal-section" id="security">
                    <h2 class="legal-h2">{{ __('Security') }}</h2>
                    <p>{{ __('We implement industry-standard security measures including encrypted connections (TLS/HTTPS), hashed password storage, and access controls. However, no method of transmission over the internet is 100% secure. We encourage you to use a strong password and keep your account credentials confidential.') }}</p>
                </section>

                <section class="legal-section" id="your-rights">
                    <h2 class="legal-h2">{{ __('Your Rights') }}</h2>
                    <p>{{ __('Depending on your location, you may have the right to:') }}</p>
                    <ul class="legal-list">
                        <li>{{ __('Access and receive a copy of your personal data') }}</li>
                        <li>{{ __('Correct inaccurate or incomplete data') }}</li>
                        <li>{{ __('Request deletion of your data') }}</li>
                        <li>{{ __('Object to or restrict certain processing of your data') }}</li>
                        <li>{{ __('Withdraw consent where processing is based on consent') }}</li>
                        <li>{{ __('Lodge a complaint with your local data protection authority') }}</li>
                    </ul>
                    <p>{{ __('To exercise any of these rights, please contact us using the details in the "Contact Us" section below.') }}</p>
                </section>

                <section class="legal-section" id="children">
                    <h2 class="legal-h2">{{ __("Children's Privacy") }}</h2>
                    <p>{{ __('The Platform is not directed to children under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided personal information, we will take steps to delete that information.') }}</p>
                </section>

                <section class="legal-section" id="changes">
                    <h2 class="legal-h2">{{ __('Changes to This Policy') }}</h2>
                    <p>{{ __('We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and, where appropriate, by email. Your continued use of the Platform after changes become effective constitutes acceptance of the updated policy.') }}</p>
                </section>

                <section class="legal-section" id="contact-us">
                    <h2 class="legal-h2">{{ __('Contact Us') }}</h2>
                    <p>{{ __('If you have questions about this Privacy Policy or your personal data, please contact us at:') }}</p>
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
                            <li><a href="#overview" class="legal-toc-link">{{ __('Overview') }}</a></li>
                            <li><a href="#information-we-collect" class="legal-toc-link">{{ __('Information We Collect') }}</a></li>
                            <li><a href="#how-we-use" class="legal-toc-link">{{ __('How We Use Your Information') }}</a></li>
                            <li><a href="#sharing" class="legal-toc-link">{{ __('Information Sharing') }}</a></li>
                            <li><a href="#cookies" class="legal-toc-link">{{ __('Cookies') }}</a></li>
                            <li><a href="#data-retention" class="legal-toc-link">{{ __('Data Retention') }}</a></li>
                            <li><a href="#security" class="legal-toc-link">{{ __('Security') }}</a></li>
                            <li><a href="#your-rights" class="legal-toc-link">{{ __('Your Rights') }}</a></li>
                            <li><a href="#children" class="legal-toc-link">{{ __("Children's Privacy") }}</a></li>
                            <li><a href="#changes" class="legal-toc-link">{{ __('Changes to This Policy') }}</a></li>
                            <li><a href="#contact-us" class="legal-toc-link">{{ __('Contact Us') }}</a></li>
                        </ul>
                    </nav>
                </div>

                <div class="card detail-sidebar-card p-4 mt-4 text-center">
                    <i class="bi bi-shield-check fs-2 mb-2 d-block" style="color:var(--primary-color)"></i>
                    <p class="small text-muted mb-3">{{ __('Have questions about your data? Our team is here to help.') }}</p>
                    <a href="{{ route('contact') }}" class="btn btn-outline-primary btn-sm w-100 fw-semibold">{{ __('Contact Support') }}</a>
                </div>
            </div>
        </div>

    </div>
</x-frontend.page-shell>

@push('scripts')
<script>
(function () {
    var sections = document.querySelectorAll('.legal-section[id]');
    var links    = document.querySelectorAll('.legal-toc-link');
    if (!sections.length || !links.length) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (l) { l.classList.remove('is-active'); });
            var active = document.querySelector('.legal-toc-link[href="#' + entry.target.id + '"]');
            if (active) active.classList.add('is-active');
        });
    }, { rootMargin: '-20% 0px -75% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
})();
</script>
@endpush
@endsection
