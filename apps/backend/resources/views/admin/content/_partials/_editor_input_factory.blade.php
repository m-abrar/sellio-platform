{{--
    Administrative Content Partial: Input Orchestration Factory
    
    This component serves as a polymorphic input generator for the 
    content management system. It dynamically resolves input types 
    (textarea, image, color, text) based on the configuration manifest, 
    ensuring a unified interaction protocol across diverse page content 
    parameters.
    
    @context Content Management Module
    @variables PageContent $item The content item model defining the input parameters.
--}}
@switch($item->input_type)
    @case('textarea')
        <textarea 
            name="values[{{ $item->id }}]" 
            id="setting-{{ $item->id }}"
            class="form-control form-control-premium border-light"
            rows="3" 
            placeholder="Enter content..."
        >{{ old('values.'.$item->id, $item->value) }}</textarea>
        @break

    @case('logo')
    @case('file')
    @case('image')
        <div class="bg-light-soft p-2 rounded-xl border border-dashed border-light">
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\PageContent::PRIMARY_MEDIA,
                'label' => 'Upload Asset',
                'multiple' => false,
                'model' => \App\Models\PageContent::class,
                'id' => $item->id ?? null,
                'noCard' => true
            ])
        </div>
        @break

    @case('color')
        <div class="d-flex align-items-center bg-light p-2 rounded-pill px-3" style="width: fit-content;">
            <input type="color" name="values[{{ $item->id }}]" value="{{ old('values.'.$item->id, $item->value) }}" class="form-control form-control-color border-0 p-0 mr-3" style="width: 32px; height: 32px; border-radius: 50%;">
            <code class="text-primary font-weight-bold smallest">{{ old('values.'.$item->id, $item->value) }}</code>
        </div>
        @break

    @default 
        <input 
            type="{{ $item->input_type }}" 
            name="values[{{ $item->id }}]" 
            value="{{ old('values.'.$item->id, $item->value) }}"
            id="setting-{{ $item->id }}"
            class="form-control form-control-premium border-light"
            placeholder="Enter value..."
        >
@endswitch
