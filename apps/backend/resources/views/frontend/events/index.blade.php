@extends('frontend._layouts._app')

@section('title', page_content('events.search.meta_title', __('Upcoming Community & Tech Events')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
    {{-- Page Heading Section --}}
    <div class="page-title-section my-3 mb-lg-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end gap-3 text-center text-md-start">
            
            <div class="title-content">
                <h1 class="fw-800 mb-2 display-6 text-dark tracking-tight">
                    @editable('events.search.heading', __('Events & Workshops'))
                </h1>
                <p class="text-muted mb-0 fs-6 fs-md-5 mx-auto mx-md-0 sub-heading">
                    @editable('events.search.sub_heading', __('Don\'t miss the next big conference or local meetup.'))
                </p>
            </div>

            @if($events->total() > 0)
                <div class="results-count">
                    <span class="badge bg-white text-primary border shadow-sm px-4 py-2 rounded-pill fs-6 fw-bold">
                        <i class="bi bi-calendar-check-fill me-1 text-primary"></i>
                        <span class="d-inline-block">
                            {{ $events->total() }} 
                            <span class="d-none d-sm-inline">{{ __('Events Found') }}</span>
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
                    <h5 class="offcanvas-title fw-bold">{{ __('Filters') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#filterSidebar"></button>
                </div>
                <div class="offcanvas-body p-0">
                    @include('frontend.events._partials._sidebar-filter-events')
                </div>
            </div>
        </aside>

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($events as $event)
                    <div class="col">
                        @include('frontend.events._partials._card-event', ['event' => $event])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-calendar-x display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Events Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters or dates to find upcoming events.') }}</p>
                            <a href="{{ route('events.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('View All Events') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
            @if($events->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $events->links('frontend._partials._pagination') }}
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
            @if(request()->anyFilled(['category', 'date_start', 'location']))
                <span class="ms-2 badge rounded-pill bg-primary" style="font-size: 0.7rem;">!</span>
            @endif
        </button>
    </div>
</div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            flatpickr(".event-date-picker", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        });
    </script>
@endpush
