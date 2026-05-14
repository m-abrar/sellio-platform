@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'modules']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0 overflow-hidden">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-cubes mr-2 text-primary opacity-50"></i> {{ __('Module Control Center') }}
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
                                    <div class="icon-box icon-box-42 bg-white shadow-sm d-flex align-items-center justify-content-center border-light-soft">
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
                                
                                <h6 class="font-weight-bold mb-1 text-dark">{{ __(ucfirst($section)) }}</h6>
                                <p class="text-muted small mb-0">{{ __($data['desc']) }}</p>
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
