{{-- resources/views/frontend/marketplace/index.blade.php --}}
@extends('frontend.layouts.app')
@section('title', 'Unified Marketplace')

@section('template')
<link rel="stylesheet" href="{{ asset('css/themes/unifieds/mega1/style.css') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">

<section class="marketplace-page">

  {{-- ✅ 1. Navbar --}}
  @ include('frontend.partials.navbar')

  {{-- ✅ 2. Mini Heading --}}
  <div class="text-center py-4 border-bottom">
    <h1 class="fw-bold mb-1">Explore Our Categories</h1>
    <p class="text-muted">Find properties, autos, services, jobs and more — all in one place.</p>
  </div>

  {{-- ✅ 3. Category Grid --}}
  <section class="py-5 mega-showcase">
    <div class="container">
      <div class="row g-4">
        @php
          $categories = [
            ['name' => 'Properties', 'slug' => 'properties', 'color' => '#007bff', 'images' => [11,12,13], 'desc' => 'Find homes, apartments, and real estate deals.'],
            ['name' => 'Autos', 'slug' => 'autos', 'color' => '#28a745', 'images' => [21,22,23], 'desc' => 'Buy or sell cars, bikes and vehicles.'],
            ['name' => 'Events', 'slug' => 'events', 'color' => '#6f42c1', 'images' => [31,32,33], 'desc' => 'Discover concerts, conferences, and local happenings.'],
            ['name' => 'Classifieds', 'slug' => 'classifieds', 'color' => '#fd7e14', 'images' => [41,42,43], 'desc' => 'Post or find ads for anything, anywhere.'],
            ['name' => 'Services', 'slug' => 'services', 'color' => '#20c997', 'images' => [51,52,53], 'desc' => 'Hire trusted professionals and experts.'],
            ['name' => 'Jobs', 'slug' => 'jobs', 'color' => '#343a40', 'images' => [61,62,63], 'desc' => 'Explore top career opportunities.'],
          ];
        @endphp

        @foreach ($categories as $cat)
          <div class="col-12 col-md-6">
            <div id="{{ $cat['slug'] }}Carousel" class="carousel slide category-box" data-bs-ride="carousel">
              <div class="carousel-inner">
                @foreach ($cat['images'] as $index => $img)
                  <div class="carousel-item @if($loop->first) active @endif">
                    <img src="https://picsum.photos/800/400?random={{ $img }}" class="d-block w-100" alt="{{ $cat['name'] }}">
                  </div>
                @endforeach
              </div>
              <div class="overlay-content" style="background: linear-gradient(to top, {{ $cat['color'] }}bb, transparent);">
                <h3>{{ $cat['name'] }}</h3>
                <p>{{ $cat['desc'] }}</p>
              </div>
            </div>
          </div>
        @endforeach
      </div>
    </div>
  </section>

  {{-- ✅ 4. CTA Section --}}
  <section class="cta-banner text-center text-white py-5" style="background: linear-gradient(90deg, #0062cc, #20c997);">
    <div class="container">
      <h2 class="fw-bold mb-3">Start Listing or Selling Today</h2>
      <p class="mb-4">Join thousands of users buying, selling, and connecting every day.</p>
      <a href="/post-ad" class="btn btn-light px-4 py-2 fw-semibold">Post Your Ad</a>
    </div>
  </section>

  {{-- ✅ 5. Footer --}}
  @ include('frontend.partials.footer')

</section>

<style>
.marketplace-page {
  font-family: "Poppins", sans-serif;
}

/* --- Category Box --- */
.mega-showcase .category-box {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  cursor: pointer;
  height: 100%;
}
.mega-showcase .category-box img {
  object-fit: cover;
  width: 100%;
  height: 300px;
  filter: brightness(70%);
  transition: all 0.5s ease;
}
.mega-showcase .category-box:hover img {
  transform: scale(1.05);
  filter: brightness(50%);
}
.mega-showcase .overlay-content {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #fff;
  padding: 1.5rem;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0));
}
.mega-showcase .overlay-content h3 {
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.mega-showcase .overlay-content p {
  font-size: 0.9rem;
  margin-bottom: 0;
  opacity: 0.9;
}
</style>
@endsection
