@extends('frontend._layouts._app')

@section('title', config('site_name', 'Welcome'))

@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
    --bs-primary: #007bff; /* Light blue accent */
    --bs-secondary: #6c757d; /* Gray */
    --bs-light: #f8f9fa; /* Light gray/white */
    --bs-body-font-family: 'Inter', sans-serif; /* Recommended clean sans-serif */
}
</style>
@endpush

@section('content')
<main class="container-fluid container-xl py-4">
    <div class="row g-4">
        
        <div class="col-lg-3">
            <h5 class="mb-3 text-secondary">{!! page_content('global.sidebar.heading', 'EXPLORE CATEGORIES') !!}</h5>
            <div class="d-flex flex-column sidebar">
                @foreach($categories as $category)
                    <a href="?category={{$category->id}}" class="category-link d-flex align-items-center {{ request('category') == $category->id ? 'active' : ''}}">
                        <i class="{{$category->icon ?? 'fas fa-tag'}} fa-fw me-2"></i> {{$category->title}}
                    </a>
                @endforeach
            </div>
        </div>
        
        <div class="col-lg-9">
            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                
                @foreach($classifieds as $classified)
                <div class="col">
                    <div class="card h-100 listing-card">
                        <img src="{{$classified->primary_image_url}}" class="card-img-top" alt="{{$classified->title}}">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title fw-semibold">{{$classified->title}}</h6>
                            
                            <p class="price fs-5 mb-1">{{$classified->price_formatted}}</p>
                            
                            <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
                                <div class="d-flex align-items-center">
                                    <i class="fas fa-user-circle me-1 text-secondary"></i>
                                    <small class="text-muted">User113</small>
                                </div>
                                <!-- TODO add on the image, and show only on hover -->
                                <i class="far fa-heart me-1"></i>
                                <button class="btn btn-sm btn-primary"><i class="fas fa-comment-dots me-1"></i>Message</button>
                                
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        
    </div>
</main>
@endsection