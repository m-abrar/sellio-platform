{{--
    Administrative Navigation Component: Recursive Node Renderer
    
    This partial facilitates the recursive rendering of hierarchical 
    navigation nodes for the Nestable2 editor. It orchestrates the 
    visual display of drag-handles, metadata labels (title/URL), and 
    operational node actions (edit/delete) across nested menu levels.
    
    @context Navigation Management
    @variables Collection $items Collection of MenuItem instances for the current level.
    @variables integer $level The current recursion depth.
--}}
@foreach ($items as $item)
    {{-- Nestable item structure --}}
    <li class="dd-item" 
        data-id="{{ $item->id }}" 
        data-title="{{ $item->title }}" 
        data-url="{{ $item->url }}"
        data-module="{{ $item->module }}">
        
        {{-- Handle for dragging --}}
        <div class="dd-handle">
            <i class="fas fa-arrows-alt mr-2 text-muted"></i>
            <span class="item-title font-weight-bold">{{ $item->title }}</span> 
            <span class="item-url ml-2 text-muted small">({{ $item->url }})</span>
            @if($item->module)
                <span class="item-module ml-2 badge badge-primary-light text-primary smallest text-uppercase">{{ $item->module }}</span>
            @else
                <span class="item-module ml-2 badge badge-light text-muted smallest text-uppercase">{{ __('Always visible') }}</span>
            @endif
        </div>
        
        {{-- Actions must be placed outside the dd-handle --}}
        <div class="dd-actions">
            {{-- Edit Button (Triggers Modal via JS) --}}
            <button type="button" class="btn btn-info btn-xs edit-item-btn" 
                    title="{{ __('Edit Item Details') }}">
                <i class="fas fa-pen"></i>
            </button>
            
            {{-- Delete Item Button (Handled by JS to submit the global delete form) --}}
            <button type="button" class="btn btn-danger btn-xs" 
                    title="{{ __('Delete Item') }}" 
                    data-id="{{ $item->id }}" 
                    data-action="delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        
        {{-- Recursively render children in a Nestable list (<ol>) --}}
        @if ($item->children->isNotEmpty())
            <ol class="dd-list">
                @include('admin.menu._recursive', ['items' => $item->children, 'level' => $level + 1])
            </ol>
        @endif
    </li>
@endforeach
