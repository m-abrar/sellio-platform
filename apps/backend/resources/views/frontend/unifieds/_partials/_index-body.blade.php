{{-- PUBLIC DISCOVERY: Module cards --}}
@if(($publicModules ?? collect())->isNotEmpty())
<section class="py-4 py-lg-5 section-warm">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div>
                <div class="hero-eyebrow mb-3">
                    <span class="hero-eyebrow__line" aria-hidden="true"></span>
                    {{ __('Browse Categories') }}
                </div>
                <h2 class="fw-800 text-dark h1 mb-1">
                    @editable('home.discovery.heading', 'Explore the <span class="text-primary">Marketplace</span>')
                </h2>
                <p class="text-muted mb-0 sub-heading">
                    @editable('home.discovery.description', __('Start with any category, then filter into the exact listing you need.'))
                </p>
            </div>
            <a href="{{ filled(setting('url_partner')) ? setting('url_partner') : route('register') }}" class="btn btn-outline-primary btn-header-cta fw-bold flex-shrink-0">
                {{ __('Post Listing') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        </div>

        <div class="row row-cols-2 row-cols-md-4 g-3 g-lg-4">
            @foreach($publicModules as $module)
                <div class="col">
                    <a href="{{ route($module['route']) }}" class="market-module-card d-flex flex-column h-100 text-decoration-none p-4">
                        <div class="market-module-count">{{ number_format($module['count']) }}</div>
                        <span class="market-module-label">{{ $module['label'] }}</span>
                        <span class="market-module-stat">{{ $module['count'] === 1 ? __('active listing') : __('active listings') }}</span>
                        <i class="bi {{ $module['icon'] }} market-module-bg-icon" aria-hidden="true"></i>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- MODULE: Real Estate --}}
@if(module_enabled('properties'))
<section class="section-spacious">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Featured') }} <span class="text-primary">{{ __('Properties') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Handpicked premium properties just for you.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('properties.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('Explore all') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>
        
        <div class="row row-cols-1 row-cols-md-3 g-4">
            @isset($propertiesFeatured)
                @forelse($propertiesFeatured->take(3) as $property)
                    <div class="col" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @include('frontend.unifieds._partials._property-card', ['property' => $property])
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-building',
                        'title' => __('Properties are being curated'),
                        'description' => __('Featured homes, rentals, and investment listings will appear here soon.'),
                        'route' => route('properties.index'),
                        'label' => __('Browse Properties')
                    ])
                @endforelse
            @endisset
        </div>
    </div>
</section>
@endif

{{-- MODULE: Autos --}}
@if(module_enabled('autos'))
<section class="section-dark section-spacious">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 display-6 mb-1">{{ __('Latest') }} <span class="text-primary">{{ __('Vehicles') }}</span></h2>
                <p class="lead mb-0 sub-heading">{{ __('Verified inventory from trusted sellers.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('autos.index') }}" class="btn btn-link fw-800 text-decoration-none p-0 hvr-icon-forward section-dark-link">
                    {{ __('Explore all') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>
        
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            @isset($autosLatest)
                @forelse($autosLatest->take(4) as $auto)
                    <div class="col" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @include('frontend.unifieds._partials._auto-card', ['auto' => $auto])
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-car-front-fill',
                        'title' => __('Vehicle inventory is being updated'),
                        'description' => __('Check back for verified cars, trucks, SUVs, and specialty autos.'),
                        'route' => route('autos.index'),
                        'label' => __('Browse Vehicles')
                    ])
                @endforelse
            @endisset
        </div>
    </div>
</section>
@endif

{{-- MODULE: Products --}}
@if(module_enabled('products'))
<section class="py-5">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Latest') }} <span class="text-primary">{{ __('Products') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Shop fresh arrivals from trusted sellers.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('products.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('Shop all') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            @isset($productsLatest)
                @forelse($productsLatest as $product)
                    <div class="col">
                        @include('frontend.products._partials._card', ['product' => $product])
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-bag-check-fill',
                        'title' => __('Products are being stocked'),
                        'description' => __('Fresh arrivals from marketplace sellers will show up here.'),
                        'route' => route('products.index'),
                        'label' => __('Shop Products')
                    ])
                @endforelse
            @endisset
        </div>
    </div>
</section>
@endif

{{-- MODULE: Careers & Classifieds Split --}}
@if(module_enabled('jobs') || module_enabled('classifieds'))
<section class="py-5 section-warm">
    <div class="container-xl">
        <div class="row g-4 g-xl-5">
            {{-- Careers --}}
            @if(module_enabled('jobs'))
            <div class="col-lg-6" data-aos="fade-right">
                <div class="card glass-surface rounded-5 p-4 p-md-5 shadow-lg border-0 h-100 overflow-hidden">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 class="fw-800 mb-0 text-dark fs-4"><i class="bi bi-briefcase-fill me-2 text-primary"></i> {{ __('Careers') }}</h3>
                        <a href="{{ route('jobs.index') }}" class="badge bg-primary text-light text-decoration-none px-3 py-2 rounded-pill fw-800">{{ __('Search All') }}</a>
                    </div>
                    <div class="list-group list-group-flush bg-transparent">
                        @isset($jobsFeatured)
                            @foreach($jobsFeatured->take(4) as $job)
                                @include('frontend.unifieds._partials._job-list-item', ['job' => $job])
                            @endforeach
                        @endisset
                    </div>
                </div>
            </div>
            @endif

            {{-- Top Deals --}}
            @if(module_enabled('classifieds'))
            <div class="col-lg-6" data-aos="fade-left">
                <div class="card glass-surface rounded-5 p-4 p-md-5 shadow-lg border-0 h-100 overflow-hidden">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 class="fw-800 mb-0 text-dark fs-4"><i class="bi bi-tag-fill me-2 text-success"></i> {{ __('Top Deals') }}</h3>
                        <a href="{{ route('classifieds.index') }}" class="badge bg-success bg-opacity-10 text-success text-decoration-none px-3 py-2 rounded-pill fw-800">{{ __('View Market') }}</a>
                    </div>
                    <div class="row g-3">
                        @isset($classifiedsFeatured)
                            @foreach($classifiedsFeatured->take(4) as $item)
                                <div class="col-6" data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                                    @include('frontend.unifieds._partials._classified-mini-card', ['item' => $item])
                                </div>
                            @endforeach
                        @endisset
                    </div>
                </div>
            </div>
            @endif
        </div>
    </div>
</section>
@endif

{{-- MODULE: Services --}}
@if(module_enabled('services'))
<section class="section-spacious">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-1">{{ __('Browse Popular') }} <span class="text-primary">{{ __('Services') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Find trusted professionals for any project.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('services.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('Browse all') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>

        @isset($serviceCategories)
        @php
            $svcCount = min($serviceCategories->count(), 4);
            $svcLgCol = $svcCount >= 4 ? 3 : ($svcCount === 3 ? 4 : ($svcCount === 2 ? 6 : 12));
        @endphp
        <div class="row g-4">
                @forelse($serviceCategories->take(4) as $category)
                    <div class="col-12 col-md-6 col-lg-{{ $svcLgCol }}" data-aos="zoom-in" data-aos-delay="{{ $loop->index * 100 }}">
                        <a href="{{ route('services.index', ['category' => $category->slug]) }}" class="text-decoration-none">
                            <div class="card glass-surface text-center h-100 border-0 rounded-5 p-3 hover-lift transition-all">
                                <div class="card-body">
                                    <div class="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm" 
                                         style="width: 70px; height: 70px; background-color: {{ $category->color_hex ? $category->color_hex . '1A' : 'rgba(93,95,239,0.1)' }}; color: {{ $category->color_hex ?? '#5d5fef' }};">
                                        <i class="{{ $category->icon ?? 'bi bi-gear-fill' }} fs-2"></i>
                                    </div>
                                    <h5 class="card-title fw-800 text-dark">{{ $category->title }}</h5>
                                    <p class="card-text text-muted small">{{ Str::limit($category->description ?? __('Find verified experts.'), 80) }}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-tools',
                        'title' => __('Service categories are coming soon'),
                        'description' => __('Professionals and project-ready categories will appear as soon as they are available.'),
                        'route' => route('services.index'),
                        'label' => __('Browse Services')
                    ])
                @endforelse
        </div>
        @endisset
    </div>
</section>
@endif

{{-- MODULE: Events --}}
@if(module_enabled('events'))
<section class="py-5 section-warm">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-1">{{ __('Upcoming') }} <span class="text-primary">{{ __('Events') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Join the community in person or online.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('events.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('All events') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>
        
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            @isset($eventsFeatured)
                @forelse($eventsFeatured->take(4) as $event)
                    <div class="col" data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @include('frontend.unifieds._partials._event-card', ['event' => $event])
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-calendar-event',
                        'title' => __('Events are warming up'),
                        'description' => __('Community meetups, workshops, and ticketed events will appear here.'),
                        'route' => route('events.index'),
                        'label' => __('Browse Events')
                    ])
                @endforelse
            @endisset
        </div>
    </div>
</section>
@endif

{{-- MODULE: Blogs --}}
@if(module_enabled('blogs'))
<section class="py-5">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Latest') }} <span class="text-primary">{{ __('Stories') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Read guides, updates, and marketplace insights.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('blogs.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('Read all') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
                </a>
            </div>
        </div>

        <div class="row row-cols-1 row-cols-md-3 g-4">
            @isset($blogsFeatured)
                @forelse($blogsFeatured as $blog)
                    <div class="col">
                        @include('frontend.blogs._partials._card', ['blog' => $blog])
                    </div>
                @empty
                    @include('frontend.unifieds._partials._section-empty-state', [
                        'icon' => 'bi-journal-text',
                        'title' => __('Stories and guides will appear soon'),
                        'description' => __('Marketplace news, buying guides, and seller insights will live here.'),
                        'route' => route('blogs.index'),
                        'label' => __('Read Stories')
                    ])
                @endforelse
            @endisset
        </div>
    </div>
</section>
@endif

{{-- PUBLIC DISCOVERY: Taxonomy and locations --}}
@if(($categoriesFeatured ?? collect())->isNotEmpty() || ($locationsFeatured ?? collect())->isNotEmpty())
<section class="py-5 section-warm">
    <div class="container-xl">
        <div class="row g-4 g-xl-5">
            @if(($categoriesFeatured ?? collect())->isNotEmpty())
                <div class="col-lg-7">
                    <div class="d-flex justify-content-between align-items-end mb-4 gap-3">
                        <div>
                            <h2 class="fw-800 text-dark h3 mb-1">{{ __('Popular Categories') }}</h2>
                            <p class="text-muted mb-0">{{ __('Jump into curated marketplace lanes.') }}</p>
                        </div>
                    </div>
                    <div class="row row-cols-2 row-cols-md-4 g-3">
                        @foreach($categoriesFeatured as $category)
                            <div class="col">
                                <a href="{{ route('categories.show', $category->slug) }}" class="taxonomy-chip glass-surface d-flex align-items-center gap-2 p-3 text-decoration-none h-100">
                                    <span class="taxonomy-icon d-inline-flex align-items-center justify-content-center">
                                        <i class="{{ $category->icon ?? 'bi bi-grid-1x2-fill' }}"></i>
                                    </span>
                                    <span class="small fw-bold text-dark">{{ $category->title }}</span>
                                </a>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            @if(($locationsFeatured ?? collect())->isNotEmpty())
                <div class="col-lg-5">
                    <div class="d-flex justify-content-between align-items-end mb-4 gap-3">
                        <div>
                            <h2 class="fw-800 text-dark h3 mb-1">{{ __('Featured Locations') }}</h2>
                            <p class="text-muted mb-0">{{ __('Explore where the marketplace is active.') }}</p>
                        </div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        @foreach($locationsFeatured as $location)
                            <a href="{{ route('index', ['location' => $location->slug]) }}" class="location-pill rounded-pill px-3 py-2 text-decoration-none">
                                <i class="bi bi-geo-alt me-1"></i>{{ $location->title }}
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif
        </div>
    </div>
</section>
@endif

{{-- MODULE: CTA --}}
@include('frontend.unifieds._partials._index-cta')
