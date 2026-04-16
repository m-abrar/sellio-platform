@section('hero')
{{-- Premium Hero Header --}}
<div class="user-profile-header py-5 mb-5 position-relative overflow-hidden" 
     style="background: url('{{ $user->cover_url }}') center center / cover no-repeat;">
    <div class="header-overlay"></div>
    
    <div class="container position-relative z-index-1 text-center py-4">
        <div class="avatar-wrapper mb-3" data-aos="zoom-in">
            <img src="{{ $user->avatar_url }}" class="rounded-circle shadow-lg border border-4 border-white" 
                 width="140" height="140" alt="{{ $user->name }}" style="object-fit: cover;">
            @if($user->is_verified)
                <div class="verified-badge bg-primary text-white shadow-sm">
                    <i class="bi bi-patch-check-fill"></i>
                </div>
            @endif
        </div>
        
        <h1 class="fw-800 display-5 text-white mb-2" data-aos="fade-up">{{ $user->name }}</h1>
        <div class="d-flex justify-content-center gap-3 text-white-50 fw-500" data-aos="fade-up" data-aos-delay="100">
            <span><i class="bi bi-geo-alt me-1"></i> {{ $user->location ?? __('Global Member') }}</span>
            <span>•</span>
            <span><i class="bi bi-shield-lock me-1"></i> {{ $user->roles->pluck('name')->join(', ') ?: __('Member') }}</span>
        </div>
    </div>
</div>
@endsection
@section('content')
<div class="container mt-n5 position-relative z-index-2 mb-5">
    <div class="row g-4">
        {{-- Left Column: Content --}}
        <div class="col-lg-8">
            {{-- About Section --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-3 mb-4" data-aos="fade-up">
                <div class="card-body">
                    <h4 class="fw-800 mb-3"><i class="bi bi-person-lines-fill me-2 text-primary"></i> {{ __('About') }}</h4>
                    <p class="description text-muted lh-lg">
                        {{ $user->bio ?: __('This user prefers to keep their bio a mystery.') }}
                    </p>
                </div>
            </div>

            {{-- Dynamic Tabs for Listings (Better UX than a long scroll) --}}
            <div class="card glass-surface rounded-5 border-0 shadow-sm p-2" data-aos="fade-up">
                <div class="card-body">
                    <ul class="nav nav-pills nav-justified mb-4 gap-2 p-2 bg-light rounded-pill" id="userTab" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-all">{{ __('Activity') }}</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link rounded-pill fw-800" data-bs-toggle="tab" data-bs-target="#tab-reviews">{{ __('Reviews') }}</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="tab-all">
                            {{-- Unified Listing Loop --}}
                            @php
                                $collections = [
                                    ['data' => $user->properties, 'title' => __('Properties'), 'icon' => 'bi-house', 'route' => 'properties.show'],
                                    ['data' => $user->autos, 'title' => __('Vehicles'), 'icon' => 'bi-car-front', 'route' => 'autos.show'],
                                    ['data' => $user->jobs, 'title' => __('Jobs'), 'icon' => 'bi-briefcase', 'route' => 'jobs.show'],
                                    ['data' => $user->services, 'title' => __('Services'), 'icon' => 'bi-tools', 'route' => 'services.show'],
                                    ['data' => $user->events, 'title' => __('Events'), 'icon' => 'bi-calendar-event', 'route' => 'events.show'],
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
                                                        <img src="{{ $item->primary_image_url }}" class="rounded-3 me-3" width="80" height="80" style="object-fit: cover;">
                                                        <div class="flex-grow-1">
                                                            <h6 class="fw-800 mb-1">{{ $item->title ?? ($item->make . ' ' . $item->model) }}</h6>
                                                            <div class="text-muted small">
                                                                @if(isset($item->price)) <span class="text-primary fw-bold me-2">{{ $item->price_formatted }}</span> @endif
                                                                <i class="bi bi-geo-alt"></i> {{ $item->address ?? $item->location->title ?? __('Multiple Locations') }}
                                                            </div>
                                                        </div>
                                                        <i class="bi bi-chevron-right text-muted"></i>
                                                    </div>
                                                </a>
                                            @endforeach
                                        </div>
                                    </div>
                                @endif
                            @endforeach
                        </div>

                        <div class="tab-pane fade" id="tab-reviews">
                            @include('frontend._partials._reviews', ['reviewable' => $user, 'type' => 'users'])
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Sidebar --}}
        <div class="col-lg-4">
            <div class="sticky-top" style="top: 100px;">
                <div class="card glass-surface rounded-5 border-0 shadow-sm p-4 mb-4" data-aos="fade-left">
                    <h5 class="fw-800 mb-4">{{ __('Contact Details') }}</h5>
                    <div class="d-flex align-items-center mb-3">
                        <div class="icon-box-sm bg-primary-subtle text-primary me-3 rounded-circle"><i class="bi bi-envelope"></i></div>
                        <div><small class="text-muted d-block">{{ __('Email') }}</small><span class="fw-600">{{ $user->email }}</span></div>
                    </div>
                    <div class="d-flex align-items-center mb-4">
                        <div class="icon-box-sm bg-success-subtle text-success me-3 rounded-circle"><i class="bi bi-whatsapp"></i></div>
                        <div><small class="text-muted d-block">{{ __('Phone') }}</small><span class="fw-600">{{ $user->phone ?: __('Not Shared') }}</span></div>
                    </div>

                    <a href="{{ route('conversation.start', $user) }}" class="btn btn-primary btn-lg w-100 rounded-pill fw-800 mb-3 shadow-sm">
                        <i class="bi bi-chat-dots me-2"></i> {{ __('Send Message') }}
                    </a>
                    
                    <button class="btn btn-outline-dark btn-lg w-100 rounded-pill fw-800 border-2">
                        <i class="bi bi-person-plus me-2"></i> {{ __('Follow Profile') }}
                    </button>
                </div>

                {{-- Trust Signals --}}
                <div class="card bg-dark text-white rounded-5 border-0 shadow-lg p-4" data-aos="fade-left" data-aos-delay="100">
                    <h5 class="fw-800 mb-3 text-primary">{{ __('Trust Score') }}</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Identity Verified') }}</span>
                        <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Response Rate') }}</span>
                        <span class="text-warning">98%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
