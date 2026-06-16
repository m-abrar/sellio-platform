{{-- Footer --}}
<div class="container-xl">

    {{-- Top row: brand + 3 link columns (4 equal quarters) --}}
    <div class="row gy-5 align-items-start">

        {{-- Brand, description, socials --}}
        <div class="col-12 col-md-6 col-lg-3">
            <a href="{{ page_content_string('global.footer.brand_link', config('app.url')) }}"
                class="footer-logo mb-3 d-flex align-items-center fw-bold fs-5 text-decoration-none"
                style="color: var(--primary-color, #0d6efd);">
                @php
                    $footerLogoUrl = setting('site_logo') ? Storage::url(setting('site_logo')) : asset('images/app-logo.webp');
                    $footerLogoDefault = '<img src="' . $footerLogoUrl . '" alt="' . setting('site_name', config('app.name')) . '" style="max-height: 35px;" class="me-2">';
                @endphp
                {!! page_content('global.footer.brand_logo', $footerLogoDefault) !!}
                <span>{{ page_content_string('global.footer.brand_text', setting_string('site_name', config('app.name'))) }}</span>
            </a>

            <p class="small text-light opacity-75 pe-lg-3 mb-4">
                {{ page_content_string('global.footer.paragraph', __('Elevating your experience with innovative solutions.')) }}
            </p>

            <div class="d-flex flex-wrap gap-3">
                @forelse(menu_items('social_footer') as $menuitem)
                    <a href="{{ $menuitem->url }}" class="social-icon text-light fs-5 transition-all" aria-label="{{ $menuitem->title }}">
                        {{ __($menuitem->title) }}
                    </a>
                @empty
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-twitter-x"></i></a>
                @endforelse
            </div>
        </div>

        {{-- 3 equal link columns --}}
        @php
            $footerMenus = [
                'footer_column_1' => 'Explore',
                'footer_column_2' => 'Company',
                'footer_column_3' => 'Support',
            ];
        @endphp

        @foreach($footerMenus as $slug => $defaultName)
            <div class="col-6 col-sm-4 col-md-2 col-lg-3">
                <h6 class="fw-bold mb-3 text-white text-uppercase small tracking-wider">
                    {{ __(menu_name($slug, $defaultName)) }}
                </h6>
                <nav class="nav flex-column">
                    @foreach(menu_items($slug) as $menuitem)
                        <a href="{{ $menuitem->url }}" class="nav-link p-0 text-light small mb-2 opacity-75 hover-opacity-100">
                            {{ __($menuitem->title) }}
                        </a>
                    @endforeach
                </nav>
            </div>
        @endforeach

    </div>

    {{-- Newsletter strip --}}
    @if(filter_var(setting('newsletter_enabled', '1'), FILTER_VALIDATE_BOOLEAN))
        <div class="footer-newsletter rounded-4 p-4 p-lg-5 border border-white border-opacity-10 mt-5">
            <div class="row align-items-center gy-3 gx-5">
                <div class="col-12 col-lg-5">
                    <h6 class="fw-800 text-white mb-1 fs-5">
                        {{ page_content_string('global.footer.newsletter_title', __('Stay in the loop')) }}
                    </h6>
                    <p class="small text-light opacity-75 mb-0">
                        {{ page_content_string('global.footer.newsletter_description', __('Get marketplace updates, guides, and featured listings in your inbox.')) }}
                    </p>
                </div>
                <div class="col-12 col-lg-7">
                    <form action="{{ route('newsletter.subscribe') }}" method="POST" class="d-flex flex-column flex-sm-row gap-2">
                        @csrf
                        <input type="hidden" name="source" value="site_footer">
                        <label for="footer-newsletter-email" class="visually-hidden">{{ __('Email Address') }}</label>
                        <input
                            id="footer-newsletter-email"
                            type="email"
                            name="email"
                            class="form-control rounded-pill border-0 flex-grow-1 bg-white bg-opacity-10 text-white"
                            style="color: rgba(255,255,255,0.9) !important;"
                            placeholder="{{ page_content_string('global.footer.newsletter_placeholder', __('Your email address')) }}"
                            required
                        >
                        <button type="submit" class="btn btn-primary-theme rounded-pill px-4 text-nowrap fw-bold flex-shrink-0">
                            {{ page_content_string('global.footer.newsletter_button', __('Subscribe')) }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    @endif

    <hr class="mt-5 mb-4" style="border-color: rgba(255, 255, 255, 0.08);">

    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
        <p class="small text-light opacity-50 mb-0">
            &copy; {{ date('Y') }} {{ setting_string('site_name', config('app.name')) }}. {{ __('All rights reserved.') }}
        </p>
        <div class="d-flex gap-3">
            <a href="{{ page_content_string('global.footer.privacy_url', '#') }}" class="small text-light opacity-50 text-decoration-none hover-opacity-100">{{ __('Privacy') }}</a>
            <a href="{{ page_content_string('global.footer.terms_url', '#') }}" class="small text-light opacity-50 text-decoration-none hover-opacity-100">{{ __('Terms') }}</a>
        </div>
    </div>

</div>
