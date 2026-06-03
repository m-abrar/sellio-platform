@section('hero')
{{-- Premium Category Header --}}
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden" 
     style="background: linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('{{ $category->primary_image_url }}') center center / cover no-repeat;">
    <div class="header-overlay"></div>
    
    <div class="container position-relative z-index-1 text-center py-4">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <img src="{{ $category->primary_image_url }}" class="rounded-circle shadow-lg border border-4 border-white" 
                 width="120" height="120" alt="{{ $category->title }}" style="object-fit: cover;">
        </div>
        
        <h1 class="fw-800 display-5 text-white mb-2" data-aos="fade-up">{{ $category->title }}</h1>
        <div class="d-flex justify-content-center gap-3 text-white-50 fw-500" data-aos="fade-up" data-aos-delay="100">
            <span><i class="bi bi-tag me-1"></i> {{ $category->type->title ?? __('General Category') }}</span>
            <span>•</span>
            <span><i class="bi bi-layers me-1"></i> {{ $category->listings_count ?? 0 }} {{ __('Total Listings') }}</span>
        </div>
    </div>
</div>
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="category" class="mt-n5 position-relative z-index-2">
    <div class="row g-4">
        {{-- Left Column: Dynamic Content --}}
        <div class="col-lg-8">
            
            @php
                $segments = [
                    ['data' => $category->properties, 'title' => __('Properties'), 'icon' => 'bi-house', 'route' => 'properties.show'],
                    ['data' => $category->events, 'title' => __('Events'), 'icon' => 'bi-calendar-event', 'route' => 'events.show'],
                    ['data' => $category->jobs, 'title' => __('Jobs'), 'icon' => 'bi-briefcase', 'route' => 'jobs.show'],
                    ['data' => $category->services, 'title' => __('Services'), 'icon' => 'bi-tools', 'route' => 'services.show'],
                    ['data' => $category->autos, 'title' => __('Vehicles'), 'icon' => 'bi-car-front', 'route' => 'autos.show'],
                    ['data' => $category->classifieds, 'title' => __('Classifieds'), 'icon' => 'bi-megaphone', 'route' => 'classifieds.show'],
                ];
            @endphp

            @foreach($segments as $segment)
                @if($segment['data']->count())
                    <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-up">
                        <h4 class="fw-800 mb-4 d-flex align-items-center">
                            <i class="{{ $segment['icon'] }} me-2 text-primary"></i> 
                            {{ $segment['title'] }} {{ __('in') }} {{ $category->title }}
                            <span class="badge bg-primary-subtle text-primary ms-auto rounded-pill fs-7">{{ $segment['data']->count() }}</span>
                        </h4>
                        
                        <div class="list-group list-group-flush gap-3">
                            @foreach($segment['data'] as $item)
                                <a href="{{ route($segment['route'], $item->slug) }}" class="list-group-item list-group-item-action rounded-4 border p-3 hover-lift shadow-sm">
                                    <div class="d-flex align-items-center">
                                        <img src="{{ $item->primary_image_url ?? $item->company_logo_url ?? asset('images/placeholder.png') }}" 
                                             class="rounded-3 me-3" width="75" height="75" style="object-fit: cover;">
                                        
                                        <div class="flex-grow-1">
                                            <h6 class="fw-800 mb-1 text-dark">{{ $item->title ?? ($item->make . ' ' . $item->model) }}</h6>
                                            <div class="text-muted small d-flex flex-wrap gap-2">
                                                @if(isset($item->price_formatted))
                                                    <span class="text-primary fw-bold">{{ $item->price_formatted }}</span>
                                                    <span>•</span>
                                                @endif
                                                <span><i class="bi bi-geo-alt me-1"></i>{{ $item->address ?? $item->location->title ?? __('Multiple Locations') }}</span>
                                            </div>
                                        </div>
                                        <i class="bi bi-chevron-right text-muted ms-2"></i>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    </div>
                @endif
            @endforeach
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top: 100px;">
                
                {{-- About Card --}}
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-3">{{ __('About Category') }}</h5>
                    <p class="text-muted lh-lg mb-0">
                        {{ $category->description ?: __('Explore a wide range of listings specifically curated under this category.') }}
                    </p>
                </div>

                {{-- Action Card --}}
                <div class="card bg-dark text-white rounded-5 border-0 shadow-lg p-4 mb-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-primary">{{ __('Get Involved') }}</h5>
                    <p class="small text-white-50 mb-4">{{ __('Have something to share? Post your listing in this category today.') }}</p>
                    
                    <a href="{{ setting('url_partner', '#') }}?category={{ $category->slug }}" class="btn btn-primary w-100 rounded-pill fw-800 mb-3 shadow-sm py-2">
                        <i class="bi bi-plus-circle me-2"></i> {{ __('Submit Listing') }}
                    </a>

                    @if($category->parent_category)
                        <div class="mt-3 pt-3 border-top border-secondary">
                            <small class="text-white-50 d-block mb-2">{{ __('Parent Category') }}</small>
                            <a href="{{ route('categories.show', $category->parent_category->slug) }}" class="text-white text-decoration-none fw-600">
                                <i class="bi bi-arrow-up-circle me-1 text-primary"></i> {{ $category->parent_category->title }}
                            </a>
                        </div>
                    @endif
                </div>

                {{-- Metadata Card --}}
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4" data-aos="fade-left" data-aos-delay="200">
                    <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-calendar-check me-3 text-primary fs-5"></i>
                        <div>
                            <small class="text-muted d-block">{{ __('Indexed Since') }}</small>
                            <span class="fw-600 small">{{ $category->created_at->translatedFormat('M d, Y') }}</span>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-link-45deg me-3 text-primary fs-5"></i>
                        <div>
                            <small class="text-muted d-block">{{ __('Direct Link') }}</small>
                            <span class="fw-600 small">/{{ $category->slug }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</x-frontend.listing-shell>
@endsection
