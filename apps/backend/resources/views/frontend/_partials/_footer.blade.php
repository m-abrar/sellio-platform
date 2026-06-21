{{-- Footer --}}
@php
    // Map social platform names → Bootstrap Icons
    $socialIcons = [
        'facebook'   => 'bi-facebook',
        'fb'         => 'bi-facebook',
        'instagram'  => 'bi-instagram',
        'ig'         => 'bi-instagram',
        'twitter'    => 'bi-twitter-x',
        'x'          => 'bi-twitter-x',
        'linkedin'   => 'bi-linkedin',
        'youtube'    => 'bi-youtube',
        'yt'         => 'bi-youtube',
        'tiktok'     => 'bi-tiktok',
        'pinterest'  => 'bi-pinterest',
        'snapchat'   => 'bi-snapchat',
        'whatsapp'   => 'bi-whatsapp',
        'telegram'   => 'bi-telegram',
        'github'     => 'bi-github',
        'discord'    => 'bi-discord',
        'reddit'     => 'bi-reddit',
    ];
@endphp

{{-- ── Accent bar ──────────────────────────────────────────────────── --}}
<div class="ft-accent-bar" aria-hidden="true"></div>

{{-- ── Newsletter band — full-width, above main columns ───────────── --}}
@if(filter_var(setting('newsletter_enabled', '1'), FILTER_VALIDATE_BOOLEAN))
<div class="ft-nl-band">
    <div class="container-xl">
        <div class="ft-nl-inner">
            <div class="ft-nl-copy">
                <p class="ft-nl-eyebrow">{{ __('Stay updated') }}</p>
                <h2 class="ft-nl-headline">
                    {{ page_content_string('global.footer.newsletter_title', __('Stay in the loop')) }}
                </h2>
                <p class="ft-nl-sub">
                    {{ page_content_string('global.footer.newsletter_description', __('New listings, market updates, and seller tips — once a week.')) }}
                </p>
            </div>
            <form action="{{ route('newsletter.subscribe') }}" method="POST" class="ft-nl-form">
                @csrf
                <input type="hidden" name="source" value="site_footer">
                <label for="ft-nl-email" class="visually-hidden">{{ __('Email address') }}</label>
                <div class="ft-nl-field">
                    <i class="bi bi-envelope ft-nl-field-icon" aria-hidden="true"></i>
                    <input id="ft-nl-email" type="email" name="email" class="ft-nl-input"
                           placeholder="{{ page_content_string('global.footer.newsletter_placeholder', __('Your email address')) }}"
                           required>
                    <button type="submit" class="ft-nl-btn">
                        {{ page_content_string('global.footer.newsletter_button', __('Subscribe')) }}
                        <i class="bi bi-arrow-right ms-1"></i>
                    </button>
                </div>
                <p class="ft-nl-privacy">{{ __('No spam. Unsubscribe anytime.') }}</p>
            </form>
        </div>
    </div>
</div>
@endif

{{-- ── Main grid ──────────────────────────────────────────────────── --}}
<div class="container-xl ft-wrap">
    <div class="row ft-grid gy-5">

        {{-- Brand column --}}
        <div class="col-12 col-md-6 col-lg-4">
            <a href="{{ page_content_string('global.footer.brand_link', config('app.url')) }}"
               class="ft-brand text-decoration-none d-flex align-items-center mb-3">
                @php
                    $footerLogoUrl = setting('site_logo') ? Storage::url(setting('site_logo')) : asset('images/app-logo.webp');
                @endphp
                <img src="{{ $footerLogoUrl }}"
                     alt="{{ setting('site_name', config('app.name')) }}"
                     class="ft-logo-img me-2">
                <span class="ft-brand-name ft-brand-name--serif">
                    {{ page_content_string('global.footer.brand_text', setting_string('site_name', config('app.name'))) }}
                </span>
            </a>

            <p class="ft-tagline">
                {{ page_content_string('global.footer.paragraph', __('Buy, sell, and discover properties, vehicles, services, and more — all in one place.')) }}
            </p>

            {{-- Social icons --}}
            <div class="ft-socials">
                @forelse(menu_items('social_footer') as $item)
                    @php
                        $key  = strtolower(trim($item->title));
                        $icon = $socialIcons[$key] ?? 'bi-globe2';
                    @endphp
                    <a href="{{ $item->url }}" class="ft-social-icon" aria-label="{{ $item->title }}" target="_blank" rel="noopener">
                        <i class="bi {{ $icon }}"></i>
                    </a>
                @empty
                    <a href="#" class="ft-social-icon" aria-label="{{ __('Facebook') }}"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="ft-social-icon" aria-label="{{ __('Instagram') }}"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="ft-social-icon" aria-label="{{ __('X / Twitter') }}"><i class="bi bi-twitter-x"></i></a>
                    <a href="#" class="ft-social-icon" aria-label="{{ __('LinkedIn') }}"><i class="bi bi-linkedin"></i></a>
                @endforelse
            </div>
        </div>

        {{-- Link columns --}}
        @php
            $footerMenus = [
                'footer_column_1' => 'Explore',
                'footer_column_2' => 'Company',
                'footer_column_3' => 'Support',
            ];
        @endphp

        @foreach($footerMenus as $slug => $defaultName)
            <div class="col-6 col-sm-4 col-md-2 col-lg-2">
                <p class="ft-col-label">{{ __(menu_name($slug, $defaultName)) }}</p>
                <nav>
                    @foreach(menu_items($slug) as $menuitem)
                        <a href="{{ $menuitem->url }}" class="ft-link">{{ __($menuitem->title) }}</a>
                    @endforeach
                </nav>
            </div>
        @endforeach

    </div>

    {{-- ── Bottom bar ─────────────────────────────────────────────── --}}
    <div class="ft-bottom">
        <p class="ft-copy">
            &copy; {{ date('Y') }} {{ setting_string('site_name', config('app.name')) }}.
            {{ __('All rights reserved.') }}
        </p>
        <div class="ft-legal-links">
            <a href="{{ page_content_string('global.footer.privacy_url', '#') }}" class="ft-legal-link">{{ __('Privacy') }}</a>
            <a href="{{ page_content_string('global.footer.terms_url', '#') }}" class="ft-legal-link">{{ __('Terms') }}</a>
        </div>
    </div>

</div>
