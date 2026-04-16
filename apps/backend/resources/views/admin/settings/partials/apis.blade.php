@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'apis']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
            <h3 class="card-title font-weight-bold text-dark">
                <i class="fas fa-code mr-2 text-primary"></i>{{ __('APIs & Custom Scripts') }}
            </h3>
        </div>
        <div class="card-body bg-light-gray">
            <div class="row">
                <div class="col-12 mb-4">
                    <div class="card border-0 shadow-xs">
                        <div class="card-body p-3">
                            <label class="font-weight-bold text-dark"><i class="fab fa-google mr-1 text-danger"></i> Google Map API Key</label>
                            <input type="text" name="google_map_api_key" class="form-control border-light" placeholder="AIza..." value="{{ old('google_map_api_key', $settings['google_map_api_key'] ?? '') }}">
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-xs h-100">
                        <div class="card-body p-3">
                            <label class="font-weight-bold text-dark"><i class="fas fa-chart-line mr-1 text-success"></i> Google Analytics Code</label>
                            <textarea name="google_analytics" class="form-control border-light text-monospace small" rows="5" placeholder="">{{ old('google_analytics', $settings['google_analytics'] ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 mb-4">
                    <div class="card border-0 shadow-xs h-100">
                        <div class="card-body p-3">
                            <label class="font-weight-bold text-dark"><i class="fas fa-terminal mr-1 text-info"></i> Custom Head Code</label>
                            <textarea name="custom_head_code" class="form-control border-light text-monospace small" rows="5" placeholder="<meta name='...'>">{{ old('custom_head_code', $settings['custom_head_code'] ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <div class="card border-0 shadow-xs">
                        <div class="card-body p-3">
                            <label class="font-weight-bold text-dark"><i class="fas fa-stream mr-1 text-secondary"></i> Custom Footer Code</label>
                            <textarea name="custom_footer_code" class="form-control border-light text-monospace small" rows="3" placeholder="Chat widgets or </body> scripts">{{ old('custom_footer_code', $settings['custom_footer_code'] ?? '') }}</textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-white text-right">
            <button type="submit" class="btn btn-primary px-5 rounded-pill font-weight-bold">
                <i class="fas fa-save mr-1"></i> {{ __('Save API Configurations') }}
            </button>
        </div>
    </div>
</form>
@endsection
