@extends('frontend._layouts._app')

@section('title', __('About Us'))
@section('meta_description', __('Learn about our multi-vertical marketplace — built to connect buyers, sellers, and communities in one trusted platform.'))
@section('body_class', 'has-body-glow bg-light frontend-page--about')

@section('hero')
<section class="about-hero hero-section--dark">
    <div class="container-xl">
        <div class="row align-items-center g-4 g-lg-5">
            <div class="col-lg-7" data-aos="fade-right">
                <div class="hero-eyebrow mb-3">
                    <span class="hero-eyebrow__line" aria-hidden="true"></span>
                    {{ __('Company') }}
                </div>
                <h1 class="page-hero-title mb-3">
                    {{ __('One platform.') }}<br>
                    {{ __('Every') }} <span class="page-hero-accent">{{ __('vertical.') }}</span>
                </h1>
                <p class="page-hero-subtitle mb-4">
                    {{ page_content_string('about.hero.subtitle', __('We connect buyers and sellers across properties, vehicles, products, services, events, jobs, and more — all in one trusted place.')) }}
                </p>
                <div class="d-flex gap-3 flex-wrap">
                    <a href="{{ route('register') }}" class="btn btn-primary btn-lg px-5 fw-bold">
                        {{ __('Join for Free') }} <i class="bi bi-arrow-right ms-1"></i>
                    </a>
                    <a href="{{ route('contact') }}" class="btn btn-outline-light btn-lg px-4">
                        {{ __('Get in Touch') }}
                    </a>
                </div>
            </div>
            <div class="col-lg-5 d-none d-lg-block" data-aos="fade-left" data-aos-delay="150">
                <div class="about-hero-cards">
                    @foreach([
                        ['icon' => 'bi-house-fill',        'label' => 'Properties', 'color' => '#E05F2C'],
                        ['icon' => 'bi-car-front-fill',    'label' => 'Vehicles',   'color' => '#2563eb'],
                        ['icon' => 'bi-bag-fill',          'label' => 'Products',   'color' => '#16a34a'],
                        ['icon' => 'bi-wrench-adjustable', 'label' => 'Services',   'color' => '#9333ea'],
                        ['icon' => 'bi-calendar-event-fill','label' => 'Events',    'color' => '#dc2626'],
                        ['icon' => 'bi-briefcase-fill',    'label' => 'Jobs',       'color' => '#ca8a04'],
                        ['icon' => 'bi-tag-fill',          'label' => 'Classifieds','color' => '#0891b2'],
                        ['icon' => 'bi-newspaper',         'label' => 'Blog',       'color' => '#475569'],
                    ] as $v)
                    <div class="about-hero-chip">
                        <span class="about-hero-chip__icon" style="background:{{ $v['color'] }}1a;color:{{ $v['color'] }}">
                            <i class="bi {{ $v['icon'] }}"></i>
                        </span>
                        <span class="about-hero-chip__label">{{ __($v['label']) }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section('content')
<x-frontend.page-shell variant="about">

    {{-- ── Stats band ─────────────────────────────────────────────── --}}
    <div class="about-stats-band mb-5" data-aos="fade-up">
        @foreach([
            ['value' => '8',    'label' => 'Verticals',       'icon' => 'bi-grid-3x3-gap-fill', 'color' => '#E05F2C'],
            ['value' => '100%', 'label' => 'Secure Payments', 'icon' => 'bi-shield-fill-check',  'color' => '#16a34a'],
            ['value' => '24/7', 'label' => 'Support',         'icon' => 'bi-headset',            'color' => '#2563eb'],
            ['value' => '∞',    'label' => 'Possibilities',   'icon' => 'bi-stars',              'color' => '#9333ea'],
        ] as $stat)
        <div class="about-stat-item">
            <div class="about-stat-icon-wrap" style="background:{{ $stat['color'] }}18;color:{{ $stat['color'] }}">
                <i class="bi {{ $stat['icon'] }}"></i>
            </div>
            <p class="about-stat-value">{{ $stat['value'] }}</p>
            <p class="about-stat-label">{{ __($stat['label']) }}</p>
        </div>
        @endforeach
    </div>

    {{-- ── Mission ─────────────────────────────────────────────────── --}}
    <div class="row g-5 align-items-center mb-6" data-aos="fade-up">
        <div class="col-lg-6">
            <div class="about-eyebrow">{{ __('Our Mission') }}</div>
            <h2 class="about-section-title">
                {{ __('A single trusted place for') }}<br>
                <span class="text-primary">{{ __('every transaction') }}</span>
            </h2>
            <p class="about-body-text">
                {{ page_content_string('about.mission.paragraph_1', __('We built this platform because finding what you need across fragmented local marketplaces was frustrating. Properties on one site, vehicles on another, services elsewhere — nothing connected. We changed that.')) }}
            </p>
            <p class="about-body-text">
                {{ page_content_string('about.mission.paragraph_2', __('Today, buyers can discover listings across eight distinct categories in one search, and sellers get a single dashboard to manage everything — listings, messages, bookings, and payouts.')) }}
            </p>
            <div class="d-flex align-items-center gap-3 mt-4">
                <a href="{{ route('register') }}" class="btn btn-primary px-4 fw-semibold">
                    {{ __('Start Selling') }} <i class="bi bi-arrow-right ms-1"></i>
                </a>
                <a href="{{ route('contact') }}" class="btn btn-link fw-semibold text-decoration-none" style="color:var(--primary-color)">
                    {{ __('Talk to us') }} <i class="bi bi-chat ms-1"></i>
                </a>
            </div>
        </div>
        <div class="col-lg-6" data-aos="fade-left" data-aos-delay="100">
            <div class="about-mission-img-wrap">
                <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
                     alt="{{ __('Team collaborating') }}"
                     class="about-mission-img"
                     loading="lazy">
                <div class="about-mission-img-badge">
                    <i class="bi bi-check-circle-fill me-2" style="color:#16a34a;font-size:1.1rem"></i>
                    <span>{{ __('Trusted by sellers worldwide') }}</span>
                </div>
            </div>
        </div>
    </div>

    {{-- ── Why us ───────────────────────────────────────────────────── --}}
    <div class="mb-6" data-aos="fade-up">
        <div class="text-center mb-5">
            <div class="about-eyebrow justify-content-center">{{ __('Why Choose Us') }}</div>
            <h2 class="about-section-title text-center">
                {{ __('Everything you need,') }}<br>
                <span class="text-primary">{{ __("nothing you don't") }}</span>
            </h2>
        </div>
        <div class="row g-4">
            @foreach([
                ['icon' => 'bi-patch-check-fill', 'color' => '#E05F2C', 'title' => 'Verified Listings',     'body' => 'Every listing goes through a moderation review before going live. No scams, no clutter — just quality.'],
                ['icon' => 'bi-lock-fill',         'color' => '#16a34a', 'title' => 'Secure Payments',       'body' => 'Payments are processed via Stripe with escrow-style protection so both buyers and sellers transact with confidence.'],
                ['icon' => 'bi-person-check-fill', 'color' => '#2563eb', 'title' => 'Dedicated Dashboards', 'body' => 'Buyers and sellers each get a purpose-built dashboard with real-time messaging, analytics, and booking management.'],
                ['icon' => 'bi-translate',         'color' => '#9333ea', 'title' => 'Multi-Language Ready', 'body' => 'Built with full i18n support so your marketplace can serve communities in their native language from day one.'],
                ['icon' => 'bi-graph-up-arrow',    'color' => '#ca8a04', 'title' => 'Analytics & Insights', 'body' => 'Partners get real-time performance metrics on views, inquiries, and revenue — all in one clean report.'],
                ['icon' => 'bi-headset',           'color' => '#0891b2', 'title' => '24/7 Support',         'body' => 'Our support team is available around the clock via live chat and email to help buyers and sellers succeed.'],
            ] as $i => $feat)
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="{{ $i * 60 }}">
                <div class="about-feature-card">
                    <div class="about-feature-accent" style="background:{{ $feat['color'] }}"></div>
                    <div class="about-feature-icon-wrap" style="background:{{ $feat['color'] }}15;color:{{ $feat['color'] }}">
                        <i class="bi {{ $feat['icon'] }}"></i>
                    </div>
                    <h3 class="about-feature-title">{{ __($feat['title']) }}</h3>
                    <p class="about-feature-body">{{ __($feat['body']) }}</p>
                </div>
            </div>
            @endforeach
        </div>
    </div>

    {{-- ── Story / image section ────────────────────────────────────── --}}
    <div class="about-story-section mb-6" data-aos="fade-up">
        <div class="row g-0">
            <div class="col-lg-5 d-none d-lg-block">
                <div class="about-story-img-wrap">
                    <img src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800"
                         alt="{{ __('Building a marketplace') }}"
                         class="about-story-img"
                         loading="lazy">
                </div>
            </div>
            <div class="col-lg-7">
                <div class="about-story-body">
                    <div class="about-eyebrow">{{ __('Our Story') }}</div>
                    <h2 class="about-section-title">
                        {{ __('From frustration to') }}<br>
                        <span class="text-primary">{{ __('foundation') }}</span>
                    </h2>
                    <p class="about-body-text">
                        {{ page_content_string('about.story.paragraph', __("We started with a simple observation: commerce is fragmented. Buyers were jumping between five different apps just to find what they needed. We set out to fix that by building one platform that handles every vertical — not just one category.")) }}
                    </p>
                    <p class="about-body-text">
                        {{ __("It took years of iteration, user feedback, and relentless focus on quality to get here. We're proud of what the platform has become, and we're just getting started.") }}
                    </p>
                    <div class="about-story-stats">
                        <div class="about-story-stat">
                            <span class="about-story-stat__num">8</span>
                            <span class="about-story-stat__label">{{ __('Verticals') }}</span>
                        </div>
                        <div class="about-story-stat-divider"></div>
                        <div class="about-story-stat">
                            <span class="about-story-stat__num">1</span>
                            <span class="about-story-stat__label">{{ __('Platform') }}</span>
                        </div>
                        <div class="about-story-stat-divider"></div>
                        <div class="about-story-stat">
                            <span class="about-story-stat__num">∞</span>
                            <span class="about-story-stat__label">{{ __('Opportunities') }}</span>
                        </div>
                    </div>
                    <a href="{{ route('contact') }}" class="btn btn-primary px-4 mt-4">
                        {{ __('Say Hello') }} <i class="bi bi-envelope ms-1"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>

    {{-- ── CTA band ─────────────────────────────────────────────────── --}}
    <div class="about-cta-band" data-aos="fade-up">
        <div>
            <h2 class="about-cta-title">{{ __('Ready to get started?') }}</h2>
            <p class="about-cta-sub">{{ __('Join thousands of buyers and sellers on the platform today.') }}</p>
            <div class="d-flex gap-3 justify-content-center flex-wrap mt-4">
                <a href="{{ route('register') }}" class="btn btn-light btn-lg px-5 fw-bold" style="color:#E05F2C">
                    {{ __('Create Free Account') }} <i class="bi bi-arrow-right ms-1"></i>
                </a>
                <a href="{{ route('index') }}" class="btn btn-outline-light btn-lg px-5">
                    {{ __('Browse Listings') }}
                </a>
            </div>
        </div>
    </div>

</x-frontend.page-shell>

@push('styles')
<style>
/* ── Hero — extends hero-section--dark ───────────────────────── */
.about-hero {
    min-height: 520px;
    padding: 5rem 0 4rem;
    display: flex;
    align-items: center;
}
.about-hero .page-hero-title { font-size: clamp(2.4rem, 5vw, 3.6rem); }

/* Vertical chips in hero */
.about-hero-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: .65rem;
}
.about-hero-chip {
    display: flex; align-items: center; gap: .65rem;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    padding: .7rem 1rem;
    transition: background .15s;
}
.about-hero-chip:hover { background: rgba(255,255,255,.15); }
.about-hero-chip__icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.05rem;
}
.about-hero-chip__label { font-size: .85rem; font-weight: 600; color: #fff; }

/* ── Stats band ────────────────────────────────────────────────── */
.about-stats-band {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--color-border);
    border: 1.5px solid var(--color-border);
    border-radius: 16px;
    overflow: hidden;
}
.about-stat-item {
    background: #fff;
    padding: 2rem 1.25rem;
    text-align: center;
}
.about-stat-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto .85rem;
    font-size: 1.5rem;
}
.about-stat-value {
    font-family: var(--font-heading);
    font-size: 2.25rem; font-weight: 800;
    color: #1C1917; margin-bottom: .2rem; line-height: 1;
}
.about-stat-label { font-size: .75rem; color: #78716C; text-transform: uppercase; letter-spacing: .07em; margin: 0; font-weight: 600; }

/* ── Shared typography ─────────────────────────────────────────── */
.about-eyebrow {
    display: flex; align-items: center; gap: .6rem;
    font-size: .75rem; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: #E05F2C;
    margin-bottom: .65rem;
}
.about-eyebrow::before {
    content: ''; display: block;
    width: 24px; height: 2.5px; background: #E05F2C;
    border-radius: 2px; flex-shrink: 0;
}
.about-section-title {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 2.8vw, 2.4rem);
    color: #1C1917;
    line-height: 1.15;
    margin-bottom: 1.25rem;
}
.about-body-text { color: #57534E; line-height: 1.8; margin-bottom: .9rem; font-size: 1rem; }
.mb-6 { margin-bottom: 4.5rem !important; }

/* ── Mission image ─────────────────────────────────────────────── */
.about-mission-img-wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0,0,0,.12);
}
.about-mission-img {
    width: 100%; display: block;
    aspect-ratio: 4/3; object-fit: cover;
}
.about-mission-img-badge {
    position: absolute;
    bottom: 1.25rem; left: 1.25rem;
    background: #fff;
    border-radius: 999px;
    padding: .5rem 1rem;
    font-size: .85rem; font-weight: 600; color: #1C1917;
    display: flex; align-items: center;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
}

/* ── Feature cards ─────────────────────────────────────────────── */
.about-feature-card {
    background: #fff;
    border: 1.5px solid #E7E5E4;
    border-radius: 14px;
    padding: 1.75rem;
    height: 100%;
    position: relative;
    overflow: hidden;
    transition: border-color .2s, box-shadow .2s, transform .2s;
}
.about-feature-card:hover {
    border-color: #E05F2C40;
    box-shadow: 0 8px 32px rgba(224,95,44,.1);
    transform: translateY(-3px);
}
.about-feature-accent {
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
}
.about-feature-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.1rem;
    font-size: 1.5rem;
}
.about-feature-title { font-size: 1rem; font-weight: 700; color: #1C1917; margin-bottom: .45rem; }
.about-feature-body { font-size: .9rem; color: #78716C; line-height: 1.65; margin: 0; }

/* ── Story section ─────────────────────────────────────────────── */
.about-story-section {
    border-radius: 20px;
    overflow: hidden;
    border: 1.5px solid #E7E5E4;
    background: #fff;
    box-shadow: 0 4px 24px rgba(0,0,0,.05);
}
.about-story-img-wrap { height: 100%; min-height: 400px; }
.about-story-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about-story-body { padding: 3rem 2.5rem; }
.about-story-stats {
    display: flex; align-items: center; gap: 1.5rem;
    margin-top: 1.75rem;
    padding-top: 1.75rem;
    border-top: 1.5px solid #E7E5E4;
}
.about-story-stat { text-align: center; }
.about-story-stat__num {
    display: block;
    font-family: var(--font-heading);
    font-size: 2rem; font-weight: 800; color: #E05F2C; line-height: 1;
}
.about-story-stat__label { font-size: .75rem; font-weight: 600; color: #78716C; text-transform: uppercase; letter-spacing: .07em; }
.about-story-stat-divider { width: 1px; height: 40px; background: #E7E5E4; }

/* ── CTA band ──────────────────────────────────────────────────── */
.about-cta-band {
    border-radius: 20px;
    padding: 4rem 2rem;
    text-align: center;
    color: #fff;
    position: relative;
    overflow: hidden;
    background:
        linear-gradient(135deg, rgba(28,25,23,.93) 0%, rgba(28,25,23,.88) 55%, rgba(224,95,44,.3) 100%),
        url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400');
    background-size: cover;
    background-position: center 35%;
}
.about-cta-title {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 3.5vw, 2.75rem);
    font-weight: 800;
    color: #fff;
    margin-bottom: .5rem;
}
.about-cta-sub { color: rgba(255,255,255,.65); font-size: 1.05rem; margin: 0; }
.about-cta-band .btn-outline-light {
    border-color: rgba(255,255,255,.3);
    color: rgba(255,255,255,.85);
}
.about-cta-band .btn-outline-light:hover {
    background: rgba(255,255,255,.08);
    border-color: rgba(255,255,255,.6);
    color: #fff;
}

@media (max-width: 767px) {
    .about-stats-band { grid-template-columns: repeat(2, 1fr); }
    .about-story-body { padding: 2rem 1.5rem; }
    .about-story-stats { gap: 1rem; }
    .about-story-stat__num { font-size: 1.5rem; }
}
</style>
@endpush
@endsection
