@foreach(($publicModules ?? collect())->take(8) as $module)
<div class="tab-pane fade @if($loop->first) show active @endif"
     id="hero-search-{{ $module['id'] }}"
     data-hero-pane
     role="tabpanel"
     aria-labelledby="{{ $module['id'] }}-tab"
     @unless($loop->first) hidden @endunless>

    {{-- ── PROPERTIES ────────────────────────────────────────────── --}}
    @if($module['id'] === 'properties')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-search hsf-icon" aria-hidden="true"></i>
                <input type="text" name="q" class="hsf-input"
                       placeholder="{{ __('Address, city, or ZIP code…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Search') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($propertyLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($propertyLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="property_type" class="hsf-filter-select">
                <option value="">{{ __('Buy or Rent') }}</option>
                <option value="sale">{{ __('For Sale') }}</option>
                <option value="rental">{{ __('For Rent') }}</option>
            </select>
            @if(($propertyCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('Any Type') }}</option>
                @foreach($propertyCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                   placeholder="{{ __('Max price') }}" min="0" step="1000">
        </div>
    </form>

    {{-- ── AUTOS ─────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'autos')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-car-front-fill hsf-icon" aria-hidden="true"></i>
                <input type="text" name="make" class="hsf-input"
                       placeholder="{{ __('Make, brand, or model…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Find Cars') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($autoLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($autoLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($autoCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('Any Category') }}</option>
                @foreach($autoCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="type" class="hsf-filter-select">
                <option value="">{{ __('Selling or Lease') }}</option>
                <option value="selling">{{ __('For Sale') }}</option>
                <option value="lease">{{ __('Lease') }}</option>
            </select>
            <select name="transmission" class="hsf-filter-select">
                <option value="">{{ __('Any Transmission') }}</option>
                <option value="Automatic">{{ __('Automatic') }}</option>
                <option value="Manual">{{ __('Manual') }}</option>
            </select>
        </div>
    </form>

    {{-- ── PRODUCTS ──────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'products')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-bag-check-fill hsf-icon" aria-hidden="true"></i>
                <input type="text" name="q" class="hsf-input"
                       placeholder="{{ __('Products, brands, or categories…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-bag me-1"></i>{{ __('Shop') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($productCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($productCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($productLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($productLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── SERVICES ──────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'services')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-tools hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('What service do you need?') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Find Pros') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($serviceLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($serviceLocations as $loc)
                    <option value="{{ $loc->id }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($serviceCategories ?? collect())->isNotEmpty())
            <select name="category_id" class="hsf-filter-select">
                <option value="">{{ __('All Service Types') }}</option>
                @foreach($serviceCategories as $cat)
                    <option value="{{ $cat->id }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min price') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max price') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── JOBS ──────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'jobs')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-briefcase hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Job title or company…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-briefcase me-1"></i>{{ __('Find Jobs') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($jobLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($jobLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            <select name="workplace_type" class="hsf-filter-select">
                <option value="">{{ __('Work Type') }}</option>
                <option value="remote">{{ __('Remote') }}</option>
                <option value="hybrid">{{ __('Hybrid') }}</option>
                <option value="on-site">{{ __('On-site') }}</option>
            </select>
            @if(($jobCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($jobCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
        </div>
    </form>

    {{-- ── EVENTS ────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'events')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-calendar-event hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Events, workshops, or venues…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-calendar-event me-1"></i>{{ __('Find Events') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($eventLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($eventLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($eventCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Types') }}</option>
                @foreach($eventCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <input type="date" name="date" class="hsf-filter-select hsf-date-input"
                   min="{{ now()->format('Y-m-d') }}"
                   title="{{ __('Event date') }}">
        </div>
    </form>

    {{-- ── CLASSIFIEDS ───────────────────────────────────────────── --}}
    @elseif($module['id'] === 'classifieds')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-tag hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Electronics, furniture, cameras…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-search me-1"></i>{{ __('Browse') }}
            </button>
        </div>
        <div class="hsf-filters-row">
            @if(($classifiedLocations ?? collect())->isNotEmpty())
            <select name="location" class="hsf-filter-select">
                <option value="">{{ __('Any Location') }}</option>
                @foreach($classifiedLocations as $loc)
                    <option value="{{ $loc->slug }}">{{ $loc->title }}</option>
                @endforeach
            </select>
            @endif
            @if(($classifiedCategories ?? collect())->isNotEmpty())
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Categories') }}</option>
                @foreach($classifiedCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            @endif
            <div class="hsf-price-range-pair">
                <input type="number" name="min_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Min') }}" min="0">
                <input type="number" name="max_price" class="hsf-filter-select hsf-price-input"
                       placeholder="{{ __('Max') }}" min="0">
            </div>
        </div>
    </form>

    {{-- ── BLOGS ─────────────────────────────────────────────────── --}}
    @elseif($module['id'] === 'blogs')
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-journal-text hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Articles, guides, and updates…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">
                <i class="bi bi-book me-1"></i>{{ __('Read') }}
            </button>
        </div>
        @if(($blogCategories ?? collect())->isNotEmpty())
        <div class="hsf-filters-row">
            <select name="category" class="hsf-filter-select">
                <option value="">{{ __('All Topics') }}</option>
                @foreach($blogCategories as $cat)
                    <option value="{{ $cat->slug }}">{{ $cat->title }}</option>
                @endforeach
            </select>
            <select name="sort" class="hsf-filter-select">
                <option value="">{{ __('Sort by') }}</option>
                <option value="latest">{{ __('Latest') }}</option>
                <option value="popular">{{ __('Most Popular') }}</option>
            </select>
        </div>
        @endif
    </form>

    {{-- ── FALLBACK ──────────────────────────────────────────────── --}}
    @else
    <form class="hero-search-form" method="GET" action="{{ route($module['search_route']) }}">
        <div class="hsf-main-row">
            <div class="hsf-input-wrap">
                <i class="bi bi-search hsf-icon" aria-hidden="true"></i>
                <input type="text" name="search" class="hsf-input"
                       placeholder="{{ __('Search…') }}" autocomplete="off">
            </div>
            <button type="submit" class="hsf-submit-btn">{{ __('Search') }}</button>
        </div>
    </form>
    @endif

</div>
@endforeach
