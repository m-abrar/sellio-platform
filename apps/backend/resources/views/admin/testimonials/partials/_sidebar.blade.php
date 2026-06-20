@php
    $isEdit = $testimonial->exists;
    $currentStatus = old('status', $testimonial->status ?? \App\Models\Testimonial::STATUS_DRAFT);
@endphp

<div class="card card-sidebar-premium">
    <div class="card-header d-flex align-items-center border-0">
        <h3 class="card-title-side">
            <i class="fas fa-rocket mr-2 text-primary"></i> {{ __('Actions') }}
        </h3>
    </div>

    <div class="card-body">
        @if($isEdit)
            @php $statusMeta = $testimonial->getStatusMeta(); @endphp
            <div class="mb-4 text-center">
                <span class="badge badge-{{ $statusMeta['color'] }}-light px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs w-100">
                    <i class="fas fa-{{ $statusMeta['icon'] }} mr-1"></i> {{ Str::headline($statusMeta['label']) }}
                </span>
            </div>
        @endif

        <div class="mb-4 pb-2 border-bottom">
            <label for="status" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1 d-block">{{ __('Publication Status') }}</label>
            <select name="status" id="status" class="form-control form-control-premium select2">
                @foreach([\App\Models\Testimonial::STATUS_DRAFT, \App\Models\Testimonial::STATUS_PUBLISHED, \App\Models\Testimonial::STATUS_ARCHIVED] as $status)
                    <option value="{{ $status }}" @selected($currentStatus === $status)>{{ Str::headline($status) }}</option>
                @endforeach
            </select>
            <small class="text-muted d-block mt-2">{{ __('Only published testimonials appear on the storefront API.') }}</small>
        </div>

        <div class="action-buttons-group">
            <button type="submit" class="btn btn-submit-premium btn-block font-weight-bold py-3 small mb-3 uppercase letter-spacing-1">
                <i class="fas fa-save mr-2"></i>
                {{ $isEdit ? __('SYNCHRONIZE TESTIMONIAL') : __('INITIALIZE TESTIMONIAL') }}
            </button>

            <div class="d-flex gap-8">
                <a href="{{ route('admin.testimonials.index') }}" class="btn btn-light flex-grow-1 rounded-pill font-weight-bold small py-2 text-muted border uppercase letter-spacing-1">
                    <i class="fas fa-times mr-1"></i> {{ __('Cancel') }}
                </a>

                @if($isEdit)
                    <button type="button"
                            class="btn btn-light flex-grow-1 rounded-pill font-weight-bold small py-2 text-danger border uppercase letter-spacing-1"
                            data-action="delete-trigger"
                            data-form-id="delete-form"
                            data-confirm-title="{{ __('Archive Testimonial?') }}"
                            data-confirm-text="{{ __('This testimonial will be removed from all storefront theme placements.') }}">
                        <i class="fas fa-trash-alt mr-1"></i> {{ __('Purge') }}
                    </button>
                @endif
            </div>
        </div>
    </div>

    @if($isEdit && isset($testimonial->updated_at))
        <div class="card-footer bg-light border-top-0 text-center py-2">
            <small class="text-muted small uppercase letter-spacing-1">
                <i class="far fa-clock mr-1"></i>
                {{ __('Last Sync') }}: {{ $testimonial->updated_at->format('M d, H:i') }}
            </small>
        </div>
    @endif
</div>

<div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
    <div class="card-header border-0 bg-white py-4 px-4">
        <h3 class="card-title-side">
            <i class="fas fa-user-circle mr-2 text-primary opacity-50"></i> {{ __('Avatar') }}
        </h3>
    </div>
    <div class="card-body p-0">
        @if($testimonial->exists)
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\Testimonial::AVATAR_MEDIA,
                'label' => __('Select Avatar'),
                'multiple' => false,
                'model' => 'testimonial',
                'id' => $testimonial->id,
                'noCard' => true,
            ])
            <div class="p-4 bg-light border-top">
                <p class="text-muted mb-0 small uppercase letter-spacing-1"><strong>{{ __('Recommended:') }}</strong> 160x160 px square portrait</p>
            </div>
        @else
            <div class="p-4">
                <div class="bg-light rounded-xl border border-light p-4 text-center">
                    <i class="fas fa-user-circle fa-2x text-primary opacity-50 mb-3 d-block"></i>
                    <p class="text-muted small mb-0">{{ __('Save the testimonial first, then upload an avatar from the edit screen.') }}</p>
                </div>
            </div>
        @endif
    </div>
</div>
