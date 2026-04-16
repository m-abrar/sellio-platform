{{-- Partial: _editor_input_factory.blade.php --}}
@switch($item->input_type)
    @case('textarea')
        <textarea 
            name="values[{{ $item->id }}]" 
            id="setting-{{ $item->id }}"
            class="form-control border-light-gray"
            rows="3" 
            placeholder="Enter content..."
        >{{ old('values.'.$item->id, $item->value) }}</textarea>
        @break

    @case('logo')
    @case('file')
    @case('image')
        <div class="bg-light p-3 rounded border border-dashed">
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\PageContent::PRIMARY_MEDIA,
                'label' => 'Upload Asset',
                'multiple' => false,
                'model' => \App\Models\PageContent::class,
                'id' => $item->id ?? null,
            ])
        </div>
        @break

    @case('color')
        <div class="d-flex align-items-center">
            <input type="color" name="values[{{ $item->id }}]" value="{{ old('values.'.$item->id, $item->value) }}" class="form-control form-control-color mr-3 border-0">
            <code class="text-muted">{{ old('values.'.$item->id, $item->value) }}</code>
        </div>
        @break

    @default 
        <input 
            type="{{ $item->input_type }}" 
            name="values[{{ $item->id }}]" 
            value="{{ old('values.'.$item->id, $item->value) }}"
            id="setting-{{ $item->id }}"
            class="form-control border-light-gray"
            placeholder="Enter value..."
        >
@endswitch
