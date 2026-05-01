@extends('adminlte::page')

@section('title', ($classified->exists ? 'Edit' : 'Create') . ' Ad')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                    {{ $classified->exists ? 'Modify Ad' : 'New Classified Ad' }}
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.classifieds.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Ads
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
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
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-header border-0 bg-white py-3">
                        <h3 class="card-title font-weight-bold text-dark">General Information</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-4">
                            <label class="font-weight-600"><i class="fas fa-tag mr-1 text-primary"></i> Item Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" value="{{ old('title', $classified->title ?? '') }}" required list="classified-title-suggestions">
                            <datalist id="classified-title-suggestions">
                                @foreach(\App\Models\Classified::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-lg form-control-border @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $classified->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Item Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control @error('description') is-invalid @enderror" placeholder="Describe the item condition, history, and specifications...">{{ old('description', $classified->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Item Specs --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Specifications & Condition</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group"><label>Condition Scale</label><select name="item_condition" class="form-control"><option value="10" {{ old('item_condition', $classified->item_condition ?? '') == '10' ? 'selected' : '' }}>10/10 (Brand New)</option><option value="8" {{ old('item_condition', $classified->item_condition ?? '') == '8' ? 'selected' : '' }}>8/10 (Excellent)</option><option value="5" {{ old('item_condition', $classified->item_condition ?? '') == '5' ? 'selected' : '' }}>5/10 (Fair)</option><option value="3" {{ old('item_condition', $classified->item_condition ?? '') == '3' ? 'selected' : '' }}>3/10 (Defects)</option></select></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Year / Age</label><input type="number" name="item_year_age" class="form-control" placeholder="e.g. 2023" value="{{ old('item_year_age', $classified->item_year_age ?? '') }}"></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Quantity</label><input type="number" name="item_quantity" class="form-control" value="{{ old('item_quantity', $classified->item_quantity ?? '1') }}"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="form-group"><label>Dimensions</label><input type="text" name="item_dimensions" class="form-control" placeholder="e.g. 10x20x15 cm" value="{{ old('item_dimensions', $classified->item_dimensions ?? '') }}"></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Warranty (Months)</label><input type="number" name="warranty_months" class="form-control" value="{{ old('warranty_months', $classified->warranty_months ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Pricing Setup</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group"><label>Base Price <span class="text-danger">*</span></label><input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price', $classified->base_price ?? '0') }}" required></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Discounted Price</label><input type="number" step="0.01" name="sale_price" class="form-control" value="{{ old('sale_price', $classified->sale_price ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>



                {{-- Gallery --}}
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Classified::GALLERY_MEDIA,
                            'label' => 'Item Gallery Photos',
                            'multiple' => true,
                            'model' => \App\Models\Classified::class,
                            'id' => $classified->id ?? null,
                        ])
                    </div>
                </div>

                @if($classified->exists)
                {{-- Recent Inquiries --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-comments mr-2 text-warning"></i> Recent Inquiries</h3></div>
                    <div class="card-body p-0">
                        <table class="table table-sm table-hover mb-0">
                            <thead><tr><th>User</th><th>Message</th><th>Date</th></tr></thead>
                            <tbody>
                                @forelse($recentInquiries ?? [] as $inq)
                                    <tr><td>{{ $inq->user->name ?? 'Guest' }}</td><td>{{ Str::limit($inq->message, 40) }}</td><td>{{ $inq->created_at->format('M d') }}</td></tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No inquiries yet</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif
                {{-- Display & Billing Options --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-cog mr-2 text-secondary"></i> Display & Pricing Options</h3></div>
                    <div class="card-body">
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
                                        <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
                                            <div>
                                                <div class="font-weight-bold text-dark small">{{ $t['label'] }}</div>
                                                <div class="small toggle-status text-muted">{{ $t['status'] ?? 'Option' }}</div>
                                            </div>
                                            <div class="toggle-indicator"></div>
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
                @include('admin.classifieds.partials.action-buttons')

                {{-- Primary Media --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white">
                        <h3 class="card-title font-weight-600 small text-uppercase">Primary Image</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Classified::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Classified::class,
                            'id' => $classified->id ?? null,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-600 small text-uppercase">Classification</h3></div>
                    <div class="card-body">
                        <div class="form-group"><label class="small font-weight-bold">Category</label><select name="category_id" class="form-control select2" required><option value="">Select Category</option>@foreach($categories ?? [] as $cat)<option value="{{ $cat->id }}" {{ (old('category_id', $classified->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>@endforeach</select></div>
                        <div class="form-group"><label class="small font-weight-bold">Location</label><select name="location_id" class="form-control select2"><option value="">Select Location</option>@foreach($locations ?? [] as $loc)<option value="{{ $loc->id }}" {{ (old('location_id', $classified->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->name }}</option>@endforeach</select></div>
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
@include('admin._partials._toggle-card-css')
@endpush

@if($classified->exists)
    <form id="delete-form" action="{{ route('admin.classifieds.destroy', $classified->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this classified listing?",
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
