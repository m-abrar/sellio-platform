{{--
    Administrative Classifieds: Asset Configuration
    
    This view serves as the authoritative interface for managing 
    community marketplace advertisements. It orchestrates complex data 
    structures including general information, technical specifications, 
    condition assessments, pricing models (sale vs rent), and 
    multi-media gallery collections.
    
    @extends adminlte::page
    @context Classified Module Management
    @variables Classified $classified The classified ad model instance.
    @variables Collection $categories Market vertical categories.
    @variables Collection $locations Regional deployment hubs.
--}}
@extends('adminlte::page')

@section('title', ($classified->exists ? 'Edit' : 'Create') . ' Ad')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-bullhorn mr-2 text-primary"></i> 
                    {{ $classified->exists ? 'Modify Ad' : 'New Classified Ad' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $classified->exists ? 'Update item details, condition, and market pricing for this listing.' : 'Draft a new marketplace advertisement with detailed specifications and media.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classifieds.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Ads
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $classified->exists ? route('admin.classifieds.update', $classified->id) : route('admin.classifieds.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($classified->exists) @method('PATCH') @endif

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
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Item Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-hero @error('title') is-invalid @enderror" value="{{ old('title', $classified->title ?? '') }}" required list="classified-title-suggestions" placeholder="e.g. Vintage Leather Sofa">
                            <datalist id="classified-title-suggestions">
                                @foreach(\App\Models\Classified::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $classified->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Item Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control textarea-premium @error('description') is-invalid @enderror" placeholder="Describe the item condition, history, and specifications...">{{ old('description', $classified->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Item Specs --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Specifications & Condition</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Condition Scale</label>
                                    <select name="item_condition" class="form-control form-control-premium">
                                        <option value="10" {{ old('item_condition', $classified->item_condition ?? '') == '10' ? 'selected' : '' }}>10/10 (Brand New)</option>
                                        <option value="8" {{ old('item_condition', $classified->item_condition ?? '') == '8' ? 'selected' : '' }}>8/10 (Excellent)</option>
                                        <option value="5" {{ old('item_condition', $classified->item_condition ?? '') == '5' ? 'selected' : '' }}>5/10 (Fair)</option>
                                        <option value="3" {{ old('item_condition', $classified->item_condition ?? '') == '3' ? 'selected' : '' }}>3/10 (Defects)</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Year / Age</label>
                                    <input type="number" name="item_year_age" class="form-control form-control-premium" placeholder="e.g. 2023" value="{{ old('item_year_age', $classified->item_year_age ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Quantity</label>
                                    <input type="number" name="item_quantity" class="form-control form-control-premium" value="{{ old('item_quantity', $classified->item_quantity ?? '1') }}" placeholder="1">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Dimensions</label>
                                    <input type="text" name="item_dimensions" class="form-control form-control-premium" placeholder="e.g. 10x20x15 cm" value="{{ old('item_dimensions', $classified->item_dimensions ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Warranty (Months)</label>
                                    <input type="number" name="warranty_months" class="form-control form-control-premium" value="{{ old('warranty_months', $classified->warranty_months ?? '') }}" placeholder="e.g. 12">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Pricing Setup</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Base Price <span class="text-danger">*</span></label>
                                    <input type="number" step="0.01" name="base_price" class="form-control form-control-premium" value="{{ old('base_price', $classified->base_price ?? '0') }}" required placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Discounted Price</label>
                                    <input type="number" step="0.01" name="sale_price" class="form-control form-control-premium" value="{{ old('sale_price', $classified->sale_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Gallery --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Item Gallery Photos</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Classified::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\Classified::class,
                            'id' => $classified->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($classified->exists)
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
                                            <td class="px-4 py-3 align-middle font-weight-bold text-dark">{{ $inq->user->name ?? 'Guest' }}</td>
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
                                    ['name' => 'is_for_sale', 'id' => 'isForSale', 'label' => 'Available for Sale', 'status' => 'Purchase', 'checked' => old('is_for_sale', $classified->is_for_sale ?? true)],
                                    ['name' => 'is_for_rent', 'id' => 'isForRent', 'label' => 'Available for Rent', 'status' => 'Lease', 'checked' => old('is_for_rent', $classified->is_for_rent ?? false)],
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
                    'model' => $classified,
                    'title' => 'AD',
                    'back' => 'admin.classifieds.index',
                    'duplicate' => 'admin.classifieds.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Listing Controls</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $classified->is_featured ?? false) ? 'checked' : '' }}>
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
                            'name' => \App\Models\Classified::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Classified::class,
                            'id' => $classified->id ?? null,
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
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $classified->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Regional Hub</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">Select Location</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $classified->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->title }}</option>
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

@if($classified->exists)
    <form id="delete-form" action="{{ route('admin.classifieds.destroy', $classified->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this classified listing?",
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
@endpush

@if($classified->exists)
    <form id="delete-form" action="{{ route('admin.classifieds.destroy', $classified->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this classified listing?",
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
