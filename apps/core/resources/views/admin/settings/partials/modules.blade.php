@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'modules']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0 overflow-hidden">
        <div class="card-header bg-white py-3">
            <h3 class="card-title font-weight-bold text-dark">
                <i class="fas fa-cubes mr-2 text-primary"></i>{{ __('Module Control Center') }}
            </h3>
        </div>
        
        <div class="card-body bg-light-gray">
            <div class="row">
                @php
                    $moduleData = [
                        'products'    => ['icon' => 'fas fa-shopping-bag', 'color' => 'text-success', 'desc' => 'E-Commerce & Orders'],
                        'properties'  => ['icon' => 'fas fa-home', 'color' => 'text-primary', 'desc' => 'Real Estate & Listings'],
                        'autos'       => ['icon' => 'fas fa-car', 'color' => 'text-orange', 'desc' => 'Vehicles & Automotive'],
                        'events'      => ['icon' => 'fas fa-calendar-alt', 'color' => 'text-indigo', 'desc' => 'Gatherings & Tickets'],
                        'jobs'        => ['icon' => 'fas fa-briefcase', 'color' => 'text-teal', 'desc' => 'Hiring & Applications'],
                        'services'    => ['icon' => 'fas fa-tools', 'color' => 'text-info', 'desc' => 'Professional Services'],
                        'classifieds' => ['icon' => 'fas fa-tags', 'color' => 'text-muted', 'desc' => 'General Marketplace'],
                    ];
                @endphp

                @foreach($moduleData as $section => $data)
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 border-0 shadow-xs hover-shadow-sm transition-all module-card">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center justify-content-between mb-3">
                                    <div class="icon-box rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center" style="width: 42px; height: 42px; border: 1px solid #f1f3f5;">
                                        <i class="{{ $data['icon'] }} {{ $data['color'] }}"></i>
                                    </div>
                                    
                                    {{-- Custom Styled Switch --}}
                                    <div class="custom-control custom-switch custom-switch-premium">
                                        <input type="hidden" name="is_section[{{ $section }}]" value="0"> 
                                        <input type="checkbox" 
                                            name="is_section[{{ $section }}]" 
                                            value="1"
                                            class="custom-control-input"
                                            id="enabled_{{ $section }}"
                                            {{ old("is_section.$section", $settings["is_section.".$section] ?? 0) ? 'checked' : '' }}>
                                        <label class="custom-control-label cursor-pointer" for="enabled_{{ $section }}"></label>
                                    </div>
                                </div>
                                
                                <h6 class="font-weight-bold mb-1 text-dark">{{ ucfirst($section) }}</h6>
                                <p class="text-muted small mb-0">{{ $data['desc'] }}</p>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        <div class="card-footer bg-white border-top-0 text-right">
            <button type="submit" class="btn btn-primary px-5 shadow-sm font-weight-bold rounded-pill">
                {{ __('Save Module Configuration') }}
            </button>
        </div>
    </div>
</form>
@endsection

@push('css')
<style>
    /* Premium Switch - Gray Family for OFF / Emerald for ON */
    .custom-switch-premium .custom-control-input ~ .custom-control-label::before {
        background-color: #e2e8f0; /* Gray 200 */
        border: none;
        transition: all 0.25s ease;
    }

    /* OFF State (Gray Family) */
    .custom-switch-premium .custom-control-input:not(:checked) ~ .custom-control-label::before {
        background-color: #cbd5e1 !important; /* Slate 300 */
        opacity: 0.8;
    }

    .custom-switch-premium .custom-control-input:not(:checked) ~ .custom-control-label::after {
        background-color: #94a3b8 !important; /* Slate 400 knob */
    }

    /* ON State (Emerald Family) */
    .custom-switch-premium .custom-control-input:checked ~ .custom-control-label::before {
        background-color: #10b981 !important; /* Emerald 500 */
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    }

    .custom-switch-premium .custom-control-input:checked ~ .custom-control-label::after {
        background-color: #ffffff !important; /* Pure white knob */
    }

    /* Icon Colors */
    .text-indigo { color: #6610f2; }
    .text-teal { color: #20c997; }
    .text-orange { color: #fd7e14; }

    /* Card Styling */
    .bg-light-gray { background-color: #f8fafc; }
    .module-card { border-radius: 12px; border: 1px solid #f1f5f9; }
    .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,.03); }
    .transition-all { transition: all 0.25s ease-in-out; }
    .hover-shadow-sm:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07); }
</style>
@endpush
