@extends('adminlte::page')

@section('title', ($addon->exists ? 'Edit' : 'Create') . ' Addon')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-plus-circle mr-2 text-primary"></i> 
                    {{ $addon->exists ? 'Modify Addon' : 'New Service Addon' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $addon->exists ? 'Update addon pricing, availability, and description.' : 'Define a new supplemental service to enhance platform listings.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.addons.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ $addon->exists ? route('admin.addons.update', $addon->id) : route('admin.addons.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($addon->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">Addon Configuration</h3>
                    </div>
                    <div class="card-body p-4">
                        {{-- Name Field --}}
                        <div class="form-group mb-4">
                            <label for="name" class="font-weight-600">Addon Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" id="name" 
                                   class="form-control form-control-lg @error('name') is-invalid @enderror" 
                                   placeholder="e.g. Premium Insurance"
                                   value="{{ old('name', $addon->title ?? '') }}" required>
                            @error('name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        {{-- Price Field --}}
                        <div class="form-group mb-4">
                            <label for="price" class="font-weight-600">Supplemental Price <span class="text-danger">*</span></label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text bg-light border-right-0"><i class="fas fa-dollar-sign text-muted"></i></span>
                                </div>
                                <input type="number" step="0.01" name="price" id="price" 
                                       class="form-control @error('price') is-invalid @enderror" 
                                       placeholder="0.00"
                                       value="{{ old('price', $addon->price ?? '') }}" required>
                            </div>
                            @error('price') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        {{-- Description Field --}}
                        <div class="form-group mb-0">
                            <label for="description" class="font-weight-600">Service Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="5" 
                                      class="form-control @error('description') is-invalid @enderror" 
                                      placeholder="Describe the benefits and details of this addon..."
                                      required>{{ old('description', $addon->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>
                    </div>
                    <div class="card-footer bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="statusSwitch" name="status" value="active" 
                                   {{ ($addon->exists && $addon->status == 'active') || !$addon->exists ? 'checked' : '' }}>
                            <label class="custom-control-label font-weight-bold text-muted small text-uppercase" for="statusSwitch">Active Status</label>
                        </div>
                        <button type="submit" class="btn btn-primary rounded-pill px-4 shadow-premium font-weight-bold">
                            <i class="fas fa-save mr-1"></i> COMMIT CHANGES
                        </button>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                {{-- Visual Identity Card --}}
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px; overflow: hidden;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\PropertyAddon::PRIMARY_MEDIA,
                            'label' => 'Service Icon / Badge',
                            'multiple' => false,
                            'model' => \App\Models\PropertyAddon::class,
                            'id' => $addon->id ?? null,
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
