@extends('frontend._layouts._app')

@push('styles')
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
@endpush

@section('header')
    
@endsection


@section('content')
    <div class="main-content d-flex flex-grow-1">

        <div class="listings-panel col-lg-5 p-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="mb-0">{!! page_content('home.sidebar.heading', 'Listings') !!} <span class="badge bg-secondary rounded-pill">{{$properties->count()}}</span></h4>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm mobile-view-toggle me-3" role="group" aria-label="View toggle">
                        <button type="button" class="btn btn-outline-primary active" id="mapViewBtn">Map View</button>
                        <button type="button" class="btn btn-outline-primary" id="listViewBtn">List View</button>
                    </div>
                    <div class="dropdown me-2">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuFilters" data-bs-toggle="dropdown" aria-expanded="false">
                            Filters
                        </button>
                        <ul class="dropdown-menu p-3" aria-labelledby="dropdownMenuFilters">
                            <li><h6 class="dropdown-header">Price</h6></li>
                            <li><input type="range" class="form-range" min="0" max="2000000" step="10000" value="500000"></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><h6 class="dropdown-header">Bedrooms</h6></li>
                            <li>
                                <select class="form-select form-select-sm">
                                    <option selected>Any</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                </select>
                            </li>
                        </ul>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuSort" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort by
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuSort">
                            <li><a class="dropdown-item" href="#">Newest</a></li>
                            <li><a class="dropdown-item" href="#">Lowest Price</a></li>
                            <li><a class="dropdown-item" href="#">Highest Price</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="property-list">
                
                @foreach ($properties as $property)
                <div class="card mb-3 property-card" data-pin-id="pin{{$property->id}}">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="{{$property->primary_image_url}}" class="img-fluid rounded-start h-100 object-fit-cover" alt="{{$property->title}}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title text-primary">{{$property->price_formatted_k}}</h5>
                                <p class="card-text mb-1">{{$property->category?->title}} – {{$property->number_of_bedrooms}} Bed, {{$property->number_of_bathrooms}} Bath</p>
                                <p class="card-text"><small class="text-muted">{{$property->address ?? $property->location?->title}}</small></p>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach

            </div>
        </div>

        <div class="map-container col-lg-7 position-relative">
            <div class="map-placeholder d-flex align-items-center justify-content-center h-100 w-100">
                @foreach ($properties as $property)
                <div class="map-pin" id="pin{{$property->id}}" data-card-id="pin{{$property->id}}">{{$property->price_formatted_k}}</div>
                @endforeach
            </div>
        </div>
    </div>

    <section class="featured-listing mt-4 mb-4">
        <div class="container text-center">
            @foreach ($properties->take(1)->where('is_featured', true) as $property)
            <h2 class="display-5 fw-bold mb-3">Featured Listing</h2>
            <p class="lead mb-4">{{$property->title}} – {{$property->price_formatted_k}}</p>
            <a href="{{route('properties.show', $property)}}" class="btn btn-success btn-lg">See More Details <i class="bi bi-arrow-right"></i></a>
            @endforeach
        </div>
    </section>
@endsection



@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const propertyCards = document.querySelectorAll('.property-card');
            const mapPins = document.querySelectorAll('.map-pin');
            const listingsPanel = document.querySelector('.listings-panel');
            const mainContent = document.querySelector('.main-content');
            const mapViewBtn = document.getElementById('mapViewBtn');
            const listViewBtn = document.getElementById('listViewBtn');

            function highlightItem(cardElement, pinElement) {
                // Remove active from all cards and pins
                propertyCards.forEach(card => card.classList.remove('active'));
                mapPins.forEach(pin => pin.classList.remove('active'));

                // Add active to selected card and pin
                if (cardElement) cardElement.classList.add('active');
                if (pinElement) pinElement.classList.add('active');
            }

            // Card hover/click interaction
            propertyCards.forEach(card => {
                const pinId = card.dataset.pinId;
                const correspondingPin = document.getElementById(pinId);

                card.addEventListener('mouseenter', () => highlightItem(card, correspondingPin));
                card.addEventListener('mouseleave', () => highlightItem(null, null)); // De-highlight
                card.addEventListener('click', () => {
                    highlightItem(card, correspondingPin);
                    // Scroll map into view on mobile if card is clicked
                    if (window.innerWidth < 992) {
                        mainContent.classList.remove('list-view-active');
                        mainContent.classList.add('map-view-active');
                        mapViewBtn.classList.add('active');
                        listViewBtn.classList.remove('active');
                    }
                });
            });

            // Pin click interaction
            mapPins.forEach(pin => {
                const cardId = pin.dataset.cardId;
                const correspondingCard = document.querySelector(`.property-card[data-pin-id="${cardId}"]`);

                pin.addEventListener('click', () => {
                    highlightItem(correspondingCard, pin);
                    if (correspondingCard) {
                        correspondingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    // On mobile, switch to list view if map pin is clicked
                    if (window.innerWidth < 992) {
                        mainContent.classList.remove('map-view-active');
                        mainContent.classList.add('list-view-active');
                        listViewBtn.classList.add('active');
                        mapViewBtn.classList.remove('active');
                    }
                });
            });

            // Mobile view toggle functionality
            if (window.innerWidth < 992) {
                mainContent.classList.add('map-view-active'); // Default to map view on mobile
                mapViewBtn.classList.add('active');
            }

            mapViewBtn.addEventListener('click', () => {
                mainContent.classList.remove('list-view-active');
                mainContent.classList.add('map-view-active');
                mapViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            });

            listViewBtn.addEventListener('click', () => {
                mainContent.classList.remove('map-view-active');
                mainContent.classList.add('list-view-active');
                listViewBtn.classList.add('active');
                mapViewBtn.classList.remove('active');
            });
        });
    </script>
@endpush