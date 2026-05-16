{{-- Temporary PHP block to merge and standardize the collections --}}
@php
    // 1. Standardize Property data structure (3 random items)
    $properties = $propertiesFeatured->random(3)->map(function ($p) {
        return (object) [
            'image' => $p->primary_image_url,
            'title' => $p->title,
            // Using Category Name as primary info, Location Dot icon
            'info' => $p->category?->title, 
            'icon' => 'fa-location-dot',
            'price' => $p->price_formatted,
        ];
    });

    // 2. Standardize Auto data structure (3 items)
    $autos = $autosFeatured->take(3)->map(function ($a) {
        return (object) [
            // Assuming the Auto model has an 'image_url' and 'price_formatted' accessor
            'image' => $a->primary_image_url, 
            'title' => $a->make . ' ' . $a->model,
            // Using a common auto detail as info, Car icon
            'info' => $a->engine_type, 
            'icon' => 'fa-car',
            'price' => $a->price_formatted,
        ];
    });

    // 3. Standardize Classifieds data structure (3 random items)
    $classifieds = $classifiedsFeatured->random(3)->map(function ($c) {
        return (object) [
            // Assuming a Classified model has 'primary_image_url', 'title', and 'price_formatted'
            'image' => $c->primary_image_url, 
            'title' => $c->title,
            // Using the Condition or Category for info, Tag icon
            'info' => $c->condition ?? $c->category?->title, 
            'icon' => 'fa-tags',
            'price' => $c->price_formatted,
        ];
    });

    // 4. Standardize Services data structure (3 random items)
    $services = $servicesFeatured->random(3)->map(function ($s) {
        return (object) [
            // Assuming a Service model has 'image_url', 'title', and 'price_formatted'
            'image' => $s->primary_image_url, 
            'title' => $s->title,
            // Using the Service Type/Category for info, Wrench icon
            'info' => $s->category?->title, 
            'icon' => 'fa-wrench',
            'price' => $s->price_formatted, // Price might be "Contact for quote"
        ];
    });

    // 5. Merge all four collections and shuffle them for mixed display
    $combinedFeatured = $properties->merge($autos)->merge($classifieds)->merge($services)->shuffle();
@endphp

{{-- WRAPPER FOR OUTSIDE ARROWS --}}
<div class="trending-wrapper">
    <div id="trendingCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            {{-- Loop over the combined collection, chunking them into groups of 4 for each carousel-item slide --}}
            @foreach($combinedFeatured->chunk(4) as $chunkIdx => $chunk)
                
                {{-- Only the first chunk (index 0) gets the 'active' class --}}
                <div class="carousel-item @if($chunkIdx == 0) active @endif">
                    
                    {{-- Row container for the items in this chunk --}}
                    <div class="row g-4">
                        @foreach($chunk as $item)
                            {{-- The inner loop now uses the standardized $item object --}}
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div class="card listing-card card-no-radius shadow-sm h-100">
                                    {{-- Use $item->image --}}
                                    <img src="{{ $item->image }}" alt="{{ $item->title }}" class="card-img-top">
                                    <div class="card-body">
                                        {{-- Use $item->title --}}
                                        <h6 class="card-title mb-1 fw-bold">{{ $item->title }}</h6>
                                        {{-- Use standardized icon and info --}}
                                        <p class="text-muted small mb-2"><i class="fa {{ $item->icon }} me-1"></i> {{ $item->info }}</p>
                                        <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                                            {{-- Use $item->price --}}
                                            <span class="fw-bolder fs-5">{{ $item->price }}</span>
                                            <a href="#" class="btn btn-sm btn-outline-primary no-radius fw-semibold">View</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                </div>
            @endforeach
        </div>

        {{-- Arrows positioned OUTSIDE via CSS --}}
        <button class="carousel-control-prev no-radius" type="button" data-bs-target="#trendingCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next no-radius" type="button" data-bs-target="#trendingCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</div>