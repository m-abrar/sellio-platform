{{-- Section 1: Basic Info --}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">Campaign Identity</h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Advertisement Title <span class="text-danger">*</span></label>
            <input type="text" name="title" id="title" class="form-control form-control-hero @error('title') is-invalid @enderror" 
                   value="{{ old('title', $advertisement->title ?? '') }}" placeholder="e.g. Summer Sale Banner" required>
            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-0">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Click-through URL (Link)</label>
            <input type="url" name="link" id="link" class="form-control form-control-premium @error('link') is-invalid @enderror"
                   value="{{ old('link', $advertisement->link ?? '') }}" placeholder="https://example.com/promo">
            @error('link') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>
    </div>
</div>

{{-- Section 2: Geo-Targeting --}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">Geospatial Targeting</h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="row">
            <div class="col-md-6 form-group mb-4">
                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Latitude</label>
                <input type="text" name="latitude" class="form-control form-control-premium" value="{{ old('latitude', $advertisement->latitude ?? '') }}" placeholder="0.000000">
            </div>
            <div class="col-md-6 form-group mb-4">
                <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Longitude</label>
                <input type="text" name="longitude" class="form-control form-control-premium" value="{{ old('longitude', $advertisement->longitude ?? '') }}" placeholder="0.000000">
            </div>
        </div>

        <div class="form-group bg-light p-4 mb-4" style="border-radius: 16px; border: 1px solid var(--border-light);">
            <label class="small font-weight-bold text-dark mb-3 uppercase letter-spacing-1 d-block">
                Target Radius: <span id="radius-display" class="text-primary font-weight-bold ml-1">{{ old('radius', $advertisement->radius ?? 5) }} KM</span>
            </label>
            <input type="range" name="radius" id="radius" class="custom-range custom-range-primary" min="1" max="100" value="{{ old('radius', $advertisement->radius ?? 5) }}">
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Specific Cities</label>
            <input type="text" name="cities" id="cities" 
                class="form-control form-control-premium {{ $errors->has('cities') ? 'is-invalid' : '' }}" 
                placeholder="e.g., New York, Los Angeles, Chicago" 
                value="{{ old('cities', is_array($advertisement->cities ?? null) ? implode(', ', $advertisement->cities) : ($advertisement->cities ?? '')) }}">
            @error('cities') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Specific Zip Codes</label>
            <input type="text" name="zipcodes" id="zipcodes" 
                class="form-control form-control-premium {{ $errors->has('zipcodes') ? 'is-invalid' : '' }}" 
                placeholder="e.g., 10001, 90001, 60601" 
                value="{{ old('zipcodes', is_array($advertisement->zipcodes ?? null) ? implode(', ', $advertisement->zipcodes) : ($advertisement->zipcodes ?? '')) }}">
            @error('zipcodes') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
        </div>

        <div class="form-group mb-0">
            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Specific Regions</label>
            <input type="text" name="regions" id="regions" 
                class="form-control form-control-premium {{ $errors->has('regions') ? 'is-invalid' : '' }}" 
                placeholder="e.g., Northeast, Midwest, West" 
                value="{{ old('regions', is_array($advertisement->regions ?? null) ? implode(', ', $advertisement->regions) : ($advertisement->regions ?? '')) }}">
            @error('regions') <div class="invalid-feedback d-block">{{ $message }}</div> @enderror
        </div>
    </div>
</div>

{{-- Section 3: Visual Orientations --}}
<div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-main">Placement Strategy</h3>
    </div>
    <div class="card-body p-4 pt-0">
        <div class="row orientation-grid text-center">
            @foreach ([
                'header' => 'header-tile',
                'homepage-a' => 'home-tile', 'homepage-b' => 'home-tile', 'homepage-c' => 'home-tile',
                'homepage-d' => 'home-tile', 'homepage-e' => 'home-tile', 'homepage-f' => 'home-tile',
                'searchpage' => 'search-tile', 'sidebar' => 'sidebar-tile',
                'footer' => 'footer-tile',
                'listings' => 'general-tile', 'blogs' => 'general-tile'
            ] as $orientation => $class)
                <div class="col-md-3 col-6 mb-3">
                    <label class="orientation-selector w-100 cursor-pointer">
                        <input type="checkbox" name="orientations[]" value="{{ $orientation }}" 
                               class="d-none" id="check-{{ $orientation }}"
                               {{ in_array($orientation, old('orientations', $advertisement->orientations ?? [])) ? 'checked' : '' }}>
                        
                        <div class="tile-box {{ $class }} shadow-sm">
                            <div class="tile-check-icon shadow-sm"><i class="fas fa-check-circle"></i></div>
                            <span class="tile-label">{{ strtoupper(str_replace('-', ' ', $orientation)) }}</span>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
        @error('orientations') <div class="text-danger small mt-2 font-weight-bold">{{ $message }}</div> @enderror
    </div>
</div>

@push('css')
<style>
    /* Hidden Checkbox Logic */
    .orientation-selector input[type="checkbox"]:checked + .tile-box {
        border: 2px solid #10b981 !important;
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(16, 185, 129, 0.15) !important;
    }

    .orientation-selector input[type="checkbox"]:checked + .tile-box .tile-check-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Base Tile Styling */
    .tile-box {
        position: relative;
        padding: 24px 12px;
        border-radius: 16px;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        min-height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8fafc;
    }

    .tile-label {
        font-weight: 800;
        font-size: 0.7rem;
        color: #fff;
        letter-spacing: 0.8px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .tile-check-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        color: #10b981;
        background: #fff;
        border-radius: 50%;
        display: none;
        width: 24px;
        height: 24px;
        font-size: 1.1rem;
        z-index: 5;
    }

    /* Color Mapping */
    .header-tile { background: linear-gradient(135deg, #f472b6, #db2777) !important; }
    .home-tile { background: linear-gradient(135deg, #fbbf24, #d97706) !important; }
    .search-tile { background: linear-gradient(135deg, #a78bfa, #7c3aed) !important; }
    .sidebar-tile { background: linear-gradient(135deg, #60a5fa, #2563eb) !important; }
    .footer-tile { background: linear-gradient(135deg, #2dd4bf, #0d9488) !important; }
    .general-tile { background: linear-gradient(135deg, #94a3b8, #475569) !important; }

    .tile-box:hover { transform: translateY(-3px); opacity: 0.95; }
    
    /* Custom Range Styling */
    .custom-range-primary::-webkit-slider-thumb { background-color: var(--primary); }
    .custom-range-primary::-moz-range-thumb { background-color: var(--primary); }
    .custom-range-primary::-ms-thumb { background-color: var(--primary); }
</style>
@endpush

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const radiusInput = document.getElementById('radius');
        const radiusDisplay = document.getElementById('radius-display');
        
        if (radiusInput && radiusDisplay) {
            radiusInput.addEventListener('input', function() {
                radiusDisplay.textContent = this.value + ' KM';
            });
        }
    });
</script>
@endpush
