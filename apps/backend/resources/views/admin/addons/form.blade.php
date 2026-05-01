@extends('adminlte::page')

@section('title', $addon->exists ? 'Edit Addon' : 'Add Addon')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                     {{ $addon->exists ? 'Edit Addon' : 'Add Addon' }}
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ $addon->exists ? route('admin.addons.update', $addon->id) : route('admin.addons.store') }}" method="POST">
    @csrf
    @if($addon->exists) @method('PATCH') @endif

    <div class="row">
        <!-- Left Column (Main Form) -->
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header border-0 bg-white py-3"><h3 class="card-title">Addon Details</h3></div>
                <div class="card-body">

                    <div class="form-group">
                        <label for="name">Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" id="name" class="form-control @error('name') is-invalid @enderror" 
                               value="{{ old('name', $addon->title ?? '') }}" required>
                        @error('name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="description">Description <span class="text-danger">*</span></label>
                        <textarea name="description" id="description" class="form-control @error('description') is-invalid @enderror" 
                                  required>{{ old('description', $addon->description ?? '') }}</textarea>
                        @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="price">Price <span class="text-danger">*</span></label>
                        <input type="number" name="price" id="price" class="form-control @error('price') is-invalid @enderror" 
                               value="{{ old('price', $addon->price ?? '') }}" required>
                        @error('price') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label>Status</label>
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="statusSwitch" name="status" value="active" 
                                   {{ $addon->exists && $addon->status == 'active' ? 'checked' : '' }}>
                            <label class="custom-control-label" for="statusSwitch">Active</label>
                        </div>
                    </div>

                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Addon
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-4">
            <!-- Image or Icon -->
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\PropertyAddon::PRIMARY_MEDIA,
                'label' => 'Icon (Optional)',
                'multiple' => false,
                'model' => \App\Models\PropertyAddon::class,
                'id' => $addon->id ?? null,
            ])
        </div>
    </div>
</form>
@endsection

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Handle Status Toggle
        let statusSwitch = document.getElementById('statusSwitch');
        if (statusSwitch) {
            statusSwitch.addEventListener('change', function () {
                this.value = this.checked ? 'active' : 'inactive';
            });
        }
    });
</script>
@endpush

@push('css')
    
@endpush
