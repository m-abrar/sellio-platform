@extends('frontend._layouts._app')

{{-- Use the full site name in the title tag --}}
@section('title', 'StayFind - Find Your Perfect Stay')


@push('styles')
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
:root {
    --color-primary: #0077b6;
    --color-secondary: #48cae4;
    --sandy-beige: #fefae0;
    --light-gray: #f8f9fa;
    --dark-text: #343a40;
    --light-text: #6c757d;
    --white: #ffffff;
    --border-color: #dee2e6;
    --font-heading: 'Poppins', sans-serif;
    --font-body: 'Poppins', sans-serif;
    --border-radius: 12px;
    --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
@endpush

@section('content')



    
    <header class="hero-section">
        <div class="container">
            <div class="row">
                <div class="col-lg-8">
                    <h1>{{ page_content('home.hero.heading', 'Find Your Perfect Stay —') }}</h1>
                    <p class="lead">{{ page_content('home.hero.paragraph', 'Book Short or Long Term Rentals.') }}</p>
                    <div class="hero-buttons">
                        <a href="{{ page_content('home.hero.button_1_link', '#') }}#" class="btn btn-primary btn-lg">{{ page_content('home.hero.button_1', 'Browse Rentals') }}</a>
                        <a href="{{ page_content('home.hero.button_2_link', '#') }}#" class="btn btn-outline-light btn-lg">{{ page_content('home.hero.button_2', 'View on Map') }}</a>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <div class="container my-5">
        <section class="featured-rentals">
            <h2 class="section-title">{{ page_content('home.featured.heading', 'Featured Rentals') }}</h2>
            <div class="row g-4">
                {{-- Featured Rental Cards --}}
                @foreach ($properties as $property)
                    @if ($loop->iteration > 4)
                        @break
                    @endif

                    <div class="col-lg-3 col-md-6">
                        <div class="rental-card">
                            {{-- Use a dynamic property image URL --}}
                            <img src="{{ $property->primary_image_url }}" class="card-img-top" alt="{{ $property->title }}">
                            <div class="card-body">
                                {{-- Use the 'name' column for the title --}}
                                <h5 class="card-title">{{ str_limit($property->title,20) }}</h5>
                                {{-- Use the determined price --}}
                                <p class="card-price">{{ $property->price_formatted }}</p>
                                {{-- Use 'bedrooms' and 'bathrooms' columns --}}
                                <p class="card-details">
                                    <i class="bi bi-door-open"></i> {{ $property->number_of_bedrooms ?? 0 }} Bed 
                                    <span class="mx-2">|</span> 
                                    <i class="bi bi-droplet"></i> {{ $property->number_of_bathrooms ?? 0 }} Bath
                                </p>
                                {{-- Use the dynamic status and class --}}
                                <span class="badge {{ $property->is_rental ? 'bg-primary-soft' : 'bg-success-soft' }}">{{ $property->is_rental ? 'Available for Rent' : 'Available For Sale' }}</span>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>

        <section class="booking-lifestyle my-5">
            <div class="row g-5">
                <div class="col-lg-6">
                    <div class="booking-widget">
                        <h2 class="section-title">Availability & Booking</h2>
                        <form>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label for="guests" class="form-label">Guests</label>
                                    <select id="guests" class="form-select">
                                        <option selected>2 Guests</option>
                                        <option>3 Guests</option>
                                        <option>4+ Guests</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="duration" class="form-label">Duration</label>
                                    <select id="duration" class="form-select">
                                        <option selected>Short-term</option>
                                        <option>Long-term</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label for="pricerange" class="form-label">Price Range</label>
                                    <input type="range" class="form-range" id="pricerange">
                                </div>
                            </div>
                            <div class="calendar-grid mt-4">
                                <div class="calendar-header">
                                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                                </div>
                                <div class="calendar-body">
                                    <div class="day disabled">29</div><div class="day disabled">30</div>
                                    <div class="day">1</div><div class="day">2</div><div class="day">3</div><div class="day">4</div><div class="day">5</div>
                                    <div class="day">6</div><div class="day">7</div><div class="day selected">8</div><div class="day selected">9</div><div class="day">10</div><div class="day">11</div><div class="day">12</div>
                                    <div class="day">13</div><div class="day">14</div><div class="day">15</div><div class="day">16</div><div class="day">17</div><div class="day booked">18</div><div class="day booked">19</div>
                                    <div class="day">20</div><div class="day">21</div><div class="day">22</div><div class="day">23</div><div class="day">24</div><div class="day">25</div><div class="day">26</div>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-4">Check Availability</button>
                        </form>
                    </div>
                </div>

                <div class="col-lg-6">
                    <h2 class="section-title">{{ page_content('home.features.heading', 'Lifestyle & Experiences') }}</h2>
                    <div class="row g-3">
                        {{-- TODO read from CRUD --}}
                        <div class="col-6">
                            <div class="lifestyle-card">
                                <img src="https://images.unsplash.com/photo-1507525428034-b723a9ce6ad3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Beach">
                                <div class="lifestyle-caption">Beach Living</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="lifestyle-card">
                                <img src="https://images.unsplash.com/photo-1549638441-b78755e1371b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Hiking">
                                <div class="lifestyle-caption">Nature Retreats</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="lifestyle-card">
                                <img src="https://images.unsplash.com/photo-1524234103264-3942c7a5a8a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="City">
                                <div class="lifestyle-caption">City Nightlife</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="lifestyle-card">
                                <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Coworking">
                                <div class="lifestyle-caption">Coworking Ready</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section class="agent-highlight my-5">
            <h2 class="section-title">{{ page_content('home.agents.heading', 'Agent/Host Highlight') }}</h2>
            <div class="row g-4">
                {{-- Agent Card Loop: Iterate over the first 3 agents --}}
                @foreach ($agents->take(3) as $agent)
                    <div class="col-md-4">
                        <div class="agent-card text-center">
                            {{-- Agent Image: Use photo_url or a placeholder with the first letter of the name --}}
                            <img 
                                src="{{ $agent->avatar_url }}" 
                                alt="{{ $agent->name }}" 
                                class="agent-avatar rounded-circle mb-3"
                            >
                            <h5 class="agent-name">{{ $agent->name }}</h5>
                            <p class="agent-specialty text-muted">
                                {{ $agent->specialty ?? 'Real Estate Expert' }}
                            </p>
                            
                            {{-- Star Rating Logic (Copied from the provided logic) --}}
                            <div class="star-rating mb-3">
                                @php
                                    $rating = $agent->rating('property') ?? 0;
                                @endphp
                                @for ($i = 1; $i <= 5; $i++)
                                    @if ($rating >= $i)
                                        <i class="bi bi-star-fill text-warning"></i>
                                    @elseif ($rating > $i - 1)
                                        <i class="bi bi-star-half text-warning"></i>
                                    @else
                                        <i class="bi bi-star text-muted"></i>
                                    @endif
                                @endfor
                            </div>
                            
                            <a href="{{ route('partner.profile', $agent->username) }}" 
                            class="btn btn-outline-secondary btn-sm">
                                Contact {{ Str::of($agent->name)->contains(' ') ? 'Team' : 'Agent' }}
                            </a>
                        </div>
                    </div>
                @endforeach
                {{-- End Agent Card Loop --}}

                {{-- Add Placeholder Cards if agents count is less than 3 --}}
                @for ($i = $agents->count(); $i < 3; $i++)
                    <div class="col-md-4">
                        <div class="agent-card text-center">
                            <img src="{{asset('images/fallbacks/default-avatar.png')}}" 
                                alt="New Host Coming Soon"
                                class="agent-avatar rounded-circle mb-3">
                            <h5 class="agent-name">Join Our Team</h5>
                            <p class="agent-specialty text-muted">
                                Expert Position Open
                            </p>
                            <div class="star-rating mb-3">
                                <i class="bi bi-star text-muted"></i><i class="bi bi-star text-muted"></i><i class="bi bi-star text-muted"></i><i class="bi bi-star text-muted"></i><i class="bi bi-star text-muted"></i>
                            </div>
                            <a href="{{ route('register') }}?partner" class="btn btn-outline-secondary btn-sm">Apply Now</a>
                        </div>
                    </div>
                @endfor

                {{-- If there are no agents at all, you might want to show a single message --}}
                @if ($agents->isEmpty())
                    <div class="col-12 text-center">
                        <p class="text-muted">No agents available at the moment, but check back soon!</p>
                    </div>
                @endif
            </div>
        </section>


    </div>
@endsection

@push('scripts')
    {{-- Add the custom JS listener --}}
    <script>
        // Add scrolled class to navbar on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    </script>
@endpush