@extends('admin.settings.settings-layout')

@section('setting-form-content')
    {{-- Ensure Alpine.js is available for the enhancements --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

    <form action="{{ route('admin.settings.update.group', ['section' => 'general']) }}" method="POST"
        enctype="multipart/form-data">
        @csrf

        <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-3">
                <h3 class="card-title font-weight-bold text-dark">{{ __('Identity & Localization') }}</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Site Name') }}</label>
                            <div class="input-group">
                                <div class="input-group-prepend"><span class="input-group-text bg-light"><i
                                            class="fas fa-globe"></i></span></div>
                                <input type="text" name="site_name" class="form-control"
                                    value="{{ old('site_name', $settings['site_name'] ?? '') }}">
                            </div>
                            <div class="custom-control custom-checkbox mt-2">
                                <input type="checkbox" name="hide_site_name" class="custom-control-input" id="hideSiteName"
                                    value="1" {{ (old('hide_site_name', $settings['hide_site_name'] ?? '0') == '1') ? 'checked' : '' }}>
                                <label class="custom-control-label small text-muted" for="hideSiteName">
                                    {{ __('Hide Company Name text in header (if logo is present)') }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Site Tagline') }}</label>
                            <input type="text" name="site_tagline" class="form-control"
                                value="{{ old('site_tagline', $settings['site_tagline'] ?? '') }}">
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div class="row">
                    <div class="col-md-6 text-center border-right">
                        <label class="d-block small font-weight-bold mb-3">{{ __('Main Brand Logo') }}</label>
                        
                        <div x-data="{ 
                            imageUrl: '{{ isset($settings['site_logo']) ? asset('storage/' . $settings['site_logo']) : '' }}',
                            dragover: false,
                            handleFile(event) {
                                const file = event.target.files[0];
                                if (file) {
                                    this.imageUrl = URL.createObjectURL(file);
                                }
                            },
                            handleDrop(event) {
                                const file = event.dataTransfer.files[0];
                                if (file) {
                                    this.$refs.logoInput.files = event.dataTransfer.files;
                                    this.imageUrl = URL.createObjectURL(file);
                                }
                                this.dragover = false;
                            }
                        }" 
                        @dragover.prevent="dragover = true" 
                        @dragleave.prevent="dragover = false" 
                        @drop.prevent="handleDrop($event)"
                        class="dropzone-wrapper move-pointer mb-3 p-3 rounded"
                        :class="dragover ? 'dropzone-dragover' : 'bg-light border-dashed'">
                            
                            <div class="preview-container d-flex flex-column align-items-center justify-content-center" 
                                 style="min-height: 120px;" 
                                 @click="$refs.logoInput.click()">
                                <template x-if="imageUrl">
                                    <img :src="imageUrl" class="img-fluid drop-shadow-sm mb-2" style="max-height: 70px;" alt="Logo Preview">
                                </template>
                                <template x-if="!imageUrl">
                                    <div class="text-center py-2">
                                        <i class="fas fa-cloud-upload-alt fa-2x text-muted opacity-50 mb-2"></i>
                                        <p class="text-muted small mb-0">{{ __('Drag & Drop Logo here') }}</p>
                                    </div>
                                </template>

                                <div class="mt-2">
                                    <span class="btn btn-xs btn-outline-primary px-3 rounded-pill shadow-xs">
                                        <i class="fas fa-folder-open mr-1"></i> {{ __('Choose File') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_logo" x-ref="logoInput" class="d-none" @change="handleFile($event)" accept="image/*">
                        </div>
                        <p class="text-muted smallest mt-n1">{{ __('Or') }} <a href="javascript:void(0)" @click="$refs.logoInput.click()" class="text-primary font-weight-bold">{{ __('Browse') }}</a> {{ __('to upload logo') }}</p>
                    </div>

                    <div class="col-md-6 text-center"
                         x-data="{ 
                            imageUrl: '{{ isset($settings['site_favicon']) ? asset('storage/' . $settings['site_favicon']) : '' }}',
                            dragover: false,
                            handleFile(event) {
                                const file = event.target.files[0];
                                if (file) {
                                    this.imageUrl = URL.createObjectURL(file);
                                }
                            },
                            handleDrop(event) {
                                const file = event.dataTransfer.files[0];
                                if (file) {
                                    this.$refs.faviconInput.files = event.dataTransfer.files;
                                    this.imageUrl = URL.createObjectURL(file);
                                }
                                this.dragover = false;
                            }
                        }">
                        <label class="d-block small font-weight-bold mb-3">{{ __('Browser Favicon') }}</label>
                        
                        <div @dragover.prevent="dragover = true" 
                             @dragleave.prevent="dragover = false" 
                             @drop.prevent="handleDrop($event)"
                             @click="$refs.faviconInput.click()"
                             class="dropzone-wrapper move-pointer mb-3 p-3 rounded mx-auto"
                             :class="dragover ? 'dropzone-dragover' : 'bg-light border-dashed'"
                             style="width: 140px;">
                            
                            <div class="preview-container d-flex flex-column align-items-center justify-content-center" style="height: 100px;">
                                <template x-if="imageUrl">
                                    <img :src="imageUrl" width="48" height="48" class="drop-shadow-sm" alt="Favicon Preview">
                                </template>
                                <template x-if="!imageUrl">
                                    <div class="text-center">
                                        <i class="fas fa-icons fa-lg text-muted opacity-50 mb-1"></i>
                                        <p class="text-muted smallest mb-0">{{ __('Drop Icon') }}</p>
                                    </div>
                                </template>

                                <div class="mt-2">
                                    <span class="btn btn-xs btn-outline-info px-2 rounded-pill shadow-xs" style="font-size: 10px;">
                                        <i class="fas fa-search mr-1"></i> {{ __('Browse') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_favicon" x-ref="faviconInput" class="d-none" @change="handleFile($event)" accept="image/*">
                        </div>
                        <p class="text-muted smallest mt-1"><a href="javascript:void(0)" @click="$refs.faviconInput.click()" class="text-info font-weight-bold">{{ __('Browse') }}</a> {{ __('for favicon') }}</p>
                    </div>
                </div>

                <hr class="my-4">

                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Default Language') }}</label>
                            <select name="default_language" class="form-control select2">
                                @foreach(['en' => 'English', 'fr' => 'French', 'es' => 'Spanish'] as $code => $label)
                                    <option value="{{ $code }}" {{ (old('default_language', $settings['default_language'] ?? '') == $code) ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Timezone') }}</label>
                            <input type="text" name="timezone" class="form-control"
                                value="{{ old('timezone', $settings['timezone'] ?? 'UTC') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Currency Symbol') }}</label>
                            <input type="text" name="currency_symbol" class="form-control"
                                value="{{ old('currency_symbol', $settings['currency_symbol'] ?? '$') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Currency Code') }}</label>
                            <div class="input-group-append">
                                <input type="text" name="currency_code" class="form-control"
                                    value="{{ old('currency_code', $settings['currency_code'] ?? 'USD') }}">
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <h5 class="font-weight-bold text-secondary small text-uppercase"><i class="fas fa-link mr-1"></i>
                            {{ __('External Application URLs') }}</h5>
                        <p class="text-muted small">
                            {{ __('Configure absolute domains or paths to direct users to separate React/subdomain portals accurately.') }}
                        </p>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Frontend / Public URL') }}</label>
                            <input type="url" name="url_frontend" class="form-control"
                                value="{{ old('url_frontend', $settings['url_frontend'] ?? 'http://127.0.0.1:8000') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Backend / Admin URL') }}</label>
                            <input type="url" name="url_admin" class="form-control"
                                value="{{ old('url_admin', $settings['url_admin'] ?? 'http://127.0.0.1:8000/admin') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('Partner / Seller Portal URL') }}</label>
                            <input type="url" name="url_partner" class="form-control"
                                placeholder="https://sellers.example.com"
                                value="{{ old('url_partner', $settings['url_partner'] ?? '') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold">{{ __('User / Buyer Portal URL') }}</label>
                            <input type="url" name="url_user" class="form-control"
                                placeholder="https://app.example.com"
                                value="{{ old('url_user', $settings['url_user'] ?? '') }}">
                        </div>
                    </div>
                </div>

                <hr class="my-4">

                <div class="row">
                    <div class="col-md-12 mb-3">
                        <div class="form-group">
                            <label class="small font-weight-bold d-block mb-1 text-uppercase text-secondary"
                                style="letter-spacing: 0.5px;">{{ __('Built-in Public Website') }}</label>
                            <p class="text-muted small mb-3">
                                {{ __('Control whether visitors can access the built-in Laravel pages. Disable this if you are using a separate React frontend to avoid duplicate public pages.') }}
                            </p>
                            <select name="built_in_website_status" class="form-control select2 shadow-xs">
                                <option value="active" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'active') ? 'selected' : '' }}>
                                    <i class="fas fa-check-circle mr-1"></i>
                                    {{ __('Active (Built-in Website is Accessible)') }}
                                </option>
                                <option value="redirect" {{ (old('built_in_website_status', $settings['built_in_website_status'] ?? 'active') == 'redirect') ? 'selected' : '' }}>
                                    <i class="fas fa-external-link-alt mr-1"></i>
                                    {{ __('Smart Redirect (Sends Users to their assigned Dashboards)') }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="col-md-12 mt-2">
                        <div class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input type="hidden" name="frontend_edit" value="0">
                                <input type="checkbox" name="frontend_edit" class="custom-control-input" id="frontendEdit"
                                    value="1" {{ (old('frontend_edit', $settings['frontend_edit'] ?? '0') == '1') ? 'checked' : '' }}>
                                <label class="custom-control-label font-weight-bold text-dark" for="frontendEdit">
                                    {{ __('Enable Frontend Editing') }}
                                </label>
                                <small class="form-text text-muted">
                                    {{ __('Allow administrators to edit content directly from the public-facing website.') }}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="card-footer bg-white text-right">
                <button type="submit" class="btn btn-primary px-4 shadow-sm font-weight-bold">
                    <i class="fas fa-save mr-1"></i> {{ __('Save Changes') }}
                </button>
            </div>
        </div>
    </form>
@endsection

@push('css')
<style>
    .border-dashed { border: 2px dashed #dee2e6 !important; }
    .dropzone-wrapper { 
        cursor: pointer; 
        transition: all 0.3s ease; 
        position: relative;
        border: 2px dashed #cbd5e0;
    }
    .dropzone-wrapper:hover { 
        border-color: #007bff; 
        background-color: #f8fbff !important;
        transform: translateY(-2px);
    }
    .dropzone-dragover { 
        border-color: #007bff !important; 
        background-color: #e7f3ff !important; 
        box-shadow: 0 0 0 4px rgba(0,123,255,0.1);
    }
    .move-pointer { cursor: pointer; }
    .smallest { font-size: 0.75rem; }
    .drop-shadow-sm { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
    .transition-all { transition: all 0.2s ease-in-out; }
</style>
@endpush