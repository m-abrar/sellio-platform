@extends('adminlte::page')

@section('title', ($property->exists ? 'Edit' : 'Create') . ' Property')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-home mr-2 text-primary"></i> 
                    {{ $property->exists ? 'Modify Property' : 'New Property Listing' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $property->exists ? 'Update property details, pricing, and availability for this listing.' : 'Draft a new real estate listing with detailed specifications and media.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.listings.index', ['type' => 'property']) }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Listings
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
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
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">General Information</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label for="title" class="font-weight-600"><i class="fas fa-heading mr-1 text-primary"></i> Property Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" 
                                   class="form-control form-control-lg @error('title') is-invalid @enderror" 
                                   placeholder="Enter property name/heading"
                                   value="{{ old('title', $property->title ?? '') }}" required list="property-title-suggestions">
                            <datalist id="property-title-suggestions">
                                @foreach(\App\Models\Property::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                            <input type="text" name="slug" id="slug" 
                                   class="form-control form-control-monospace @error('slug') is-invalid @enderror"
                                   value="{{ old('slug', $property->slug ?? '') }}" placeholder="Auto-generated if left blank">
                        </div>

                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Full Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="6" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Describe the property, neighborhood, and perks...">{{ old('description', $property->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Property Details --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Specifications & Areas</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="font-weight-600">Bedrooms</label>
                                    <input type="number" name="number_of_bedrooms" class="form-control" value="{{ old('number_of_bedrooms', $property->number_of_bedrooms ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="font-weight-600">Bathrooms</label>
                                    <input type="number" step="0.5" name="number_of_bathrooms" class="form-control" value="{{ old('number_of_bathrooms', $property->number_of_bathrooms ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="font-weight-600">Parking Spots</label>
                                    <input type="number" name="number_of_parking_spots" class="form-control" value="{{ old('number_of_parking_spots', $property->number_of_parking_spots ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="font-weight-600">Max Guests</label>
                                    <input type="number" name="maximum_guests" class="form-control" value="{{ old('maximum_guests', $property->maximum_guests ?? '') }}">
                                </div>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Area (Sq Ft)</label>
                                    <input type="number" name="area_sq_ft" class="form-control" value="{{ old('area_sq_ft', $property->area_sq_ft ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Area (Sq M)</label>
                                    <input type="number" name="area_sq_m" class="form-control" value="{{ old('area_sq_m', $property->area_sq_m ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Year Built</label>
                                    <input type="number" name="year_built" class="form-control" value="{{ old('year_built', $property->year_built ?? '') }}" placeholder="YYYY">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Pricing Setup</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Base Price (Sale)</label>
                                    <input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price', $property->base_price ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Discounted Price (Sale)</label>
                                    <input type="number" step="0.01" name="sale_price" class="form-control" value="{{ old('sale_price', $property->sale_price ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">Price Per Night (Rental)</label>
                                    <input type="number" step="0.01" name="price_per_night" class="form-control" value="{{ old('price_per_night', $property->price_per_night ?? '') }}">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label class="font-weight-600">HOA Fees (Monthly)</label>
                                    <input type="number" step="0.01" name="hoa" class="form-control" value="{{ old('hoa', $property->hoa ?? '') }}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Location Address --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Map & Location</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group">
                            <label class="font-weight-600">Street Address</label>
                            <input type="text" name="address" class="form-control" value="{{ old('address', $property->address ?? '') }}">
                        </div>
                        <div class="row">
                            <div class="col-md-3"><input type="text" name="city" placeholder="City" class="form-control mb-2" value="{{ old('city', $property->city ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="state" placeholder="State/Prov" class="form-control mb-2" value="{{ old('state', $property->state ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="country" placeholder="Country" class="form-control mb-2" value="{{ old('country', $property->country ?? '') }}"></div>
                            <div class="col-md-3"><input type="text" name="zip_code" placeholder="Zip Code" class="form-control mb-2" value="{{ old('zip_code', $property->zip_code ?? '') }}"></div>
                        </div>
                    </div>
                </div>



                {{-- Gallery Collection --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Property Gallery Photos</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Property::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Property::class,
                            'id' => $property->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div> {{-- End Gallery Card --}}

                @if($property->exists)
                @if($property->is_rental)
                {{-- Recent Bookings --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0"><i class="fas fa-calendar-check mr-2 text-warning opacity-50"></i> Recent Bookings</h3>
                        <a href="{{ route('admin.bookings.properties') }}?item_id={{ $property->id }}" class="btn btn-xs btn-outline-primary px-2 rounded-pill small">View All</a>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                        <th class="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentBookings ?? [] as $bk)
                                        <tr>
                                            <td class="align-middle font-weight-bold">{{ $bk->user->name ?? 'Guest' }}</td>
                                            <td class="align-middle">
                                                {{ \Carbon\Carbon::parse($bk->check_in_date)->format('M d') }} - {{ \Carbon\Carbon::parse($bk->check_out_date)->format('M d') }}
                                            </td>
                                            <td class="align-middle">
                                                <span class="badge badge-{{ $bk->status === 'confirmed' ? 'success' : 'warning' }} px-3 py-2 rounded-pill font-weight-bold smallest">{{ ucfirst($bk->status) }}</span>
                                            </td>
                                            <td class="text-right align-middle">
                                                <a href="{{ url('/admin/bookings/show/PropertyBooking/' . $bk->id) }}" class="btn btn-xs btn-light text-primary rounded-circle"><i class="fas fa-eye"></i></a>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="4" class="text-center text-muted py-5">No bookings yet</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                @endif

                @if($property->is_sale)
                {{-- Tour Requests / Inquiries --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0"><i class="fas fa-eye mr-2 text-info opacity-50"></i> Tour Requests</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Schedule</th>
                                        <th>Status</th>
                                        <th class="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentVisits ?? [] as $visit)
                                        <tr>
                                            <td class="align-middle font-weight-bold">
                                                {{ $visit->full_name }}
                                                <div class="small text-muted">{{ $visit->email }}</div>
                                            </td>
                                            <td class="align-middle">{{ \Carbon\Carbon::parse($visit->scheduled_at)->format('M d, g:i A') }}</td>
                                            <td class="align-middle">
                                                <span class="badge badge-{{ $visit->status === 'confirmed' ? 'success' : 'warning' }} px-3 py-2 rounded-pill font-weight-bold smallest">{{ ucfirst($visit->status) }}</span>
                                            </td>
                                            <td class="text-right align-middle">
                                                <button class="btn btn-xs btn-light text-muted rounded-circle" disabled><i class="fas fa-eye"></i></button>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr><td colspan="4" class="text-center text-muted py-5">No inquiries yet</td></tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                @endif
                @endif
                {{-- Display & Billing Options --}}
                <div class="card card-premium mt-4 overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;"><i class="fas fa-cog mr-2 text-secondary"></i> Display & Pricing Options</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_sale', 'id' => 'isSale', 'label' => 'Available for Sale', 'status' => 'Purchase', 'checked' => old('is_sale', $property->is_sale ?? true)],
                                    ['name' => 'is_rental', 'id' => 'isRental', 'label' => 'Available for Rent', 'status' => 'Lease', 'checked' => old('is_rental', $property->is_rental ?? false)],
                                ];
                            @endphp
                            @foreach($toggles as $t)
                                <div class="col-md-6 mb-3">
                                    <label class="w-100 cursor-pointer mb-0">
                                        <input type="hidden" name="{{ $t['name'] }}" value="0">
                                        <input type="checkbox" name="{{ $t['name'] }}" value="1" id="{{ $t['id'] }}" class="d-none toggle-input" {{ $t['checked'] ? 'checked' : '' }}>
                                        <div class="d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm px-3 py-3">
                                            <div>
                                                <div class="font-weight-bold text-dark small">{{ $t['label'] }}</div>
                                                <div class="small toggle-status text-muted">{{ $t['status'] ?? 'Option' }}</div>
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
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $property,
                    'title' => 'PROPERTY',
                    'back' => 'admin.listings.index',
                    'duplicate' => 'admin.properties.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-sliders-h mr-2 text-primary opacity-50"></i> Listing Controls
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $property->is_featured ?? false) ? 'checked' : '' }}>
                            <label class="custom-control-label font-weight-bold text-dark small" for="isFeatured">Featured Listing</label>
                        </div>
                    </div>
                </div>

                {{-- Primary Media --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Property::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Property::class,
                            'id' => $property->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-sitemap mr-2 text-primary opacity-50"></i> Classification
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted text-uppercase">Marketplace Category</label>
                            <select name="category_id" class="form-control select2">
                                <option value="">Select Category</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $property->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted text-uppercase">Regional Hub</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">Select Location</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $property->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->name }}</option>
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
<script>
    $(document).ready(function () {
        // Shared Slug Logic
        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            slugInput.val(slug);
        });

        $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
    });
</script>
@include('admin._partials._toggle-card-css')
@endpush

@if($property->exists)
    <form id="delete-form" action="{{ route('admin.properties.destroy', $property->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this property listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif
