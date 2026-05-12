{{-- Properties Form --}}
<div class="tab-pane fade show active" id="properties" role="tabpanel" aria-labelledby="properties-tab">
    <form class="row g-3 align-items-center" method="GET" action="{{ route('properties.index') }}">
        <div class="col-lg-6">
            <input type="text" name="keyword" class="form-control custom-pill-input" 
                   placeholder="{{ __('Enter an address, city, or ZIP code') }}">
        </div>
        <div class="col-lg-3">
            <select class="form-select custom-pill-input" name="property_type">
                <option value="sale" selected>{{ __('For Sale') }}</option>
                <option value="rental">{{ __('For Rent') }}</option>
            </select>
        </div>
        <div class="col-lg-3">
            <button type="submit" class="btn btn-search-pill w-100">
                <i class="bi bi-search me-2"></i> {{ __('Search') }}
            </button>
        </div>
    </form>
</div>

{{-- Autos Form --}}
<div class="tab-pane fade" id="autos" role="tabpanel" aria-labelledby="autos-tab">
    <form class="row g-3 align-items-center" method="GET" action="{{ route('autos.search') }}">
        <div class="col-lg-6">
            <input type="text" name="keyword" class="form-control custom-pill-input" 
                   placeholder="{{ __('Make, model, or year') }}">
        </div>
        <div class="col-lg-3">
            <select class="form-select custom-pill-input" name="category">
                <option selected value="">{{ __('All Body Types') }}</option>
                @isset($autoCategories)
                    @foreach($autoCategories as $category)
                        <option value="{{ $category->id }}" @selected(request('category') == $category->id)>
                            {{ $category->title }}
                        </option>
                    @endforeach
                @endisset
            </select>
        </div>
        <div class="col-lg-3">
            <button type="submit" class="btn btn-search-pill w-100 text-nowrap">
                <i class="bi bi-search me-2"></i> {{ __('Find Car') }}
            </button>
        </div>
    </form>
</div>

{{-- Jobs Form --}}
<div class="tab-pane fade" id="jobs" role="tabpanel" aria-labelledby="jobs-tab">
    <form class="row g-3 align-items-center" method="GET" action="{{ route('jobs.search') }}">
        <div class="col-lg-5">
            <input type="text" name="keyword" class="form-control custom-pill-input" 
                   placeholder="{{ __('Job title or company') }}">
        </div>
        <div class="col-lg-4">
            <input type="text" name="location" class="form-control custom-pill-input" 
                   placeholder="{{ __('City or state') }}">
        </div>
        <div class="col-lg-3">
            <button type="submit" class="btn btn-search-pill w-100 text-nowrap">
                <i class="bi bi-briefcase me-2"></i> {{ __('Find Jobs') }}
            </button>
        </div>
    </form>
</div>

{{-- Classifieds Form --}}
<div class="tab-pane fade" id="classifieds" role="tabpanel" aria-labelledby="classifieds-tab">
    <form class="row g-3 align-items-center" method="GET" action="{{ route('classifieds.search') }}">
        <div class="col-lg-9">
            <input type="text" name="keyword" class="form-control custom-pill-input" 
                   placeholder="{{ __('Electronics, furniture, cameras...') }}">
        </div>
        <div class="col-lg-3">
            <button type="submit" class="btn btn-search-pill w-100">
                <i class="bi bi-tag me-2"></i> {{ __('Browse') }}
            </button>
        </div>
    </form>
</div>
