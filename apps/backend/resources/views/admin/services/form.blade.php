{{--
    Administrative Services: Asset Configuration
    
    This view serves as the authoritative interface for managing 
    professional service listings. It orchestrates complex data entry 
    for service scope, expertise tiers, operating itineraries, and 
    financial rates. It also integrates operational intelligence 
    through recent lead/quote metrics and visual identity management.
    
    @extends adminlte::page
    @context Service Inventory Management
    @variables Service $service The service model instance being edited/created.
    @variables Collection $categories Service categories for vertical taxonomy.
    @variables Collection $locations Regional hubs for geographic clustering.
--}}
@extends('adminlte::page')

@section('title', ($service->exists ? __('Edit') : __('Create')) . ' ' . __('Service'))

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i> 
                    {{ $service->exists ? __('Modify Service') : __('New Service Listing') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $service->exists ? __('Update service scope, expertise level, and professional rates.') : __('Draft a new professional service offering with detailed scope and media.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.services.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Services') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $service->exists ? route('admin.services.update', $service->id) : route('admin.services.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($service->exists) @method('PATCH') @endif

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
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Service Name') }} <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-hero" value="{{ old('title', $service->title ?? '') }}" required list="service-title-suggestions" placeholder="{{ __('e.g. Professional Interior Design') }}">
                            <datalist id="service-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('URL Slug') }}</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small" placeholder="{{ __('auto-generated-slug') }}" value="{{ old('slug', $service->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Service Description') }} <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control textarea-premium" placeholder="{{ __('Describe the service offering, scope, items, and inclusions...') }}">{{ old('description', $service->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Schedule & Terms --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Operating Hours & Capacity') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Operating Days') }}</label>
                                    <input type="text" name="operating_days_label" class="form-control form-control-premium" placeholder="{{ __('e.g. Monday - Friday') }}" value="{{ old('operating_days_label', $service->operating_days_label ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Operating Hours') }}</label>
                                    <input type="text" name="operating_hours" class="form-control form-control-premium" placeholder="{{ __('e.g. 09:00 AM - 05:00 PM') }}" value="{{ old('operating_hours', $service->operating_hours ?? '') }}">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Scale / Level') }}</label>
                                    <select name="expertise_level" class="form-control form-control-premium">
                                        <option value="1" {{ old('expertise_level', $service->expertise_level ?? 1) == 1 ? 'selected' : '' }}>{{ __('Tier 1 (Beginner)') }}</option>
                                        <option value="2" {{ old('expertise_level', $service->expertise_level ?? '') == 2 ? 'selected' : '' }}>{{ __('Tier 2') }}</option>
                                        <option value="3" {{ old('expertise_level', $service->expertise_level ?? '') == 3 ? 'selected' : '' }}>{{ __('Tier 3') }}</option>
                                        <option value="4" {{ old('expertise_level', $service->expertise_level ?? '') == 4 ? 'selected' : '' }}>{{ __('Tier 4') }}</option>
                                        <option value="5" {{ old('expertise_level', $service->expertise_level ?? '') == 5 ? 'selected' : '' }}>{{ __('Tier 5 (Expert)') }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Radius (km)') }}</label>
                                    <input type="number" name="service_radius" class="form-control form-control-premium" value="{{ old('service_radius', $service->service_radius ?? '') }}" placeholder="{{ __('e.g. 25') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Max Client Slots') }}</label>
                                    <input type="number" name="max_client_slots" class="form-control form-control-premium" value="{{ old('max_client_slots', $service->max_client_slots ?? '') }}" placeholder="{{ __('e.g. 10') }}">
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
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Base Price') }} <span class="text-danger">*</span></label>
                                    <input type="number" step="0.01" name="base_price" class="form-control form-control-premium" value="{{ old('base_price', $service->base_price ?? '0') }}" required placeholder="0.00">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Discounted Price') }}</label>
                                    <input type="number" step="0.01" name="sale_price" class="form-control form-control-premium" value="{{ old('sale_price', $service->sale_price ?? '') }}" placeholder="0.00">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Gallery --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Service Gallery Photos') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Service::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => 'service',
                            'id' => $service->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($service->exists)
                {{-- Recent Quotes --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Recent Leads/Quotes') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-premium mb-0">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Client') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Request') }}</th>
                                        <th class="px-4 py-3 small uppercase letter-spacing-1">{{ __('Date') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($recentQuotes ?? [] as $qt)
                                        <tr>
                                            <td class="px-4 py-3 align-middle font-weight-bold text-dark">{{ $qt->user_name ?? __('Guest') }}</td>
                                            <td class="px-4 py-3 align-middle text-muted small">{{ Str::limit($qt->message, 40) }}</td>
                                            <td class="px-4 py-3 align-middle text-muted small">{{ $qt->created_at->format('M d') }}</td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="3" class="text-center py-5 text-muted small uppercase letter-spacing-1">{{ __('No quote requests yet') }}</td>
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
                        <h3 class="card-title-main">{{ __('Display & Billing Options') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_subscription', 'id' => 'isSub', 'label' => __('Subscription Billing'), 'status' => __('Recurring'), 'checked' => old('is_subscription', $service->is_subscription ?? false)],
                                    ['name' => 'is_project_based', 'id' => 'isProj', 'label' => __('Project-Based'), 'status' => __('Single Work'), 'checked' => old('is_project_based', $service->is_project_based ?? true)],
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
                    'model' => $service,
                    'title' => __('SERVICE'),
                    'back' => 'admin.services.index',
                    'duplicate' => 'admin.services.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Listing Controls') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $service->is_featured ?? false) ? 'checked' : '' }}>
                            <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1" for="isFeatured">{{ __('Featured Listing') }}</label>
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
                            'name' => \App\Models\Service::PRIMARY_MEDIA,
                            'label' => __('Main Listing Image'),
                            'multiple' => false,
                            'model' => 'service',
                            'id' => $service->id ?? null,
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
                            <select name="category_id" class="form-control select2" required>
                                <option value="">{{ __('Select Category') }}</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $service->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">{{ __('Regional Hub') }}</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">{{ __('Select Location') }}</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $service->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->title }}</option>
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
<script src="{{ asset('admin-assets/pages/services-form.js') }}"></script>
@endpush

@if($service->exists)
    <form id="delete-form" action="{{ route('admin.services.destroy', $service->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
@endif

@include('admin._partials._toggle-card-css')
