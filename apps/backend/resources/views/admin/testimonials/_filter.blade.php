<div class="card registry-card-premium registry-filter-card mb-4">
    <div class="card-body">
        <form method="GET" action="{{ url()->current() }}">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="form-label-premium">{{ __('Publication Status') }}</label>
                    <div class="input-group input-group-premium select2-input-group-fix">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-traffic-light text-xs"></i></span>
                        </div>
                        <select name="status" class="form-control select2">
                            <option value="">{{ __('All Statuses') }}</option>
                            @foreach([\App\Models\Testimonial::STATUS_DRAFT, \App\Models\Testimonial::STATUS_PUBLISHED, \App\Models\Testimonial::STATUS_ARCHIVED] as $status)
                                <option value="{{ $status }}" @selected(request('status') === $status)>{{ Str::headline($status) }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label-premium">{{ __('Theme Scope') }}</label>
                    <div class="input-group input-group-premium select2-input-group-fix">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-palette text-xs"></i></span>
                        </div>
                        <select name="theme_id" class="form-control select2">
                            <option value="">{{ __('All Theme Scopes') }}</option>
                            <option value="global" @selected(request('theme_id') === 'global')>{{ __('Global Only') }}</option>
                            @foreach($themes as $theme)
                                <option value="{{ $theme->id }}" @selected((string) request('theme_id') === (string) $theme->id)>
                                    {{ $theme->title }} ({{ $theme->theme_key }})
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-3">
                    <label class="form-label-premium">{{ __('Featured Placement') }}</label>
                    <div class="input-group input-group-premium select2-input-group-fix">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-star text-xs"></i></span>
                        </div>
                        <select name="featured" class="form-control select2">
                            <option value="">{{ __('Any') }}</option>
                            <option value="1" @selected(request('featured') === '1')>{{ __('Featured on Theme') }}</option>
                            <option value="0" @selected(request('featured') === '0')>{{ __('Not Featured') }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex align-items-center justify-content-end gap-12">
                        <button type="submit" class="btn-filter-premium flex-grow-1">
                            <i class="fas fa-sync-alt mr-2"></i> {{ __('FILTER') }}
                        </button>
                        <a href="{{ url()->current() }}" class="btn-reset-premium" data-toggle="tooltip" title="{{ __('Reset Filters') }}">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
