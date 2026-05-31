{{--
    Administrative Form Action Sidebar
    
    This partial renders the primary control panel for administrative CRUD forms.
    It handles publishing toggles, state synchronization (Save/Update),
    record duplication, and deletion protocols.
    
    @param Model $model The Eloquent model instance being modified.
    @param string $title The display label for the record (e.g., 'PROPERTY').
    @param string $back (Optional) The route name for the cancel action.
    @param string $duplicate (Optional) The route name for cloning the record.
--}}
@php
    $isEdit = $model->exists;
    $label = $title ?? __('RECORD');
    $analyticsTypeMap = [
        \App\Models\Property::class => 'property',
        \App\Models\Auto::class => 'auto',
        \App\Models\Event::class => 'event',
        \App\Models\JobListing::class => 'joblisting',
        \App\Models\Service::class => 'service',
        \App\Models\Classified::class => 'classified',
        \App\Models\Product::class => 'product',
    ];
    $analyticsType = $analyticsTypeMap[get_class($model)] ?? null;
    $owner = null;

    if ($isEdit && method_exists($model, 'user')) {
        $owner = $model->relationLoaded('user') ? $model->user : $model->user()->first();
    }
@endphp

<div class="card card-sidebar-premium">
    <div class="card-header d-flex align-items-center border-0">
        <h3 class="card-title-side">
            <i class="fas fa-rocket mr-2 text-primary"></i> {{ __('Protocol & Actions') }}
        </h3>
    </div>
    
    <div class="card-body">
        @if($isEdit && method_exists($model, 'getStatusMeta'))
            @php $statusMeta = $model->getStatusMeta(); @endphp
            <div class="mb-4 text-center">
                <span class="badge badge-{{ $statusMeta['color'] }}-light px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs w-100">
                    <i class="fas fa-{{ $statusMeta['icon'] }} mr-1"></i> {{ $statusMeta['label'] }}
                </span>
            </div>
        @endif

        @if($owner)
            <div class="mb-4 pb-3 border-bottom">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle overflow-hidden shadow-xs border bg-white mr-3" style="width: 48px; height: 48px;">
                        <img src="{{ $owner->avatar_url }}" alt="{{ $owner->name }}" class="w-100 h-100" style="object-fit: cover;">
                    </div>
                    <div class="min-width-0">
                        <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Proprietor') }}</div>
                        <div class="font-weight-bold text-dark text-truncate">{{ $owner->name }}</div>
                        <div class="smallest text-muted text-monospace">{{ __('UID:') }} #{{ $owner->id }}</div>
                    </div>
                </div>
            </div>
        @endif

        {{-- Publishing Switch --}}
        <div class="mb-4 pb-2 border-bottom">
            <label class="w-100 cursor-pointer mb-0">
                <input type="hidden" name="is_published" value="0">
                <input type="checkbox" name="is_published" value="1" id="publishedSwitch" class="d-none toggle-input" {{ old('is_published', $model->is_published ?? true) ? 'checked' : '' }}>
                <div class="d-flex justify-content-between align-items-center toggle-card">
                    <div>
                        <div class="fw-bold small text-dark uppercase letter-spacing-1">{{ __('Publishing Status') }}</div>
                        <div class="small toggle-status text-muted">{{ ($isEdit && $model->is_published) ? __('Visible to public') : __('Draft Mode') }}</div>
                    </div>
                    <div class="toggle-indicator"></div>
                </div>
            </label>
        </div>

        <div class="action-buttons-group">
            <button type="submit" class="btn btn-submit-premium btn-block font-weight-bold py-3 small mb-3 uppercase letter-spacing-1">
                <i class="fas fa-save mr-2"></i> {{ $isEdit ? __('SYNCHRONIZE :label', ['label' => $label]) : __('INITIALIZE :label', ['label' => $label]) }}
            </button>

            <div class="d-flex gap-8">
                @if(isset($back))
                    <a href="{{ route($back) }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold small py-2 text-muted border uppercase letter-spacing-1">
                        <i class="fas fa-times mr-1"></i> {{ __('Cancel') }}
                    </a>
                @endif
                
                @if($isEdit)
                    @if(isset($duplicate))
                        <a href="{{ route($duplicate, $model->id) }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold small py-2 text-muted border uppercase letter-spacing-1">
                            <i class="fas fa-copy mr-1"></i> {{ __('Clone') }}
                        </a>
                    @endif
                    <button type="button" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold small py-2 text-danger border uppercase letter-spacing-1" 
                        data-action="delete-trigger" 
                        data-form-id="delete-form"
                        data-confirm-title="{{ __('Purge :label?', ['label' => $label]) }}"
                        data-confirm-text="{{ __('This will permanently remove the record from the platform registry.') }}">
                        <i class="fas fa-trash-alt mr-1"></i> {{ __('Purge') }}
                    </button>
                @endif
            </div>

            @if($isEdit && $analyticsType)
                <a href="{{ route('admin.listings.analytics', ['listing_type' => $analyticsType, 'listing_id' => $model->id]) }}" class="btn btn-light btn-block rounded-pill font-weight-bold small py-2 text-primary border uppercase letter-spacing-1 mt-3">
                    <i class="fas fa-chart-line mr-1"></i> {{ __('Analytics & Reports') }}
                </a>
            @endif
        </div>
    </div>

    @if($isEdit && isset($model->updated_at))
        <div class="card-footer bg-light border-top-0 text-center py-2">
            <small class="text-muted small uppercase letter-spacing-1">
                <i class="far fa-clock mr-1"></i> 
                {{ __('Last Sync') }}: {{ $model->updated_at->format('M d, H:i') }}
            </small>
        </div>
    @endif
</div>
