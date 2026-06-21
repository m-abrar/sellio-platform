<section class="cta-section" data-aos="fade-up">
    <div class="container-xl">
        <div class="cta-inner">

            {{-- Copy + buttons --}}
            <div class="cta-content">
                <div class="hero-eyebrow mb-3">
                    <span class="hero-eyebrow__line" aria-hidden="true"></span>
                    {{ __('Start selling') }}
                </div>
                <h2 class="cta-headline">
                    @editableHtml('home.cta.title', 'Your next listing is <span class="text-primary">one click away.</span>')
                </h2>
                <p class="cta-sub">
                    @editable('home.cta.description', __('Join thousands of sellers reaching verified buyers across every category.'))
                </p>
                <div class="cta-actions">
                    <a href="{{ filled(setting('url_partner')) ? setting('url_partner') : route('register') }}"
                       class="btn btn-primary btn-header-cta btn-cta-lg fw-bold">
                        {{ __('Post a listing') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                    <a href="{{ route('register') }}"
                       class="btn btn-outline-light btn-header-cta btn-cta-lg fw-bold">
                        {{ __('Create free account') }}<i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>
            </div>

            {{-- Stats column --}}
            <div class="cta-stats">
                @if(($totalListingsCount ?? 0) > 0)
                <div class="cta-stat">
                    <span class="cta-stat__value">{{ number_format($totalListingsCount) }}+</span>
                    <span class="cta-stat__label">{{ __('Active Listings') }}</span>
                </div>
                @endif
                @if(($publicModules ?? collect())->count() > 0)
                <div class="cta-stat">
                    <span class="cta-stat__value">{{ ($publicModules ?? collect())->count() }}</span>
                    <span class="cta-stat__label">{{ __('Categories') }}</span>
                </div>
                @endif
                <div class="cta-stat">
                    <span class="cta-stat__value">4.8<span class="cta-stat__unit">★</span></span>
                    <span class="cta-stat__label">{{ __('Seller Rating') }}</span>
                </div>
            </div>

        </div>
    </div>
</section>
