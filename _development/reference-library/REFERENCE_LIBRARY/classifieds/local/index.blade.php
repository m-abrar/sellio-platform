@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
    --primary-green: #66BB6A; /* Friendly Green */
    --primary-blue: #42A5F5;  /* Calming Blue */
    --dark-text: #424242;     /* Dark Gray for text */
    --light-bg: #F5F5F5;      /* Light Gray for dividers/UI */
    --font-family: 'Poppins', sans-serif;
}
</style>
@endpush

@section('content')
<div class="d-flex main-content">
    
    <div class="p-4 listing-panel">

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0 text-primary">{!! page_content('home.sidebar.heading', 'Nearby Listings') !!}</h4>
            <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Sort: Newest
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Price: Low to High</a></li>
                    <li><a class="dropdown-item" href="#">Distance: Closest</a></li>
                </ul>
            </div>
        </div>

        @foreach($classifieds as $classified)
            <div class="card card-listing mb-3 p-3 border-0" onclick="focusMapPin('pin-{{$classified->id}}')">
                <div class="d-flex align-items-center">
                    
                    {{-- START: MODIFIED SECTION FOR FEATURED IMAGE --}}
                    <div class="me-3 bg-light rounded d-flex justify-content-center align-items-center overflow-hidden" style="width: 60px; height: 60px;">
                        @if($classified->primary_image_url)
                            <img 
                                src="{{ $classified->primary_image_url }}" 
                                alt="{{ $classified->title }}" 
                                style="width: 100%; height: 100%; object-fit: cover;" 
                                onerror="this.style.display='none'; this.parentNode.innerHTML='<i class=\'bi bi-tag fs-4 text-secondary\'></i>';" 
                            />
                        @else
                            {{-- Fallback icon if no featured image is available --}}
                            <i class="{{$classified->category?->icon ?? 'bi bi-tag'}} fs-4 text-secondary"></i>
                        @endif
                    </div>
                    {{-- END: MODIFIED SECTION FOR FEATURED IMAGE --}}
                    
                    <div>
                        <h6 class="mb-1 fw-bold text-truncate" style="max-width: 250px;">{{$classified->title}}</h6>
                        <div class="d-flex align-items-center mb-1">
                            <p class="text-success fw-bold mb-0 fs-5">{{$classified->price_formatted_k}}</p>
                            <span class="badge {{ $classified->condition_badge_class }} ms-2">{{$classified->condition_label}}</span>
                        </div>
                        <small class="text-muted"><i class="bi bi-geo-alt-fill me-1"></i>{{ str_limit($classified->address ?? $classified->location?->title,20) }}</small>
                    </div>
                </div>
            </div>
        @endforeach

        @forelse($classifieds->where('is_featured',true)->take(2) as $classified)
            {{-- This section is only rendered ONCE before the first item --}}
            @if ($loop->first)
                <hr class="my-4" style="border-color: var(--light-bg);">
                <h5 class="fw-bold mb-3 text-primary">Your Neighborhood Alerts</h5>
            @endif
            
            {{-- The content that runs for each featured item --}}
            <div class="alert alert-success d-flex align-items-center p-2 rounded-3 mb-2" role="alert" style="background-color: #E8F5E9; border-left: 4px solid var(--primary-green); border-color: transparent;">
                <i class="bi bi-megaphone-fill me-2"></i>
                <div style="font-size: 0.9rem;">Featured Offer: **{{$classified->title}}** in **{{$classified->category?->title}}** <a href="{{ route('classifieds.show', $classified->slug) }}"><small>➡️</small></a></div>
            </div>
        @empty
            {{-- Nothing is rendered if the collection is empty/no featured items --}}
        @endforelse
        
        <hr class="my-4" style="border-color: var(--light-bg);">

        <h5 class="fw-bold mb-3 text-primary">Browse By Category</h5>

        <div class="d-flex flex-wrap gap-2">
            @foreach($categories as $category)
                <a 
                    href="?category={{$category->id}}" 
                    class="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center {{ request('category') == $category->id ? 'active' : ''}}" 
                    role="button"
                >
                    <i class="{{$category->icon ?? 'fas fa-tag'}} me-2"></i> {{$category->title}}
                </a>
            @endforeach
        </div>



    </div>

    <div class="map-container">
        <div class="position-absolute d-flex flex-column rounded-3 overflow-hidden shadow" style="top: 20px; right: 20px; z-index: 20;">
            <button class="btn btn-light border-bottom p-2" title="Zoom In"><i class="bi bi-plus-lg"></i></button>
            <button class="btn btn-light border-bottom p-2" title="Zoom Out"><i class="bi bi-dash-lg"></i></button>
            <button class="btn btn-light p-2" title="Recenter"><i class="bi bi-crosshair"></i></button>
        </div>

        @foreach($classifieds as $classified)
            {{-- Generate random positions for the pin --}}
            @php
                $randomTop = rand(10, 80); // Random top position between 10% and 80%
                $randomLeft = rand(10, 75); // Random left position between 10% and 75%
            @endphp

            {{-- Map Pin (no change here) --}}
            <div 
                id="pin-{{$classified->id}}" 
                class="map-pin" 
                style="top: {{ $randomTop }}%; left: {{ $randomLeft }}%;" 
                onclick="showPopup('popup-{{$classified->id}}')"
            >
                <div class="pin-body">
                    <i class="{{$classified->category->icon ?? 'bi bi-tag'}} pin-icon"></i>
                </div>
            </div>

            {{-- Popup Card (Image Added) --}}
            <div 
                id="popup-{{$classified->id}}" 
                class="card p-3 shadow rounded-3 position-absolute d-none" 
                style="top: {{ $randomTop }}%; left: {{ $randomLeft + 2 }}%; width: 250px; border-left: 4px solid var(--primary-green); z-index: 20;"
            >
                <h6 class="fw-bold mb-1 text-truncate">{{$classified->title}}</h6>
                
                {{-- START: ADDED FEATURED IMAGE --}}
                @if($classified->primary_image_url)
                    <div class="rounded overflow-hidden mb-2" style="height: 120px;">
                        <img 
                            src="{{ $classified->primary_image_url }}" 
                            alt="{{ $classified->title }}" 
                            class="img-fluid w-100 h-100" 
                            style="object-fit: cover;"
                        />
                    </div>
                @endif
                {{-- END: ADDED FEATURED IMAGE --}}
                
                <p class="text-success fw-bold fs-5 mb-2">{{$classified->price_formatted_k}}</p>
                <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-person-circle fs-5 me-2 text-muted"></i>
                    <small class="text-muted">Posted by **{{$classified->user?->company ?? $classified->user?->name}}**</small>
                </div>
                
                <div class="d-grid gap-2">
                    <a href="{{ route('conversation.start', $classified->user) }}" class="btn btn-success btn-sm">Message Seller</a>
                    <a href="{{ route('classifieds.show', $classified->slug) }}" class="btn btn-outline-primary btn-sm">View Details</a>
                </div>
                
                <button class="btn-close position-absolute top-0 end-0 m-2" onclick="hidePopup('popup-{{$classified->id}}')" aria-label="Close"></button>
            </div>
        @endforeach

    </div>
</div>
@endsection


@push('scripts')
<script>
    function hideAllPopups() {
        document.querySelectorAll('.card[id^="popup"]').forEach(popup => {
            popup.classList.add('d-none');
        });
    }
    function showPopup(popupId) {
        hideAllPopups();
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.remove('d-none');
        }
    }
    function hidePopup(popupId) {
        document.getElementById(popupId).classList.add('d-none');
    }
    // Simulate focusing a pin when clicking the list item
    function focusMapPin(pinId) {
            // In a real app, this would pan the map to the pin's coordinates
            showPopup(pinId.replace('pin', 'popup'));
            // Optional: highlight the pin with a CSS class
            console.log(`Simulating map pan to ${pinId}`);
    }
</script>
@endpush