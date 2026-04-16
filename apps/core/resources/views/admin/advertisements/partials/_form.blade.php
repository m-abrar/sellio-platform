{{-- Section 1: Basic Info --}}
<div class="card shadow-sm rounded-3 border-0 mb-4">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">General Information</h3>
    </div>
    <div class="card-body">
        <div class="form-group mb-4">
            <label for="title">Advertisement Title <span class="text-danger">*</span></label>
            <input type="text" name="title" id="title" class="form-control form-control-lg @error('title') is-invalid @enderror" 
                   value="{{ old('title', $advertisement->title ?? '') }}" placeholder="e.g. Summer Sale Banner">
            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-0">
            <label for="link">Click-through URL (Link)</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-light"><i class="fas fa-link text-muted"></i></span>
                </div>
                <input type="url" name="link" id="link" class="form-control @error('link') is-invalid @enderror"
                       value="{{ old('link', $advertisement->link ?? '') }}" placeholder="https://example.com/promo">
            </div>
            @error('link') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>
    </div>
</div>

{{-- Section 2: Geo-Targeting --}}
<div class="card shadow-sm rounded-3 border-0 mb-4">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">Location Targeting</h3>
    </div>
    <div class="card-body">
        <div class="row">
            <div class="col-md-6 form-group">
                <label>Latitude</label>
                <input type="text" name="latitude" class="form-control" value="{{ old('latitude', $advertisement->latitude ?? '') }}">
            </div>
            <div class="col-md-6 form-group">
                <label>Longitude</label>
                <input type="text" name="longitude" class="form-control" value="{{ old('longitude', $advertisement->longitude ?? '') }}">
            </div>
        </div>

        <div class="form-group bg-light p-3 rounded border">
            <label for="radius">Target Radius: <span id="radius-display" class="text-primary font-weight-bold">{{ old('radius', $advertisement->radius ?? 5) }} KM</span></label>
            <input type="range" name="radius" id="radius" class="form-control-range" min="1" max="100" value="{{ old('radius', $advertisement->radius ?? 5) }}">
        </div>

        <div class="form-group">
            <label for="cities">Specific Cities (Comma Separated)</label>
            <input type="text" name="cities" id="cities" 
                class="form-control {{ $errors->has('cities') ? 'is-invalid' : '' }}" 
                placeholder="e.g., New York, Los Angeles, Chicago" 
                value="{{ old('cities', is_array($advertisement->cities ?? null) ? implode(', ', $advertisement->cities) : ($advertisement->cities ?? '')) }}">
            @error('cities') <div class="invalid-feedback">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="zipcodes">Specific Zip Codes (Comma Separated)</label>
            <input type="text" name="zipcodes" id="zipcodes" 
                class="form-control {{ $errors->has('zipcodes') ? 'is-invalid' : '' }}" 
                placeholder="e.g., 10001, 90001, 60601" 
                value="{{ old('zipcodes', is_array($advertisement->zipcodes ?? null) ? implode(', ', $advertisement->zipcodes) : ($advertisement->zipcodes ?? '')) }}">
            @error('zipcodes') <div class="invalid-feedback">{{ $message }}</div> @enderror
        </div>

        <div class="form-group">
            <label for="regions">Specific Regions (Comma Separated)</label>
            <input type="text" name="regions" id="regions" 
                class="form-control {{ $errors->has('regions') ? 'is-invalid' : '' }}" 
                placeholder="e.g., Northeast, Midwest, West" 
                value="{{ old('regions', is_array($advertisement->regions ?? null) ? implode(', ', $advertisement->regions) : ($advertisement->regions ?? '')) }}">
            @error('regions') <div class="invalid-feedback">{{ $message }}</div> @enderror
        </div>
        
    </div>
</div>

{{-- Section 3: Visual Orientations --}}
<div class="card shadow-sm rounded-3 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold">
            <i class="fas fa-layer-group mr-1 text-primary"></i> Display Placements
        </h3>
    </div>
    <div class="card-body">
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
                            <div class="tile-check-icon"><i class="fas fa-check-circle"></i></div>
                            <span class="tile-label">{{ strtoupper(str_replace('-', ' ', $orientation)) }}</span>
                        </div>
                    </label>
                </div>
            @endforeach
        </div>
        @error('orientations') <div class="text-danger small mt-2">{{ $message }}</div> @enderror
    </div>
</div>
@push('css')
<style>
/* Container Grid */
.orientation-grid { padding: 10px; }

/* Hidden Checkbox Logic */
.orientation-selector input[type="checkbox"]:checked + .tile-box {
    border: 2px solid #28a745 !important;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
}

.orientation-selector input[type="checkbox"]:checked + .tile-box .tile-check-icon {
    display: block;
}

/* Base Tile Styling */
.tile-box {
    position: relative;
    padding: 20px 10px;
    border-radius: 8px;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f6f9;
}

.tile-label {
    font-weight: 800;
    font-size: 0.75rem;
    color: #fff;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

.tile-check-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #28a745;
    background: #fff;
    border-radius: 50%;
    display: none;
    font-size: 1.2rem;
}

/* Color Mapping from your Diagrams */
.header-tile { background-color: #e85597 !important; } /* Pink */
.home-tile { background-color: #f1bc6a !important; }   /* Orange/Mustard */
.search-tile { background-color: #a55eea !important; } /* Purple */
.sidebar-tile { background-color: #4b7bec !important; }/* Blue */
.footer-tile { background-color: #4ecdc4 !important; } /* Cyan/Teal */
.general-tile { background-color: #778ca3 !important; }/* Grey */

.tile-box:hover { opacity: 0.9; }
</style>
@endpush

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // 1. Live Radius Display Update
        const radiusInput = document.getElementById('radius');
        const radiusDisplay = document.getElementById('radius-display');
        
        if (radiusInput && radiusDisplay) {
            radiusInput.addEventListener('input', function() {
                radiusDisplay.textContent = this.value + ' KM';
            });
        }

        // 2. Handle Status Toggle Text & Value
        const statusSwitch = document.getElementById('statusSwitch');
        const statusText = document.querySelector('.toggle-status');
        
        if (statusSwitch) {
            statusSwitch.addEventListener('change', function () {
                // Update the hidden value for the form submission
                this.value = this.checked ? '1' : '0';
                
                // Update the UI text label if it exists
                if (statusText) {
                    statusText.textContent = this.checked ? 'Active' : 'Inactive';
                }
            });
        }
    });
</script>
@endpush
