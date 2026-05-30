{{--
    Administrative E-Commerce: Addon Configuration
    
    This view serves as the authoritative interface for managing 
    supplemental service addons. It orchestrates parameters for 
    addon naming, financial valuation (price), and functional 
    descriptions. It also manages visual identity through specialized 
    media uploads to ensure professional presentation in platform 
    listings.
    
    @extends adminlte::page
    @context E-Commerce Module Management
    @variables PropertyAddon $addon The addon model instance.
--}}
@extends('adminlte::page')

@section('title', ($addon->exists ? 'Edit' : 'Create') . ' Addon')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-puzzle-piece mr-2 text-primary"></i> 
                    {{ $addon->exists ? 'Modify Addon' : 'New Service Addon' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
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
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $addon->exists ? route('admin.addons.update', $addon->id) : route('admin.addons.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($addon->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Configuration Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Addon Configuration</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        {{-- Name Field --}}
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Addon Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" id="name" 
                                   class="form-control form-control-hero @error('name') is-invalid @enderror" 
                                   placeholder="e.g. Premium Insurance"
                                   value="{{ old('name', $addon->name ?? '') }}" required>
                            @error('name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        {{-- Price Field --}}
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Supplemental Price <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" name="price" id="price" 
                                   class="form-control form-control-premium @error('price') is-invalid @enderror" 
                                   placeholder="0.00"
                                   value="{{ old('price', $addon->price ?? '') }}" required>
                            @error('price') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        {{-- Description Field --}}
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Service Description <span class="text-danger">*</span></label>
                            <textarea name="description" id="description" rows="5" 
                                      class="form-control rounded-16 border-light @error('description') is-invalid @enderror" 
                                      placeholder="Describe the benefits and details of this addon..."
                                      required>{{ old('description', $addon->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $addon,
                    'title' => 'ADDON',
                    'back' => 'admin.addons.index'
                ])

                {{-- Visual Identity Card --}}
                <div class="card border-0 shadow-premium mt-4 mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Visual Identity</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\PropertyAddon::PRIMARY_MEDIA,
                            'label' => 'Service Icon / Badge',
                            'multiple' => false,
                            'model' => 'addon',
                            'id' => $addon->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
