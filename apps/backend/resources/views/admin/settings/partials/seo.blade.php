{{--
    Administrative Infrastructure Component: SEO Orchestration
    
    This partial facilitates the management of global search engine 
    optimization parameters. It allows for the configuration of meta 
    titles and descriptions, providing real-time length auditing to 
    ensure maximum search visibility and high-fidelity social 
    sharing previews.
    
    @extends admin.settings.settings-layout
    @context Infrastructure Management
    @variables Array $settings Collection of key-value system settings.
--}}
@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'seo']) }}" method="POST">
    @csrf
    <div class="card border-0 shadow-premium" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-search mr-2 text-primary opacity-50"></i> {{ __('Search Engine Optimization') }}
            </h3>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">Optimize how your marketplace appears in global search results and social shares.</p>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group mb-4">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Global Meta Title') }}</label>
                        <input type="text" name="meta_title" class="form-control" value="{{ old('meta_title', $settings['meta_title'] ?? '') }}" placeholder="Primary Title for Search Engines">
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1">Target Length: 50-60 characters</small>
                            <small class="text-primary smallest font-weight-bold">{{ strlen($settings['meta_title'] ?? '') }} chars</small>
                        </div>
                    </div>
                    
                    <div class="form-group mb-0">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Global Meta Description') }}</label>
                        <textarea name="meta_description" class="form-control" rows="4" style="height: auto !important;" placeholder="Brief summary of your platform...">{{ old('meta_description', $settings['meta_description'] ?? '') }}</textarea>
                        <div class="d-flex justify-content-between mt-2">
                            <small class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1">Target Length: 150-160 characters</small>
                            <small class="text-primary smallest font-weight-bold">{{ strlen($settings['meta_description'] ?? '') }} chars</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-light py-4 px-4 border-0 text-right">
            <button type="submit" class="btn btn-primary rounded-pill px-5 font-weight-bold">
                <i class="fas fa-rocket mr-2"></i> {{ __('Deploy SEO Assets') }}
            </button>
        </div>
    </div>
</form>
@endsection
