@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'seo']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
            <h3 class="card-title font-weight-bold text-dark">
                <i class="fas fa-search mr-2 text-success"></i>{{ __('Search Engine Optimization') }}
            </h3>
        </div>
        <div class="card-body bg-light-gray p-4">
            <div class="card border-0 shadow-xs mb-4">
                <div class="card-body">
                    <div class="form-group mb-4">
                        <label class="font-weight-bold">Meta Title</label>
                        <input type="text" name="meta_title" class="form-control border-light-gray" value="{{ old('meta_title', $settings['meta_title'] ?? '') }}" placeholder="Primary Title for Search Engines">
                        <small class="text-muted">Recommended: 50-60 characters.</small>
                    </div>
                    <div class="form-group mb-0">
                        <label class="font-weight-bold">Meta Description</label>
                        <textarea name="meta_description" class="form-control border-light-gray" rows="4" placeholder="Brief summary of your platform...">{{ old('meta_description', $settings['meta_description'] ?? '') }}</textarea>
                        <small class="text-muted">Recommended: 150-160 characters.</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-white text-right">
            <button type="submit" class="btn btn-primary px-5 rounded-pill font-weight-bold">
                <i class="fas fa-check-circle mr-1"></i> {{ __('Update SEO Meta') }}
            </button>
        </div>
    </div>
</form>
@endsection
