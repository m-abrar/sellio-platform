@extends('frontend._layouts._app')

@section('title', page_content('services.search.meta_title', __('Professional Services & Solutions')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
    {{-- Page Heading Section --}}
    <div class="page-title-section my-3 mb-lg-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end gap-3 text-center text-md-start">
            
            <div class="title-content">
                <h1 class="fw-800 mb-2 display-6 text-dark tracking-tight">
                    @editable('services.search.heading', __('Professional Services'))
                </h1>
                <p class="text-muted mb-0 fs-6 fs-md-5 mx-auto mx-md-0 sub-heading">
                    @editable('services.search.sub_heading', __('Expert consultation and technical solutions.'))
                </p>
            </div>

            @if($services->total() > 0)
                <div class="results-count">
                    <span class="badge bg-white text-primary border shadow-sm px-4 py-2 rounded-pill fs-6 fw-bold">
                        <i class="bi bi-gear-fill me-1 text-primary"></i>
                        <span class="d-inline-block">
                            {{ $services->total() }} 
                            <span class="d-none d-sm-inline">{{ __('Services Available') }}</span>
                            <span class="d-inline d-sm-none">{{ __('Results') }}</span>
                        </span>
                    </span>
                </div>
            @endif
            
        </div>
    </div>

    <div class="row g-4">
        {{-- Sidebar Column --}}
        <aside class="col-12 col-lg-3">
            <div class="offcanvas-lg offcanvas-start rounded-4 border-0 shadow" tabindex="-1" id="filterSidebar">
                <div class="offcanvas-header bg-light d-lg-none border-bottom">
                    <h5 class="offcanvas-title fw-bold">{{ __('Refine Search') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#filterSidebar"></button>
                </div>
                <div class="offcanvas-body p-0">
                    @include('frontend.services._partials._sidebar_filter')
                </div>
            </div>
        </aside>

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            {{-- UPDATED: row-cols-2 ensures two items per row across most screen sizes --}}
            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-2"> 
                @forelse($services as $service)
                    <div class="col">
                        @include('frontend.services._partials._card', ['service' => $service])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-search display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Services Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters to find what you are looking for.') }}</p>
                            <a href="{{ route('services.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset All Filters') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
            @if($services->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $services->links('frontend._partials._pagination') }}
                </div>
            @endif

        </div>
    </div>

    {{-- Mobile Floating Filter Button --}}
    <div class="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3">
        <button class="btn btn-dark rounded-pill px-4 py-2 shadow-lg fw-bold d-flex align-items-center border-white border-2 backdrop-blur" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#filterSidebar"
                @click="isFilterOpen = true">
            <i class="bi bi-sliders2 me-2"></i> 
            {{ __('Filters') }}
            @if(request()->anyFilled(['category', 'expertise', 'location']))
                <span class="ms-2 badge rounded-pill bg-primary smaller">!</span>
            @endif
        </button>
    </div>
</div>
@endsection
