@extends('adminlte::page')

@section('title', ($auto->exists ? 'Edit' : 'Create') . ' Auto')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> 
                    {{ $auto->exists ? 'Modify Auto' : 'New Auto Listing' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $auto->exists ? 'Update technical specs, pricing, and availability for this vehicle.' : 'Draft a new automotive listing with detailed specifications and media.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.autos.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Listings
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $auto->exists ? route('admin.autos.update', $auto->id) : route('admin.autos.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($auto->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Basic Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">General Information</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Listing Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-hero @error('title') is-invalid @enderror" value="{{ old('title', $auto->title ?? '') }}" required list="auto-title-suggestions" placeholder="e.g. 2024 Tesla Model 3 Long Range">
                            <datalist id="auto-title-suggestions">
                                @foreach(\App\Models\Auto::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $auto->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Full Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control textarea-premium @error('description') is-invalid @enderror" placeholder="Describe the vehicle's history, condition, and options...">{{ old('description', $auto->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Vehicle Specifications --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Vehicle Specifications</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Make <span class="text-danger">*</span></label>
                                    <input type="text" name="make" class="form-control form-control-premium" value="{{ old('make', $auto->make ?? '') }}" required placeholder="e.g. Tesla">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Model <span class="text-danger">*</span></label>
                                    <input type="text" name="model" class="form-control form-control-premium" value="{{ old('model', $auto->model ?? '') }}" required placeholder="e.g. Model 3">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Year <span class="text-danger">*</span></label>
                                    <input type="number" name="year" class="form-control form-control-premium" value="{{ old('year', $auto->year ?? '') }}" required placeholder="2024">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Stock <span class="text-danger">*</span></label>
                                    <input type="number" name="stock_quantity" class="form-control form-control-premium" value="{{ old('stock_quantity', $auto->stock_quantity ?? 1) }}" placeholder="1">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Mileage <span class="text-danger">*</span></label>
                                    <input type="number" name="mileage_value" class="form-control form-control-premium" value="{{ old('mileage_value', $auto->mileage_value ?? '') }}" required placeholder="e.g. 15000">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Mileage Unit</label>
                                    <select name="mileage_units" class="form-control form-control-premium">
                                        <option value="km" {{ old('mileage_units', $auto->mileage_units ?? 'km') == 'km' ? 'selected' : '' }}>Kilometers (KM)</option>
                                        <option value="mi" {{ old('mileage_units', $auto->mileage_units ?? 'km') == 'mi' ? 'selected' : '' }}>Miles (Mi)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Transmission <span class="text-danger">*</span></label>
                                    <input type="text" name="transmission" class="form-control form-control-premium" placeholder="Automatic/Manual" value="{{ old('transmission', $auto->transmission ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Engine Type <span class="text-danger">*</span></label>
                                    <input type="text" name="engine_type" class="form-control form-control-premium" placeholder="V6, 2.0L" value="{{ old('engine_type', $auto->engine_type ?? '') }}">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Drivetrain</label>
                                    <input type="text" name="drivetrain" class="form-control form-control-premium" placeholder="AWD/FWD/RWD" value="{{ old('drivetrain', $auto->drivetrain ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Exterior Color</label>
                                    <input type="text" name="exterior_color" class="form-control form-control-premium" value="{{ old('exterior_color', $auto->exterior_color ?? '') }}" placeholder="e.g. Midnight Silver">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Fuel Economy</label>
                                    <input type="text" name="fuel_economy" class="form-control form-control-premium" placeholder="e.g. 10L/100km" value="{{ old('fuel_economy', $auto->fuel_economy ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">VIN Number</label>
                                    <input type="text" name="vin_number" class="form-control form-control-premium" value="{{ old('vin_number', $auto->vin_number ?? '') }}" placeholder="17-digit VIN">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Pricing</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Base Price <span class="text-danger">*</span></label>
                                    <input type="number" name="base_price" class="form-control form-control-premium" value="{{ old('base_price', $auto->base_price ?? '') }}" required placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Discounted Price</label>
                                    <input type="number" name="sale_price" class="form-control form-control-premium" value="{{ old('sale_price', $auto->sale_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Gallery --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Auto Gallery Photos</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Auto::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Auto::class,
                            'id' => $auto->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($auto->exists)
                {{-- Recent Inquiries --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Recent Inquiries</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">User</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Message</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentInquiries ?? [] as $inq)
                                        <tr>
                                            <td class="px-4 py-3 align-middle font-weight-bold text-dark">{{ $inq->user_name ?? 'Guest' }}</td>
                                            <td class="px-4 py-3 align-middle text-muted small">{{ Str::limit($inq->message, 40) }}</td>
                                            <td class="px-4 py-3 align-middle text-muted small">{{ $inq->created_at->format('M d') }}</td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="3" class="text-center py-5 text-muted small uppercase letter-spacing-1">No inquiries yet</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                @endif

                {{-- Display & Billing Options --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Display & Pricing Options</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_selling', 'id' => 'isSelling', 'label' => 'For Selling', 'status' => 'Purchase', 'checked' => old('is_selling', $auto->is_selling ?? true)],
                                    ['name' => 'is_lease', 'id' => 'isLease', 'label' => 'For Lease', 'status' => 'Lease', 'checked' => old('is_lease', $auto->is_lease ?? false)],
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
                                                <div class="small toggle-status text-muted uppercase letter-spacing-1">{{ $t['status'] ?? 'Option' }}</div>
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
                    'model' => $auto,
                    'title' => 'AUTO',
                    'back' => 'admin.autos.index',
                    'duplicate' => 'admin.autos.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Listing Controls</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $auto->is_featured ?? false) ? 'checked' : '' }}>
                            <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1" for="isFeatured">Featured Listing</label>
                        </div>
                    </div>
                </div>

                {{-- Primary Media --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Auto::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Auto::class,
                            'id' => $auto->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Classification</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Marketplace Category</label>
                            <select name="category_id" class="form-control select2" required>
                                <option value="">Select Category</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $auto->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Vehicle Brand</label>
                            <select name="brand_id" class="form-control select2">
                                <option value="">Select Brand</option>
                                @foreach($brands ?? [] as $b)
                                    <option value="{{ $b->id }}" {{ (old('brand_id', $auto->brand_id ?? '') == $b->id) ? 'selected' : '' }}>{{ $b->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Regional Hub</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">Select Location</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $auto->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->title }}</option>
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
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' }); 

        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() { $(this).data('edited', true); });
    });
</script>
@endpush

@if($auto->exists)
    <form id="delete-form" action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this auto listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-pill px-4',
                    cancelButton: 'rounded-pill px-4'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif

@include('admin._partials._toggle-card-css')

@push('js')
<script>
    $(document).ready(function () { 
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' }); 

        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() { $(this).data('edited', true); });
    });
</script>
@endpush

@if($auto->exists)
    <form id="delete-form" action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this auto listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!',
                customClass: {
                    popup: 'rounded-xl',
                    confirmButton: 'rounded-pill px-4',
                    cancelButton: 'rounded-pill px-4'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
                    confirmButton: 'btn btn-danger rounded-pill px-4',
                    cancelButton: 'btn btn-secondary rounded-pill px-4'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif

@include('admin._partials._toggle-card-css')
