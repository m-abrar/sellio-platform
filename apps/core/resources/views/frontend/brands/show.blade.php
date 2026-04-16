@section('hero')
{{-- Premium Brand Hero Header --}}
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden" 
     style="background: url('{{ $brand->cover_url ?? asset('images/default-brand-cover.jpg') }}') center center / cover no-repeat; min-height: 400px;">
    <div class="header-overlay" style="background: rgba(0,0,0,0.5); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
    
    <div class="container position-relative z-index-1 text-center py-5">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <img src="{{ $brand->primary_image_url }}" class="rounded-circle shadow-lg border border-4 border-white" 
                 width="140" height="140" alt="{{ $brand->title }}" style="object-fit: cover;">
        </div>
        
        <h1 class="fw-800 display-4 text-white mb-2" data-aos="fade-up">{{ $brand->title }}</h1>
        <div class="d-flex justify-content-center gap-3 text-white-50 fw-500" data-aos="fade-up" data-aos-delay="100">
            <span><i class="bi bi-tags me-1"></i> {{ __('Official Brand') }}</span>
            <span>•</span>
            <span><i class="bi bi-grid-fill me-1"></i> {{ $brand->listings_count ?? 0 }} {{ __('Total Listings') }}</span>
        </div>
    </div>
</div>
@endsection

@section('content')
<div class="container mt-n5 position-relative z-index-2 mb-5">
    <div class="row g-4">
        {{-- Left Column: Brand Content --}}
        <div class="col-lg-8">
            {{-- About Brand --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-3 mb-4" data-aos="fade-up">
                <div class="card-body">
                    <h4 class="fw-800 mb-3"><i class="bi bi-info-circle-fill me-2 text-primary"></i> {{ __('About the Brand') }}</h4>
                    <p class="description text-muted lh-lg">
                        {!! nl2br(e($brand->description ?? __('No detailed description available for this brand.'))) !!}
                    </p>
                </div>
            </div>

            {{-- Tabs for Brand Categories --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-2" data-aos="fade-up">
                <div class="card-body">
                    <ul class="nav nav-pills nav-justified mb-4 gap-2 p-2 bg-light rounded-pill" id="brandTab" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-inventory">{{ __('Inventory') }}</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-reviews">{{ __('Reviews') }}</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-inventory">
                            {{-- Integrated Collection Loop --}}
                            @php
                                $collections = [
                                    ['data' => $brand->properties, 'title' => __('Real Estate'), 'icon' => 'bi-house', 'route' => 'properties.show'],
                                    ['data' => $brand->autos, 'title' => __('Vehicles'), 'icon' => 'bi-car-front', 'route' => 'autos.show'],
                                    ['data' => $brand->jobs, 'title' => __('Careers'), 'icon' => 'bi-briefcase', 'route' => 'jobs.show'],
                                    ['data' => $brand->services, 'title' => __('Our Services'), 'icon' => 'bi-tools', 'route' => 'services.show'],
                                    ['data' => $brand->events, 'title' => __('Upcoming Events'), 'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                                    ['data' => $brand->classifieds, 'title' => __('Classifieds'), 'icon' => 'bi-megaphone', 'route' => 'classifieds.show'],
                                ];
                            @endphp

                            @foreach($collections as $col)
                                @if($col['data']->count())
                                    <div class="mb-5">
                                        <h5 class="fw-800 mb-3 text-dark d-flex align-items-center">
                                            <i class="{{ $col['icon'] }} me-2 text-primary"></i> {{ $col['title'] }}
                                            <span class="badge bg-light text-primary ms-2 rounded-pill fs-7">{{ $col['data']->count() }}</span>
                                        </h5>
                                        <div class="list-group list-group-flush gap-3">
                                            @foreach($col['data'] as $item)
                                                <a href="{{ route($col['route'], $item->slug) }}" class="list-group-item list-group-item-action rounded-4 border p-3 hover-lift shadow-sm">
                                                    <div class="d-flex align-items-center">
                                                        <img src="{{ $item->primary_image_url ?? asset('images/placeholder.png') }}" class="rounded-3 me-3" width="80" height="80" style="object-fit: cover;">
                                                        <div class="flex-grow-1">
                                                            <h6 class="fw-800 mb-1">{{ $item->title }}</h6>
                                                            <div class="text-muted small">
                                                                @if(isset($item->price_formatted)) 
                                                                    <span class="text-primary fw-bold me-2">{{ $item->price_formatted }}</span> 
                                                                @endif
                                                                <i class="bi bi-geo-alt"></i> {{ $item->address ?? $item->location->title ?? __('Regional') }}
                                                            </div>
                                                        </div>
                                                        <i class="bi bi-arrow-right-short text-muted fs-4"></i>
                                                    </div>
                                                </a>
                                            @endforeach
                                        </div>
                                    </div>
                                @endif
                            @endforeach
                        </div>

                        <div class="tab-pane fade" id="tab-reviews">
                            @ include('frontend._partials._reviews', ['reviewable' => $brand, 'type' => 'brands'])
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Brand Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top: 100px;">
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-4">{{ __('Brand Details') }}</h5>
                    
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-sm bg-primary-subtle text-primary me-3 rounded-circle"><i class="bi bi-link-45deg"></i></div>
                        <div><small class="text-muted d-block">{{ __('Reference') }}</small><span class="fw-600">{{ $brand->slug }}</span></div>
                    </div>

                    <div class="d-flex align-items-center mb-4">
                        <div class="icon-box-sm bg-success-subtle text-success me-3 rounded-circle"><i class="bi bi-calendar-check"></i></div>
                        <div><small class="text-muted d-block">{{ __('Established') }}</small><span class="fw-600">{{ $brand->created_at->format('M Y') }}</span></div>
                    </div>

                    <a href="{{ setting('url_partner', '#') }}?brand={{ $brand->slug }}" class="btn btn-primary btn-lg w-100 rounded-pill fw-800 mb-3 shadow-sm">
                        <i class="bi bi-plus-circle me-2"></i> {{ __('Post for Brand') }}
                    </a>
                </div>

                {{-- Verification & Authority --}}
                <div class="card bg-dark text-white rounded-5 border-0 shadow-lg p-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-primary">{{ __('Brand Authority') }}</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Verified Portfolio') }}</span>
                        <i class="bi bi-patch-check-fill text-primary"></i>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Direct Support') }}</span>
                        <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div class="mt-3 p-2 bg-secondary bg-opacity-25 rounded-4 small text-white-50">
                        {{ __('This is an official brand page. All listings are verified by our editorial team.') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@endsection
