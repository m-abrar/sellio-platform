@extends('adminlte::page')

@section('title', (isset($service) ? 'Edit' : 'Create') . ' Service')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i> 
                    {{ isset($service) ? 'Modify Service' : 'New Service Listing' }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.services.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Services
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ isset($service) ? route('admin.services.update', $service->id) : route('admin.services.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($service)) @method('PATCH') @endif

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
                            <label class="font-weight-600">Service Name <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" value="{{ old('title', $service->title ?? '') }}" required>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-lg form-control-border @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $service->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Service Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control @error('description') is-invalid @enderror" placeholder="Describe the service offering, scope, items, and inclusions...">{{ old('description', $service->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Schedule & Terms --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Operating Hours & Capacity</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group"><label>Operating Days</label><input type="text" name="operating_days_label" class="form-control" placeholder="e.g. Monday - Friday" value="{{ old('operating_days_label', $service->operating_days_label ?? '') }}"></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Operating Hours</label><input type="text" name="operating_hours" class="form-control" placeholder="e.g. 09:00 AM - 05:00 PM" value="{{ old('operating_hours', $service->operating_hours ?? '') }}"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4">
                                <div class="form-group"><label>Scale / Level</label><select name="expertise_level" class="form-control"><option value="1" {{ old('expertise_level', $service->expertise_level ?? 1) == 1 ? 'selected' : '' }}>Tier 1 (Beginner)</option><option value="2" {{ old('expertise_level', $service->expertise_level ?? '') == 2 ? 'selected' : '' }}>Tier 2</option><option value="3" {{ old('expertise_level', $service->expertise_level ?? '') == 3 ? 'selected' : '' }}>Tier 3</option><option value="4" {{ old('expertise_level', $service->expertise_level ?? '') == 4 ? 'selected' : '' }}>Tier 4</option><option value="5" {{ old('expertise_level', $service->expertise_level ?? '') == 5 ? 'selected' : '' }}>Tier 5 (Expert)</option></select></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Radius (km)</label><input type="number" name="service_radius" class="form-control" value="{{ old('service_radius', $service->service_radius ?? '') }}"></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Max Client Slots</label><input type="number" name="max_client_slots" class="form-control" value="{{ old('max_client_slots', $service->max_client_slots ?? '') }}"></div>
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
                                <div class="form-group"><label>Base Price <span class="text-danger">*</span></label><input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price', $service->base_price ?? '0') }}" required></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Discounted Price</label><input type="number" step="0.01" name="sale_price" class="form-control" value="{{ old('sale_price', $service->sale_price ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>



                {{-- Gallery --}}
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Service::GALLERY_MEDIA,
                            'label' => 'Service Gallery Photos',
                            'multiple' => true,
                            'model' => \App\Models\Service::class,
                            'id' => $service->id ?? null,
                        ])
                    </div>
                </div>

                @if(isset($service))
                {{-- Recent Quotes --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-file-invoice-dollar mr-2 text-info"></i> Recent Leads/Quotes</h3></div>
                    <div class="card-body p-0">
                        <table class="table table-sm table-hover mb-0">
                            <thead><tr><th>Client</th><th>Request</th><th>Date</th></tr></thead>
                            <tbody>
                                @forelse($recentQuotes ?? [] as $qt)
                                    <tr><td>{{ $qt->user_name ?? 'Guest' }}</td><td>{{ Str::limit($qt->message, 40) }}</td><td>{{ $qt->created_at->format('M d') }}</td></tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No quote requests yet</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif
                {{-- Display & Billing Options --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-cog mr-2 text-secondary"></i> Display & Billing Options</h3></div>
                    <div class="card-body">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_subscription', 'id' => 'isSub', 'label' => 'Subscription Billing', 'status' => 'Recurring', 'checked' => old('is_subscription', $service->is_subscription ?? false)],
                                    ['name' => 'is_project_based', 'id' => 'isProj', 'label' => 'Project-Based', 'status' => 'Single Work', 'checked' => old('is_project_based', $service->is_project_based ?? true)],
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
                @include('admin.services.partials.action-buttons')

                {{-- Primary Media --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white">
                        <h3 class="card-title font-weight-600 small text-uppercase">Primary Image</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Service::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Service::class,
                            'id' => $service->id ?? null,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-600 small text-uppercase">Classification</h3></div>
                    <div class="card-body">
                        <div class="form-group"><label class="small font-weight-bold">Category</label><select name="category_id" class="form-control select2" required><option value="">Select Category</option>@foreach($categories ?? [] as $cat)<option value="{{ $cat->id }}" {{ (old('category_id', $service->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>@endforeach</select></div>
                        <div class="form-group"><label class="small font-weight-bold">Location</label><select name="location_id" class="form-control select2"><option value="">Select Location</option>@foreach($locations ?? [] as $loc)<option value="{{ $loc->id }}" {{ (old('location_id', $service->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->name }}</option>@endforeach</select></div>
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

@if(isset($service))
    <form id="delete-form" action="{{ route('admin.services.destroy', $service->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this service listing?",
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
