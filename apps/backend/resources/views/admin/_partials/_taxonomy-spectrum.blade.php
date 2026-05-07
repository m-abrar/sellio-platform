{{--
    Polymorphic Module Association Spectrum
    
    This partial renders a series of decorative badges indicating which 
    marketplace verticals (Property, Auto, Job, etc.) a specific taxonomy 
    item is associated with.
    
    @param Model $model The Eloquent model instance (Category, Location, Tag).
--}}
@php
    $modules = [
        'is_property'   => ['title' => 'Property',   'icon' => 'fas fa-home',          'color' => 'badge-indigo-light'],
        'is_event'      => ['title' => 'Event',      'icon' => 'fas fa-calendar-alt',  'color' => 'badge-olive-light'],
        'is_job'        => ['title' => 'Job',        'icon' => 'fas fa-briefcase',     'color' => 'badge-navy-light'],
        'is_auto'       => ['title' => 'Auto',       'icon' => 'fas fa-car',           'color' => 'badge-lightblue-light'],
        'is_service'    => ['title' => 'Service',    'icon' => 'fas fa-tools',         'color' => 'badge-maroon-light'],
        'is_classified' => ['title' => 'Classified', 'icon' => 'fas fa-tag',           'color' => 'badge-orange-light'],
        'is_product'    => ['title' => 'Product',    'icon' => 'fas fa-shopping-bag',  'color' => 'badge-primary-light'],
    ];
    $hasModule = false;
@endphp

<div class="d-flex flex-wrap gap-4-p">
    @foreach($modules as $column => $data)
        @if($model->$column)
            @php $hasModule = true; @endphp
            <span class="badge {{ $data['color'] }} px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0" 
                  data-toggle="tooltip" title="{{ $data['title'] }} Module">
                <i class="{{ $data['icon'] }} mr-1"></i> {{ $data['title'] }}
            </span>
        @endif
    @endforeach

    @if(!$hasModule)
        <span class="badge badge-secondary-light px-2 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 border-0">
            <i class="fas fa-globe mr-1"></i> Global Access
        </span>
    @endif
</div>
