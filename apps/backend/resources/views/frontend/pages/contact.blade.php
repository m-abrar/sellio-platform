@extends('frontend._layouts._app')

@section('title', __('Contact Us'))
@section('meta_description', __('Get in touch with our team. We\'re here to help with any questions about the marketplace.'))
@section('body_class', 'has-body-glow bg-light frontend-page--contact')

@section('hero')
<section class="page-hero-strip hero-section--dark">
    <div class="container-xl">
        <div class="row align-items-center g-4">
            <div class="col-lg-7" data-aos="fade-right">
                <div class="hero-eyebrow mb-3">
                    <span class="hero-eyebrow__line" aria-hidden="true"></span>
                    {{ __('Support') }}
                </div>
                <h1 class="page-hero-title mb-3">{{ __('Get in') }} <span class="page-hero-accent">{{ __('Touch') }}</span></h1>
                <p class="page-hero-subtitle mb-0">{{ __('Have a question, a partnership idea, or just want to say hello? Our team is ready to help.') }}</p>
            </div>
            <div class="col-lg-5 d-none d-lg-flex justify-content-end" data-aos="fade-left" data-aos-delay="100">
                <div class="contact-hero-panel">
                    @foreach([
                        ['icon' => 'bi-chat-dots-fill',    'label' => 'Live Chat',   'value' => 'Available now',     'color' => '#E05F2C'],
                        ['icon' => 'bi-envelope-fill',     'label' => 'Email',        'value' => 'Reply within 24h',  'color' => '#2563eb'],
                        ['icon' => 'bi-shield-check-fill', 'label' => 'Secure',       'value' => 'Your data is safe', 'color' => '#16a34a'],
                    ] as $ch)
                    <div class="contact-hero-channel">
                        <div class="contact-hero-channel__icon" style="background:{{ $ch['color'] }}22;color:{{ $ch['color'] }}">
                            <i class="bi {{ $ch['icon'] }}"></i>
                        </div>
                        <div>
                            <div class="contact-hero-channel__label">{{ __($ch['label']) }}</div>
                            <div class="contact-hero-channel__value">{{ __($ch['value']) }}</div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section('content')
<x-frontend.page-shell variant="contact">
    <div class="row g-5 g-lg-6">

        {{-- ── Contact Form ──────────────────────────────────── --}}
        <div class="col-lg-7" data-aos="fade-up">
            <div class="card detail-sidebar-card p-4 p-lg-5">
                <h2 class="fw-800 text-dark mb-1 h4">{{ __('Send a Message') }}</h2>
                <p class="text-muted small mb-4">{{ __('We\'ll get back to you within one business day.') }}</p>

                @if(session('success'))
                    <div class="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                        <i class="bi bi-check-circle-fill fs-5 flex-shrink-0"></i>
                        <span>{{ session('success') }}</span>
                    </div>
                @endif

                @if($errors->any())
                    <div class="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
                        <i class="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0"></i>
                        <span>{{ $errors->first() }}</span>
                    </div>
                @endif

                <form action="{{ route('contact.send') }}" method="POST" novalidate>
                    @csrf
                    <div class="row g-3 mb-3">
                        <div class="col-sm-6">
                            <label for="contact_name" class="filter-label">{{ __('Full Name') }} <span class="text-danger">*</span></label>
                            <input type="text" id="contact_name" name="name" value="{{ old('name') }}"
                                   class="form-control @error('name') is-invalid @enderror"
                                   placeholder="{{ __('Your name') }}" required>
                            @error('name')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                        <div class="col-sm-6">
                            <label for="contact_email" class="filter-label">{{ __('Email Address') }} <span class="text-danger">*</span></label>
                            <input type="email" id="contact_email" name="email" value="{{ old('email') }}"
                                   class="form-control @error('email') is-invalid @enderror"
                                   placeholder="{{ __('you@example.com') }}" required>
                            @error('email')<div class="invalid-feedback">{{ $message }}</div>@enderror
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="contact_subject" class="filter-label">{{ __('Subject') }} <span class="text-danger">*</span></label>
                        <select id="contact_subject" name="subject" class="form-select @error('subject') is-invalid @enderror" required>
                            <option value="">{{ __('Select a topic…') }}</option>
                            <option value="General Inquiry" @selected(old('subject') === 'General Inquiry')>{{ __('General Inquiry') }}</option>
                            <option value="Seller Support" @selected(old('subject') === 'Seller Support')>{{ __('Seller Support') }}</option>
                            <option value="Buyer Support" @selected(old('subject') === 'Buyer Support')>{{ __('Buyer Support') }}</option>
                            <option value="Report a Listing" @selected(old('subject') === 'Report a Listing')>{{ __('Report a Listing') }}</option>
                            <option value="Partnership Inquiry" @selected(old('subject') === 'Partnership Inquiry')>{{ __('Partnership Inquiry') }}</option>
                            <option value="Technical Issue" @selected(old('subject') === 'Technical Issue')>{{ __('Technical Issue') }}</option>
                            <option value="Other" @selected(old('subject') === 'Other')>{{ __('Other') }}</option>
                        </select>
                        @error('subject')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>

                    <div class="mb-4">
                        <label for="contact_message" class="filter-label">{{ __('Message') }} <span class="text-danger">*</span></label>
                        <textarea id="contact_message" name="message" rows="6"
                                  class="form-control @error('message') is-invalid @enderror"
                                  placeholder="{{ __('Tell us how we can help…') }}" required>{{ old('message') }}</textarea>
                        @error('message')<div class="invalid-feedback">{{ $message }}</div>@enderror
                    </div>

                    <button type="submit" class="btn btn-primary btn-header-cta">
                        {{ __('Send Message') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </form>
            </div>
        </div>

        {{-- ── Contact Info ──────────────────────────────────── --}}
        <div class="col-lg-5" data-aos="fade-up" data-aos-delay="100">

            {{-- Info cards --}}
            <div class="d-flex flex-column gap-3 mb-4">
                @php
                    $contactEmail = setting('contact_email') ?: setting('site_email');
                    $contactPhone = setting('contact_phone') ?: setting('site_phone');
                    $contactAddress = setting('contact_address') ?: setting('site_address');
                @endphp

                @if($contactEmail)
                <div class="contact-info-card d-flex align-items-start gap-3 p-4 rounded-4 bg-white" style="border:1.5px solid var(--color-border)">
                    <div class="contact-info-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" style="width:44px;height:44px;background:var(--primary-light);color:var(--primary-color)">
                        <i class="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div>
                        <p class="fw-semibold text-dark mb-0 small">{{ __('Email') }}</p>
                        <a href="mailto:{{ $contactEmail }}" class="text-muted small text-decoration-none hover-primary">{{ $contactEmail }}</a>
                    </div>
                </div>
                @endif

                @if($contactPhone)
                <div class="contact-info-card d-flex align-items-start gap-3 p-4 rounded-4 bg-white" style="border:1.5px solid var(--color-border)">
                    <div class="contact-info-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" style="width:44px;height:44px;background:var(--primary-light);color:var(--primary-color)">
                        <i class="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div>
                        <p class="fw-semibold text-dark mb-0 small">{{ __('Phone') }}</p>
                        <a href="tel:{{ $contactPhone }}" class="text-muted small text-decoration-none hover-primary">{{ $contactPhone }}</a>
                    </div>
                </div>
                @endif

                @if($contactAddress)
                <div class="contact-info-card d-flex align-items-start gap-3 p-4 rounded-4 bg-white" style="border:1.5px solid var(--color-border)">
                    <div class="contact-info-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" style="width:44px;height:44px;background:var(--primary-light);color:var(--primary-color)">
                        <i class="bi bi-geo-alt-fill fs-5"></i>
                    </div>
                    <div>
                        <p class="fw-semibold text-dark mb-0 small">{{ __('Address') }}</p>
                        <span class="text-muted small">{{ $contactAddress }}</span>
                    </div>
                </div>
                @endif

                {{-- Fallback if nothing configured --}}
                @if(!$contactEmail && !$contactPhone && !$contactAddress)
                <div class="contact-info-card d-flex align-items-start gap-3 p-4 rounded-4 bg-white" style="border:1.5px solid var(--color-border)">
                    <div class="contact-info-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-3" style="width:44px;height:44px;background:var(--primary-light);color:var(--primary-color)">
                        <i class="bi bi-headset fs-5"></i>
                    </div>
                    <div>
                        <p class="fw-semibold text-dark mb-0 small">{{ __('Support') }}</p>
                        <span class="text-muted small">{{ __('Use the form — we respond within one business day.') }}</span>
                    </div>
                </div>
                @endif
            </div>

            {{-- Response time card --}}
            <div class="p-4 rounded-4 mb-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-clock-fill" style="color:var(--primary-color)"></i>
                    <span class="fw-semibold text-dark small">{{ __('Response Time') }}</span>
                </div>
                <p class="text-muted small mb-0">{{ __('We typically respond within 24 hours on business days. For urgent issues, mention it in your subject line.') }}</p>
            </div>

            {{-- Social links --}}
            @php
                $socials = [
                    'facebook'  => ['icon' => 'bi-facebook',  'label' => 'Facebook',  'key' => 'social_facebook'],
                    'twitter'   => ['icon' => 'bi-twitter-x', 'label' => 'X (Twitter)','key' => 'social_twitter'],
                    'instagram' => ['icon' => 'bi-instagram', 'label' => 'Instagram', 'key' => 'social_instagram'],
                    'linkedin'  => ['icon' => 'bi-linkedin',  'label' => 'LinkedIn',  'key' => 'social_linkedin'],
                    'youtube'   => ['icon' => 'bi-youtube',   'label' => 'YouTube',   'key' => 'social_youtube'],
                ];
                $activeSocials = collect($socials)->filter(fn($s) => filled(setting($s['key'])));
            @endphp
            @if($activeSocials->isNotEmpty())
            <div>
                <p class="fw-semibold text-dark small mb-2">{{ __('Follow us') }}</p>
                <div class="d-flex flex-wrap gap-2">
                    @foreach($activeSocials as $social)
                    <a href="{{ setting($social['key']) }}" target="_blank" rel="noopener noreferrer"
                       class="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                       style="width:38px;height:38px;"
                       aria-label="{{ $social['label'] }}">
                        <i class="bi {{ $social['icon'] }}"></i>
                    </a>
                    @endforeach
                </div>
            </div>
            @endif

        </div>

    </div>
</x-frontend.page-shell>

@push('styles')
<style>
/* ── Hero strip ───────────────────────────────────────────────── */
.page-hero-strip { padding: 4rem 0 3rem; }

.page-hero-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 4vw, 3rem);
    color: #fff;
    line-height: 1.15;
}
.page-hero-accent {
    background: linear-gradient(125deg, var(--primary-color) 25%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
}
.page-hero-subtitle {
    font-size: 1.05rem;
    color: rgba(255,255,255,.65);
    max-width: 38rem;
}
.page-hero-strip .hero-eyebrow { color: rgba(255,255,255,.55); }

/* ── Contact channel panel (hero right col) ───────────────────── */
.contact-hero-panel {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 20px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 280px;
}
.contact-hero-channel { display: flex; align-items: center; gap: 1rem; }
.contact-hero-channel__icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
}
.contact-hero-channel__label {
    font-size: .7rem; font-weight: 700;
    color: rgba(255,255,255,.45);
    text-transform: uppercase; letter-spacing: .07em; margin-bottom: .1rem;
}
.contact-hero-channel__value { font-size: .9rem; font-weight: 600; color: #fff; }

/* ── Info cards ──────────────────────────────────────────────── */
.contact-info-card { transition: transform .2s ease, box-shadow .2s ease; }
.contact-info-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-subtle); }
.hover-primary:hover { color: var(--primary-color) !important; }
</style>
@endpush
@endsection
