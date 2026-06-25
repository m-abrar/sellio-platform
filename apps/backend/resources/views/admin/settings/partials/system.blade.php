@extends('admin.settings.settings-layout')

@section('setting-form-content')
@push('js')
    <script src="{{ asset('admin-assets/pages/settings-general.js') }}"></script>
@endpush

    <form action="{{ route('admin.settings.update.group', ['section' => 'system']) }}" method="POST">
        @csrf

        {{-- 1. Platform URLs --}}
        @php
            $platformUrlFields = app(\App\Services\Admin\PlatformUrlVerificationService::class)->getFieldsMetadata($settings);
            $unconfiguredPlatformUrls = collect($platformUrlFields)->filter(fn ($field) => $field['status'] !== 'connected')->count();
        @endphp

        <div class="card border-0 shadow-premium mb-4 rounded-24">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                    <i class="fas fa-link mr-2 text-primary opacity-50"></i> {{ __('Platform URLs') }}
                </h5>
                <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Enter the real absolute URLs for your storefront, admin panel, partner portal, and customer app.') }}</p>
            </div>
            <div class="card-body px-4 pb-4" id="platform-url-settings"
                data-verify-url="{{ route('admin.settings.verify.platform-url') }}">

                @if ($unconfiguredPlatformUrls > 0)
                    <div class="alert alert-warning-light border-0 shadow-xs rounded-xl mb-4">
                        <div class="d-flex align-items-start">
                            <i class="fas fa-exclamation-triangle text-warning mt-1 mr-3"></i>
                            <div class="small">
                                <strong class="text-dark d-block mb-1">{{ __('Action required after installation') }}</strong>
                                <span class="text-secondary">
                                    {{ __('These URLs are intentionally left blank during setup. Replace any demo or placeholder values with your own domains, click Test connection for each field, then save once every URL shows Connected.') }}
                                </span>
                            </div>
                        </div>
                    </div>
                @endif

                <div class="row">
                    @foreach ($platformUrlFields as $fieldKey => $fieldMeta)
                        <div class="col-md-6 mb-3">
                            <div class="form-group platform-url-field mb-0" data-field="{{ $fieldKey }}">
                                <label class="small font-weight-bold text-secondary d-flex align-items-center justify-content-between">
                                    <span>{{ $fieldMeta['label'] }}</span>
                                    <span class="platform-url-status badge badge-{{ $fieldMeta['status'] === 'connected' ? 'success' : ($fieldMeta['status'] === 'empty' ? 'secondary' : 'warning') }} font-weight-bold"
                                        data-status="{{ $fieldMeta['status'] }}">
                                        @if ($fieldMeta['status'] === 'connected')
                                            <i class="fas fa-check-circle mr-1"></i> {{ __('Connected') }}
                                        @elseif ($fieldMeta['status'] === 'empty')
                                            <i class="fas fa-circle mr-1"></i> {{ __('Not configured') }}
                                        @else
                                            <i class="fas fa-exclamation-circle mr-1"></i> {{ __('Not verified') }}
                                        @endif
                                    </span>
                                </label>
                                <div class="input-group shadow-xs">
                                    <input type="url"
                                        name="{{ $fieldKey }}"
                                        class="form-control platform-url-input"
                                        placeholder="{{ $fieldMeta['placeholder'] }}"
                                        value="{{ old($fieldKey, $fieldMeta['value']) }}"
                                        data-verified-value="{{ $settings[$fieldKey . '_verified_url'] ?? '' }}">
                                    <div class="input-group-append">
                                        <button type="button"
                                            class="btn btn-outline-primary btn-verify-platform-url font-weight-bold"
                                            data-field="{{ $fieldKey }}">
                                            <i class="fas fa-plug mr-1"></i> {{ __('Test') }}
                                        </button>
                                    </div>
                                </div>
                                <small class="platform-url-feedback text-muted d-block mt-2">
                                    {{ $fieldMeta['status_message'] }}
                                </small>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- 2. CORS --}}
        @php $corsOrigins = app(\App\Services\CorsOriginResolver::class)->resolve(); @endphp

        <div class="card border-0 shadow-premium mb-4 rounded-24">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                    <i class="fas fa-shield-alt mr-2 text-primary opacity-50"></i> {{ __('API CORS Origins') }}
                </h5>
                <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Browser requests from your platform URLs above are automatically allowed. Add extra origins here for staging or custom domains.') }}</p>
            </div>
            <div class="card-body px-4 pb-4">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary">{{ __('Additional CORS Origins') }}</label>
                    <textarea name="cors_allowed_origins" rows="4" class="form-control"
                        placeholder="https://staging.example.com&#10;https://preview.example.com">{{ old('cors_allowed_origins', $settings['cors_allowed_origins'] ?? '') }}</textarea>
                    <small class="text-muted d-block mt-2">
                        {{ __('One origin per line or comma-separated. Paths are ignored — only the domain is used.') }}
                    </small>
                </div>

                @if (!empty($corsOrigins))
                    <div class="bg-light p-3 rounded-xl border mt-3">
                        <p class="small font-weight-bold text-secondary text-uppercase mb-2 ls-05">
                            {{ __('Active CORS Origins') }}
                        </p>
                        <ul class="mb-0 pl-3 small text-dark">
                            @foreach ($corsOrigins as $origin)
                                <li><code>{{ $origin }}</code></li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </div>
        </div>

        {{-- 3. Access & Editing --}}
        <div class="card border-0 shadow-premium mb-4 rounded-24">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h5 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                    <i class="fas fa-door-open mr-2 text-primary opacity-50"></i> {{ __('Access & Editing') }}
                </h5>
                <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Control how visitors reach the storefront and whether admins can edit content in context.') }}</p>
            </div>
            <div class="card-body px-4 pb-4">
                <div class="form-group mb-4">
                    <label class="small font-weight-bold d-block mb-1 text-uppercase text-secondary ls-05">{{ __('Built-in Website Accessibility') }}</label>
                    <p class="text-muted small mb-3">
                        {{ __('Determine if visitors can access the standard Laravel storefront pages.') }}
                    </p>
                    <select name="built_in_website_status" class="form-control select2 shadow-xs">
                        <option value="active" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'active') ? 'selected' : '' }}>
                            {{ __('Full Access (Standard Laravel Front)') }}
                        </option>
                        <option value="redirect" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'redirect') ? 'selected' : '' }}>
                            {{ __('Intelligent Redirect (Sends Users to their Portals)') }}
                        </option>
                    </select>
                </div>

                <div class="bg-light p-3 rounded-xl border">
                    <div class="custom-control custom-switch">
                        <input type="hidden" name="frontend_edit" value="0">
                        <input type="checkbox" name="frontend_edit" class="custom-control-input" id="frontendEdit"
                            value="1" {{ (old('frontend_edit', $settings['frontend_edit'] ?? '0') == '1') ? 'checked' : '' }}>
                        <label class="custom-control-label font-weight-bold text-dark" for="frontendEdit">
                            {{ __('Enable In-Context Frontend Editing') }}
                        </label>
                        <p class="text-muted small mb-0 mt-1">
                            {{ __('Allows super-admins to modify page content directly from the public storefront while logged in.') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-right pb-5">
            <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold shadow-premium">
                <i class="fas fa-save mr-2"></i> {{ __('Save System Settings') }}
            </button>
        </div>
    </form>
@endsection
