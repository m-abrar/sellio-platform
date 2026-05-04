@extends('admin.settings.settings-layout')

@section('setting-form-content')
    {{-- Ensure Alpine.js is available for the enhancements --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

    <form action="{{ route('admin.settings.update.group', ['section' => 'general']) }}" method="POST"
        enctype="multipart/form-data">
        @csrf

        <div class="card border-0 shadow-premium">
            <div class="card-header bg-white py-4 px-4 border-0">
                <h3 class="card-title font-weight-bold text-dark mb-0">{{ __('Identity & Localization') }}</h3>
                <p class="text-muted small mb-0 mt-1">Configure your marketplace name, branding, and regional preferences.</p>
            </div>
            <div class="card-body px-4 pb-4">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Site Name') }}</label>
                            <div class="input-group shadow-xs">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="fas fa-globe text-primary"></i></span>
                                </div>
                                <input type="text" name="site_name" class="form-control"
                                    value="{{ old('site_name', $settings['site_name'] ?? '') }}">
                            </div>
                            <div class="custom-control custom-checkbox custom-control-premium mt-3">
                                <input type="checkbox" name="hide_site_name" class="custom-control-input" id="hideSiteName"
                                    value="1" {{ (old('hide_site_name', $settings['hide_site_name'] ?? '0') == '1') ? 'checked' : '' }}>
                                <label class="custom-control-label small text-muted font-weight-bold" for="hideSiteName">
                                    {{ __('Hide Company Name text in header (if logo is present)') }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Site Tagline') }}</label>
                            <input type="text" name="site_tagline" class="form-control" style="border-radius: 10px;"
                                value="{{ old('site_tagline', $settings['site_tagline'] ?? '') }}">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-6 text-center border-right border-light">
                        <label class="d-block small font-weight-bold text-uppercase text-secondary mb-3" style="letter-spacing: 0.5px;">{{ __('Main Brand Logo') }}</label>
                        
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
                        class="dropzone-wrapper move-pointer mb-3 p-4 rounded-xl"
                        style="border-radius: 20px; border: 2px dashed #e2e8f0; transition: all 0.3s ease;"
                        :class="dragover ? 'bg-primary-soft border-primary' : 'bg-light'">
                            
                            <div class="preview-container d-flex flex-column align-items-center justify-content-center" 
                                 style="min-height: 140px;" 
                                 @click="$refs.logoInput.click()">
                                <template x-if="imageUrl">
                                    <img :src="imageUrl" class="img-fluid drop-shadow-sm mb-3" style="max-height: 80px;" alt="Logo Preview">
                                </template>
                                <template x-if="!imageUrl">
                                    <div class="text-center py-2">
                                        <div class="icon-circle bg-white shadow-xs mx-auto mb-3" style="width: 60px; height: 60px; border-radius: 50%;">
                                            <i class="fas fa-cloud-upload-alt text-primary fa-lg"></i>
                                        </div>
                                        <p class="text-dark font-weight-bold mb-1">{{ __('Upload Platform Logo') }}</p>
                                        <p class="text-muted small mb-0">{{ __('SVG, PNG or JPG (Max 2MB)') }}</p>
                                    </div>
                                </template>

                                <div class="mt-3">
                                    <span class="btn btn-sm btn-white rounded-pill px-4 font-weight-bold shadow-xs border">
                                        <i class="fas fa-search mr-1 text-primary"></i> {{ __('Browse Files') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_logo" x-ref="logoInput" class="d-none" @change="handleFile($event)" accept="image/*">
                        </div>
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
                        <label class="d-block small font-weight-bold text-uppercase text-secondary mb-3" style="letter-spacing: 0.5px;">{{ __('Browser Favicon') }}</label>
                        
                        <div @dragover.prevent="dragover = true" 
                             @dragleave.prevent="dragover = false" 
                             @drop.prevent="handleDrop($event)"
                             @click="$refs.faviconInput.click()"
                             class="dropzone-wrapper move-pointer mb-3 p-4 rounded-xl mx-auto"
                             style="width: 180px; border-radius: 20px; border: 2px dashed #e2e8f0; transition: all 0.3s ease;"
                             :class="dragover ? 'bg-info-soft border-info' : 'bg-light'">
                            
                            <div class="preview-container d-flex flex-column align-items-center justify-content-center" style="height: 140px;">
                                <template x-if="imageUrl">
                                    <img :src="imageUrl" width="56" height="56" class="drop-shadow-sm rounded shadow-xs" alt="Favicon Preview">
                                </template>
                                <template x-if="!imageUrl">
                                    <div class="text-center">
                                        <div class="icon-circle bg-white shadow-xs mx-auto mb-3" style="width: 50px; height: 50px; border-radius: 50%;">
                                            <i class="fas fa-icons text-info"></i>
                                        </div>
                                        <p class="text-dark font-weight-bold mb-1" style="font-size: 0.8rem;">{{ __('Favicon') }}</p>
                                    </div>
                                </template>

                                <div class="mt-3">
                                    <span class="btn btn-xs btn-white rounded-pill px-3 font-weight-bold shadow-xs border">
                                        {{ __('Browse') }}
                                    </span>
                                </div>
                            </div>
                            
                            <input type="file" name="site_favicon" x-ref="faviconInput" class="d-none" @change="handleFile($event)" accept="image/*">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Default Language') }}</label>
                            <select name="default_language" class="form-control select2 shadow-xs">
                                @foreach(['en' => 'English', 'fr' => 'French', 'es' => 'Spanish'] as $code => $label)
                                    <option value="{{ $code }}" {{ (old('default_language', $settings['default_language'] ?? '') == $code) ? 'selected' : '' }}>{{ $label }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Timezone') }}</label>
                            <input type="text" name="timezone" class="form-control"
                                value="{{ old('timezone', $settings['timezone'] ?? 'UTC') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Currency Symbol') }}</label>
                            <input type="text" name="currency_symbol" class="form-control"
                                value="{{ old('currency_symbol', $settings['currency_symbol'] ?? '$') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="form-group">
                            <label class="small font-weight-bold text-uppercase text-secondary mb-2">{{ __('Currency Code') }}</label>
                            <input type="text" name="currency_code" class="form-control"
                                value="{{ old('currency_code', $settings['currency_code'] ?? 'USD') }}">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-12 mb-3">
                        <h5 class="font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;"><i class="fas fa-link mr-2 text-primary"></i>
                            {{ __('Platform Ecosystem URLs') }}</h5>
                        <p class="text-muted small">
                            {{ __('Configure the absolute domains for your distributed application components.') }}
                        </p>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-secondary">{{ __('Public Storefront URL') }}</label>
                            <input type="url" name="url_frontend" class="form-control"
                                value="{{ old('url_frontend', $settings['url_frontend'] ?? 'http://127.0.0.1:8000') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-secondary">{{ __('Admin Control Panel URL') }}</label>
                            <input type="url" name="url_admin" class="form-control"
                                value="{{ old('url_admin', $settings['url_admin'] ?? 'http://127.0.0.1:8000/admin') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-secondary">{{ __('Partner Portal URL') }}</label>
                            <input type="url" name="url_partner" class="form-control"
                                placeholder="https://sellers.lebrince.com"
                                value="{{ old('url_partner', $settings['url_partner'] ?? '') }}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="small font-weight-bold text-secondary">{{ __('Customer App URL') }}</label>
                            <input type="url" name="url_user" class="form-control"
                                placeholder="https://app.lebrince.com"
                                value="{{ old('url_user', $settings['url_user'] ?? '') }}">
                        </div>
                    </div>
                </div>

                <div class="row mt-4 pt-4 border-top">
                    <div class="col-md-12 mb-3">
                        <div class="form-group">
                            <label class="small font-weight-bold d-block mb-1 text-uppercase text-secondary"
                                style="letter-spacing: 0.5px;">{{ __('Built-in Website Accessibility') }}</label>
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
                    </div>

                    <div class="col-md-12 mt-2">
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

            </div>
            <div class="card-footer bg-light py-4 px-4 border-0 text-right">
                <button type="submit" class="btn btn-primary btn-lg rounded-pill px-5 font-weight-bold">
                    <i class="fas fa-save mr-2"></i> {{ __('Save Configuration') }}
                </button>
            </div>
        </div>
    </form>
@endsection

@push('css')
<style>
    .rounded-xl { border-radius: 16px !important; }
    .dropzone-wrapper:hover { 
        border-color: var(--primary) !important; 
        background-color: var(--primary-soft) !important;
        transform: translateY(-3px);
        box-shadow: var(--premium-shadow);
    }
</style>
@endpush