@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-orange: #FF6700; /* Energetic Orange */
            --accent-cyan: #00BCD4; /* Bright Cyan */
            --text-dark: #212529;
            --bg-light: #f4f6f9; /* Slightly deeper light background for contrast */
            --card-shadow: rgba(149, 157, 165, 0.1); /* Lighter shadow */
        }
    </style>
@endpush

@section('content')

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
    <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">CLSFD Menu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <input type="search" class="form-control search-input-mobile mb-3" placeholder="Search Everything">
        
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
                <a class="nav-link accent-cyan active" aria-current="page" href="#">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link accent-cyan" href="#">Cars</a>
            </li>
            <li class="nav-item">
                <a class="nav-link accent-cyan" href="#">Electronics</a>
            </li>
            <li class="nav-item">
                <a class="nav-link accent-cyan" href="#">Real Estate</a>
            </li>
            <li class="nav-item mt-4 pt-2 border-top">
                <button class="btn btn-post-ad w-100" type="button">Post Your Ad Now</button>
            </li>
        </ul>
    </div>
</div>

<div class="container-xl py-4">
    <h2 class="mb-4 pt-3 font-weight-bold">Recent Listings</h2>

    <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
    
        @foreach($classifieds as $classified)
        <div class="col">
            <div class="card card-classified shadow-sm">
                @if($classified->is_featured)
                <span class="card-badge">Featured</span>
                @elseif($classified->is_new)
                <span class="card-badge bg-accent-cyan" style="background-color: var(--accent-cyan) !important;">Recent Listing</span>
                @elseif($classified->is_sale)
                <span class="card-badge bg-success">Sale</span>
                @else
                <span class="card-badge {{ $classified->condition_badge_class }}">{{$classified->condition_label}}</span>
                @endif
                <img src="{{$classified->primary_image_url}}" class="card-img-top" alt="{{$classified->title}}">
                <div class="card-body p-3">
                    <h5 class="card-title mb-1 text-truncate">{{$classified->title}}</h5>
                    <p class="text-muted small mb-2"><i class="fas fa-map-marker-alt me-1"></i> {{ str_limit($classified->address ?? $classified->location?->title,20) }} - {{ $classified->created_at->diffForHumans() }}</p>
                    <div class="d-flex justify-content-between align-items-end mt-2">
                        <span class="price text-primary-orange">{{$classified->price_formatted}}</span>
                        <div class="d-flex gap-2">
                            <a href="#" class="icon-btn" data-bs-toggle="modal" data-bs-target="#quickViewModal" title="Quick View"><i class="fas fa-eye"></i></a>
                            <a href="#" class="icon-btn" title="Add to Favorites"><i class="fas fa-heart"></i></a>
                            <a href="#" class="icon-btn" title="Share on Social"><i class="fas fa-share-alt"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    
    
        
    </div>
    
    <nav aria-label="Page navigation" class="mt-5 d-flex justify-content-center">
        <ul class="pagination">
            <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>
            <li class="page-item active"><a class="page-link bg-primary-orange border-primary-orange" href="#">1</a></li>
            <li class="page-item"><a class="page-link text-primary-orange" href="#">2</a></li>
            <li class="page-item"><a class="page-link text-primary-orange" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
    </nav>
</div>

<div class="modal fade" id="quickViewModal" tabindex="-1" aria-labelledby="quickViewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
            <div class="modal-header border-0 pb-0">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-0 text-center">
                <img src="https://via.placeholder.com/300x180/50B4C8/FFFFFF?text=Jacket+Quick+View" class="img-fluid rounded-3 mb-3" alt="Quick View Image">
                <h5 class="card-title mb-1">Vintage Leather Jacket</h5>
                <p class="text-muted small mb-3">City, State | Posted 5 hours ago</p>
                <span class="price text-primary-orange mb-3 d-block">$120</span>
                <p class="text-muted small">Brief description of the item goes here. This is a quick summary for immediate viewing.</p>
                
                <div class="d-flex justify-content-center gap-3 my-4 border-top pt-3">
                    <a href="#" class="icon-btn footer-social"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="icon-btn footer-social"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="icon-btn footer-social"><i class="fab fa-instagram"></i></a>
                </div>

                <a href="#" class="btn btn-sm btn-outline-secondary me-2">Message Seller</a>
                <a href="#" class="btn btn-sm btn-post-ad">View Full Details</a>
            </div>
        </div>
    </div>
</div>

@endsection