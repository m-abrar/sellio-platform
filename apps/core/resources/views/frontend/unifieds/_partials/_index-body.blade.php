{{-- MODULE: Real Estate --}}
<section class="py-5">
    <div class="container-xl">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
            <div data-aos="fade-right">
                <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Featured') }} <span class="text-primary">{{ __('Properties') }}</span></h2>
                <p class="lead text-muted mb-0 sub-heading">{{ __('Handpicked premium properties just for you.') }}</p>
            </div>
            <div data-aos="fade-left">
                <a href="{{ route('properties.index') }}" class="btn btn-link text-primary fw-800 text-decoration-none p-0 hvr-icon-forward">
                    {{ __('EXPLORE ALL') }} <i class="bi bi-arrow-right ms-2 hvr-icon"></i>
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
                    <div class="col-12 text-center py-5 glass-surface rounded-5 border-dashed">
                        <p class="text-muted mb-0">{{ __('No featured properties available at the moment.') }}</p>
                    </div>
                @endforelse
            @endisset
        </div>
    </div>
</section>

{{-- MODULE: Autos --}}
<section class="py-5 position-relative overflow-hidden">
    <div class="container-xl position-relative z-index-1">
        <div class="text-center mb-5" data-aos="fade-down">
            <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Latest') }} <span class="text-primary">{{ __('Vehicles') }}</span></h2>
            <div class="mx-auto bg-primary rounded-pill mt-3 shadow-sm deco-line-sm"></div>
        </div>
        
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            @isset($autosLatest)
                @forelse($autosLatest->take(4) as $auto)
                    <div class="col" data-aos="fade-up" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @include('frontend.unifieds._partials._auto-card', ['auto' => $auto])
                    </div>
                @empty
                    <div class="col-12 text-center py-5"><p class="text-muted">{{ __('Inventory is being updated.') }}</p></div>
                @endforelse
            @endisset
        </div>
    </div>
</section>

{{-- MODULE: Careers & Classifieds Split --}}
<section class="py-5">
    <div class="container-xl">
        <div class="row g-4 g-xl-5">
            {{-- Careers --}}
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

            {{-- Top Deals --}}
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
        </div>
    </div>
</section>

{{-- MODULE: Services --}}
<section class="py-5">
    <div class="container-xl">
        <div class="text-center mb-5" data-aos="fade-up">
            <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Browse Popular') }} <span class="text-primary">{{ __('Services') }}</span></h2>
            <p class="lead text-muted">{{ __('Find trusted professionals for any project.') }}</p>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            @isset($categories)
                @foreach($categories->where('is_service', true)->take(4) as $category)
                    <div class="col" data-aos="zoom-in" data-aos-delay="{{ $loop->index * 100 }}">
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
                @endforeach
            @endisset
        </div>
    </div>
</section>

{{-- MODULE: Events --}}
<section class="py-5">
    <div class="container-xl">
        <div class="text-center mb-5" data-aos="fade-down">
            <h2 class="fw-800 text-dark display-6 mb-0">{{ __('Upcoming') }} <span class="text-primary">{{ __('Events') }}</span></h2>
            <p class="text-muted">{{ __('Join the community in person or online.') }}</p>
        </div>
        
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            @isset($eventsFeatured)
                @forelse($eventsFeatured->take(4) as $event)
                    <div class="col" data-aos="zoom-in" data-aos-delay="{{ $loop->iteration * 100 }}">
                        @include('frontend.unifieds._partials._event-card', ['event' => $event])
                    </div>
                @empty
                    <div class="col-12 text-center py-5 text-muted">{{ __('Stay tuned for upcoming community events!') }}</div>
                @endforelse
            @endisset
        </div>
    </div>
</section>

{{-- MODULE: CTA --}}
@include('frontend.unifieds._partials._index-cta')
