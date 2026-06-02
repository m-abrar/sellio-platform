{{-- Footer --}}
<div class="container-xl">
    <div class="row gy-4 align-items-start">

        {{-- Brand and Socials --}}
        <div class="col-12 col-md-4">
            <a href="{{ page_content('global.footer.brand_link', config('app.url')) }}" 
                class="footer-logo mb-3 d-flex align-items-center fw-bold fs-5 text-decoration-none" 
                style="color: var(--primary-color, #0d6efd);">
                @php
                    $footerLogoUrl = setting('site_logo') ? Storage::url(setting('site_logo')) : asset('images/app-logo.webp');
                    $footerLogoDefault = '<img src="' . $footerLogoUrl . '" alt="' . setting('site_name', config('app.name')) . '" style="max-height: 35px;" class="me-2">';
                @endphp
                {!! page_content('global.footer.brand_logo', $footerLogoDefault) !!}
                <span>{{ page_content('global.footer.brand_text', setting('site_name', config('app.name'))) }}</span>
            </a>
            
            <div class="footer-description pe-lg-4 mb-4">
                <p class="small text-light opacity-75">
                    {{ page_content('global.footer.paragraph', __('Elevating your experience with innovative solutions.')) }}
                </p>
            </div>

            <div class="d-flex flex-wrap gap-3">
                @forelse(menu_items('social_footer') as $menuitem)
                    <a href="{{ $menuitem->url }}" class="social-icon text-light fs-5 transition-all" aria-label="{{ $menuitem->title }}">
                        {!! $menuitem->title !!}
                    </a>
                @empty
                    {{-- Default Socials if none configured --}}
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-facebook"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-instagram"></i></a>
                    <a href="#" class="text-light opacity-75 hover-opacity-100"><i class="bi bi-twitter-x"></i></a>
                @endforelse
            </div>
        </div>

        {{-- Dynamic Link Columns --}}
        @php
            $footerMenus = [
                'footer_column_1' => 'Explore',
                'footer_column_2' => 'More',
                'footer_column_3' => 'Company',
                'footer_column_4' => 'Support'
            ];
        @endphp

        @foreach($footerMenus as $slug => $defaultName)
            <div class="col-6 col-md-2">
                <h6 class="fw-bold mb-3 text-white text-uppercase small tracking-wider">
                    {{ __(menu_name($slug, $defaultName)) }}
                </h6>
                <nav class="nav flex-column">
                    @foreach(menu_items($slug) as $menuitem)
                        <a href="{{ $menuitem->url }}" class="nav-link p-0 text-light small mb-2 opacity-75 hover-opacity-100">
                            {{ __($menuitem->title) }}
                        </a>
                    @endforeach
                    
                    {{-- Specific additions for the Settings column --}}
                    @if($slug === 'settings_footer')
                        <a href="#" class="nav-link p-0 text-light small mb-2 opacity-75 hover-opacity-100">
                            <i class="bi bi-globe me-1"></i> {{ __('English (US)') }}
                        </a>
                    @endif
                </nav>
            </div>
        @endforeach

    </div>

    <hr class="my-4" style="border-color: rgba(255, 255, 255, 0.1);">

    <div class="row align-items-center">
        <div class="col-md-12 text-center">
            <p class="small text-light opacity-50 mb-0">
                &copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. {{ __('All rights reserved.') }}
            </p>
        </div>
    </div>
</div>
