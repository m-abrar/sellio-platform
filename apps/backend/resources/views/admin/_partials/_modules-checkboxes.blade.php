@php
    $moduleMap = [
        'is_property'   => 'properties',
        'is_event'      => 'events',
        'is_job'        => 'jobs',
        'is_auto'       => 'autos',
        'is_service'    => 'services',
        'is_classified' => 'classifieds',
        'is_product'    => 'products',
    ];
@endphp

@foreach($modules as $column => $meta)
    @php
        $moduleKey = $moduleMap[$column] ?? null;
        if ($moduleKey && !module_enabled($moduleKey)) {
            continue;
        }
    @endphp
<div class="col-md-4 mb-3">
    <label class="w-100 cursor-pointer mb-0">
        <input type="hidden" name="{{ $column }}" value="0">
        <input type="checkbox" name="{{ $column }}" value="1" id="check_{{ $column }}" class="d-none toggle-input" 
               {{ old($column, $model->exists && $model->$column ? true : false) ? 'checked' : '' }}>
        <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
            <div>
                <div class="font-weight-bold text-dark small">
                    <i class="{{ $meta['icon'] }} mr-1 text-muted"></i> {{ $meta['label'] }}
                </div>
                    {{ old($column, $model->exists && $model->$column ? true : false) ? 'Enabled' : 'Disabled' }}
            </div>
            <div class="toggle-indicator"></div>
        </div>
    </label>
</div>
@endforeach
