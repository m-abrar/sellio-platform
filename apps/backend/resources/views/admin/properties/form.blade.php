{{--
    Administrative Real Estate: Property Asset Configuration
    
    This view serves as the authoritative interface for property listing management.
    It orchestrates complex data entry for specifications, pricing (sale/rental), 
    geographic localization, and high-fidelity media galleries. It also 
    integrates operational intelligence through recent booking/inquiry streams.
    
    @extends adminlte::page
    @context Property Inventory Management
    @variables Property $property The property model instance being edited/created.
    @variables Collection $categories Property categories for taxonomy mapping.
    @variables Collection $locations Regional hubs for geographic clustering.
--}}
@extends('adminlte::page')

@section('title', ($property->exists ? __('Edit') : __('Create')) . ' ' . __('Property'))

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-home mr-2 text-primary"></i> 
                    {{ $property->exists ? __('Modify Property') : __('New Property Listing') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $property->exists ? __('Update property details, pricing, and availability for this listing.') : __('Draft a new real estate listing with detailed specifications and media.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.listings.index', ['type' => 'property']) }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Listings') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $property->exists ? route('admin.properties.update', $property->id) : route('admin.properties.store') }}" 
          method="POST" 
          enctype="multipart/form-data"
          id="propertyMainForm">
        @csrf
        @if($property->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Basic Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('General Information') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label for="title" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Property Title') }} <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-hero" 
                                   placeholder="{{ __('Enter property name/heading') }}"
                                   value="{{ old('title', $property->title ?? '') }}" required list="property-title-suggestions">
                            <datalist id="property-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('URL Slug') }}</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-premium text-monospace small"
                                   value="{{ old('slug', $property->slug ?? '') }}" placeholder="{{ __('Auto-generated if left blank') }}">
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Full Description') }} <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="6" 
                                      class="form-control textarea-premium"
                                      placeholder="{{ __('Describe the property, neighborhood, and perks...') }}">{{ old('description', $property->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Property Details --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Specifications & Areas') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Bedrooms') }}</label>
                                    <input type="number" name="number_of_bedrooms" class="form-control form-control-premium" value="{{ old('number_of_bedrooms', $property->number_of_bedrooms ?? '') }}" placeholder="e.g. 3">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Bathrooms') }}</label>
                                    <input type="number" step="0.5" name="number_of_bathrooms" class="form-control form-control-premium" value="{{ old('number_of_bathrooms', $property->number_of_bathrooms ?? '') }}" placeholder="e.g. 2.5">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Parking Spots') }}</label>
                                    <input type="number" name="number_of_parking_spots" class="form-control form-control-premium" value="{{ old('number_of_parking_spots', $property->number_of_parking_spots ?? '') }}" placeholder="e.g. 2">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Max Guests') }}</label>
                                    <input type="number" name="maximum_guests" class="form-control form-control-premium" value="{{ old('maximum_guests', $property->maximum_guests ?? '') }}" placeholder="e.g. 6">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Area (Sq Ft)') }}</label>
                                    <input type="number" name="area_sq_ft" class="form-control form-control-premium" value="{{ old('area_sq_ft', $property->area_sq_ft ?? '') }}" placeholder="e.g. 2400">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Area (Sq M)') }}</label>
                                    <input type="number" name="area_sq_m" class="form-control form-control-premium" value="{{ old('area_sq_m', $property->area_sq_m ?? '') }}" placeholder="e.g. 220">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Year Built') }}</label>
                                    <input type="number" name="year_built" class="form-control form-control-premium" value="{{ old('year_built', $property->year_built ?? '') }}" placeholder="YYYY">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Pricing Setup') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Base Price (Sale)') }}</label>
                                    <input type="number" step="0.01" name="base_price" class="form-control form-control-premium" value="{{ old('base_price', $property->base_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Discount Price') }}</label>
                                    <input type="number" step="0.01" name="sale_price" class="form-control form-control-premium text-success font-weight-bold" value="{{ old('sale_price', $property->sale_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Price / Night') }}</label>
                                    <input type="number" step="0.01" name="price_per_night" class="form-control form-control-premium text-primary font-weight-bold" value="{{ old('price_per_night', $property->price_per_night ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('HOA Fees (Monthly)') }}</label>
                                    <input type="number" step="0.01" name="hoa" class="form-control form-control-premium" value="{{ old('hoa', $property->hoa ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Location Address --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Map & Location') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Street Address') }}</label>
                            <input type="text" name="address" class="form-control form-control-premium" value="{{ old('address', $property->address ?? '') }}" placeholder="e.g. 123 Luxury Ave">
                        </div>
                        <div class="row">
                            <div class="col-md-3"><input type="text" name="city" placeholder="{{ __('City') }}" class="form-control form-control-premium mb-2" value="{{ old('city', $property->city ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="state" placeholder="{{ __('State/Prov') }}" class="form-control form-control-premium mb-2" value="{{ old('state', $property->state ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="country" placeholder="{{ __('Country') }}" class="form-control form-control-premium mb-2" value="{{ old('country', $property->country ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="zip_code" placeholder="{{ __('Zip Code') }}" class="form-control form-control-premium mb-2" value="{{ old('zip_code', $property->zip_code ?? '') }}"></div>
                        </div>
                    </div>
                </div>

                {{-- Gallery Collection --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Property Gallery Photos') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Property::GALLERY_MEDIA,
                            'label' => __('Select Gallery Images'),
                            'multiple' => true,
                            'model' => 'property',
                            'id' => $property->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($property->exists)
                @if($property->is_rental)
                {{-- Recent Bookings --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title-main mb-0">{{ __('Recent Bookings') }}</h3>
                        <a href="{{ route('admin.bookings.properties.property', $property->id) }}" class="btn btn-premium-soft-primary btn-sm px-3 uppercase small letter-spacing-1 font-weight-bold">{{ __('View All') }}</a>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('User') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Dates') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Status') }}</th>
                                        <th class="px-4 py-3 text-right small uppercase letter-spacing-1">{{ __('Action') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentBookings ?? [] as $bk)
                                        <tr>
                                            <td class="px-4 py-3 align-middle font-weight-bold text-dark">{{ $bk->user->name ?? __('Guest') }}</td>
                                            <td class="px-4 py-3 align-middle text-muted small">
                                                {{ \Carbon\Carbon::parse($bk->check_in_date)->format('M d') }} - {{ \Carbon\Carbon::parse($bk->check_out_date)->format('M d') }}
                                            </td>
                                            <td class="px-4 py-3 align-middle">
                                                <span class="badge badge-premium-{{ $bk->status === 'confirmed' ? 'success' : 'warning' }} px-3 py-2">{{ ucfirst(__($bk->status)) }}</span>
                                            </td>
                                            <td class="px-4 py-3 text-right align-middle">
                                                <a href="{{ url('/admin/bookings/show/PropertyBooking/' . $bk->id) }}" class="btn btn-light btn-xs text-primary rounded-circle shadow-sm"><i class="fas fa-eye"></i></a>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="4" class="text-center text-muted py-5 small uppercase letter-spacing-1">{{ __('No bookings yet') }}</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                @endif

                @if($property->is_sale)
                {{-- Tour Requests / Inquiries --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main mb-0">{{ __('Tour Requests') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Inquirer') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Schedule') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Status') }}</th>
                                        <th class="px-4 py-3 text-right small uppercase letter-spacing-1">{{ __('Action') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentVisits ?? [] as $visit)
                                        <tr>
                                            <td class="px-4 py-3 align-middle">
                                                <div class="font-weight-bold text-dark">{{ $visit->full_name }}</div>
                                                <div class="small text-muted">{{ $visit->email }}</div>
                                            </td>
                                            <td class="px-4 py-3 align-middle text-muted small">{{ \Carbon\Carbon::parse($visit->scheduled_at)->format('M d, g:i A') }}</td>
                                            <td class="px-4 py-3 align-middle">
                                                <span class="badge badge-premium-{{ $visit->status === 'confirmed' ? 'success' : 'warning' }} px-3 py-2">{{ ucfirst(__($visit->status)) }}</span>
                                            </td>
                                            <td class="px-4 py-3 text-right align-middle">
                                                <button class="btn btn-light btn-xs text-muted rounded-circle shadow-sm" disabled><i class="fas fa-eye"></i></button>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="4" class="text-center text-muted py-5 small uppercase letter-spacing-1">{{ __('No inquiries yet') }}</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                @endif
                @endif

                {{-- Display & Billing Options --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main mb-0">{{ __('Display & Pricing Options') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_sale', 'id' => 'isSale', 'label' => __('Available for Sale'), 'status' => __('Purchase Listing'), 'checked' => old('is_sale', $property->is_sale ?? true)],
                                    ['name' => 'is_rental', 'id' => 'isRental', 'label' => __('Available for Rent'), 'status' => __('Lease Listing'), 'checked' => old('is_rental', $property->is_rental ?? false)],
                                ];
                            @endphp
                            @foreach($toggles as $t)
                                <div class="col-md-6 mb-3">
                                    <label class="w-100 cursor-pointer mb-0">
                                        <input type="hidden" name="{{ $t['name'] }}" value="0">
                                        <input type="checkbox" name="{{ $t['name'] }}" value="1" id="{{ $t['id'] }}" class="d-none toggle-input" {{ $t['checked'] ? 'checked' : '' }}>
                                        <div class="d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm px-4 py-3 border rounded-xl border-light-soft">
                                            <div>
                                                <div class="font-weight-bold text-dark small uppercase letter-spacing-1">{{ $t['label'] }}</div>
                                                <div class="small toggle-status text-muted uppercase letter-spacing-1">{{ $t['status'] ?? __('Option') }}</div>
                                            </div>
                                            <div class="toggle-indicator shadow-sm"></div>
                                        </div>
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $property,
                    'title' => __('PROPERTY'),
                    'back' => 'admin.listings.index',
                    'duplicate' => 'admin.properties.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Listing Controls') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $property->is_featured ?? false) ? 'checked' : '' }}>
                            <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1" for="isFeatured">{{ __('Featured Property') }}</label>
                        </div>
                    </div>
                </div>

                {{-- Primary Media --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> {{ __('Visual Identity') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Property::PRIMARY_MEDIA,
                            'label' => __('Main Listing Image'),
                            'multiple' => false,
                            'model' => 'property',
                            'id' => $property->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Classification') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Marketplace Category') }}</label>
                            <select name="category_id" class="form-control select2">
                                <option value="">{{ __('Select Category') }}</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $property->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Regional Hub') }}</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">{{ __('Select Location') }}</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $property->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/taxonomy-form.js') }}"></script>
@endpush

@if($property->exists)
    <form id="delete-trigger-form" action="{{ route('admin.properties.destroy', $property->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
@endif
