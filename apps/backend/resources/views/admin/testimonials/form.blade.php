@extends('adminlte::page')

@section('title', ($testimonial->exists ? __('Edit') : __('Add')) . ' ' . __('Testimonial'))

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-comment-dots mr-2 text-primary"></i>
                {{ $testimonial->exists ? __('Edit Testimonial') : __('Create Testimonial') }}
            </h1>
            <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                {{ __('Curate social proof and prioritize it for storefront themes.') }}
            </p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.testimonials.index') }}" class="btn btn-back shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Testimonials') }}
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $testimonial->exists ? route('admin.testimonials.update', $testimonial) : route('admin.testimonials.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @if($testimonial->exists) @method('PATCH') @endif

        <div class="row">
            <div class="col-md-8">
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Testimonial Content') }}</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label class="small font-weight-bold text-muted uppercase">{{ __('Author Name') }} <span class="text-danger">*</span></label>
                                <input type="text" name="author_name" class="form-control form-control-hero @error('author_name') is-invalid @enderror" value="{{ old('author_name', $testimonial->author_name) }}" required>
                                @error('author_name') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                            </div>
                            <div class="col-md-6 form-group">
                                <label class="small font-weight-bold text-muted uppercase">{{ __('Author Title / Role') }}</label>
                                <input type="text" name="author_title" class="form-control form-control-premium" value="{{ old('author_title', $testimonial->author_title) }}">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 form-group">
                                <label class="small font-weight-bold text-muted uppercase">{{ __('Company') }}</label>
                                <input type="text" name="company" class="form-control form-control-premium" value="{{ old('company', $testimonial->company) }}">
                            </div>
                            <div class="col-md-3 form-group">
                                <label class="small font-weight-bold text-muted uppercase">{{ __('Rating') }}</label>
                                <input type="number" name="rating" min="1" max="5" class="form-control form-control-premium" value="{{ old('rating', $testimonial->rating) }}">
                            </div>
                            <div class="col-md-3 form-group">
                                <label class="small font-weight-bold text-muted uppercase">{{ __('Global Sort') }}</label>
                                <input type="number" name="sort_order" min="0" class="form-control form-control-premium" value="{{ old('sort_order', $testimonial->sort_order ?? 0) }}">
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase">{{ __('Quote') }} <span class="text-danger">*</span></label>
                            <textarea name="quote" rows="6" class="form-control textarea-premium @error('quote') is-invalid @enderror" required>{{ old('quote', $testimonial->quote) }}</textarea>
                            @error('quote') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">{{ __('Theme Priority') }}</h3>
                        <p class="text-muted small mb-0">{{ __('Leave all themes unchecked to make this testimonial global.') }}</p>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="px-4">{{ __('Theme') }}</th>
                                        <th class="text-center">{{ __('Enabled') }}</th>
                                        <th>{{ __('Priority') }}</th>
                                        <th class="text-center">{{ __('Featured') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($themes as $theme)
                                        @php
                                            $assignment = $assignedThemes->get($theme->id);
                                            $oldEnabled = old("themes.{$theme->id}.enabled", $assignment ? 1 : 0);
                                            $oldPriority = old("themes.{$theme->id}.priority", $assignment?->pivot?->priority ?? 0);
                                            $oldFeatured = old("themes.{$theme->id}.is_featured", $assignment?->pivot?->is_featured ?? 0);
                                        @endphp
                                        <tr>
                                            <td class="align-middle px-4">
                                                <strong>{{ $theme->title }}</strong>
                                                <small class="d-block text-muted">{{ $theme->theme_key }}</small>
                                            </td>
                                            <td class="text-center align-middle">
                                                <input type="checkbox" name="themes[{{ $theme->id }}][enabled]" value="1" @checked((bool) $oldEnabled)>
                                            </td>
                                            <td class="align-middle" style="width:160px;">
                                                <input type="number" min="0" name="themes[{{ $theme->id }}][priority]" class="form-control form-control-sm" value="{{ $oldPriority }}">
                                            </td>
                                            <td class="text-center align-middle">
                                                <input type="checkbox" name="themes[{{ $theme->id }}][is_featured]" value="1" @checked((bool) $oldFeatured)>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $testimonial,
                    'title' => __('TESTIMONIAL'),
                    'back' => 'admin.testimonials.index'
                ])

                <div class="card border-0 shadow-premium mt-4 mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">{{ __('Publishing') }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <label class="small font-weight-bold text-muted uppercase">{{ __('Status') }}</label>
                        <select name="status" class="form-control form-control-premium">
                            @foreach([\App\Models\Testimonial::STATUS_DRAFT, \App\Models\Testimonial::STATUS_PUBLISHED, \App\Models\Testimonial::STATUS_ARCHIVED] as $status)
                                <option value="{{ $status }}" @selected(old('status', $testimonial->status ?? \App\Models\Testimonial::STATUS_DRAFT) === $status)>
                                    {{ Str::headline($status) }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <div class="card border-0 shadow-premium mt-4 mb-4 rounded-xl overflow-hidden">
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
                        @else
                            <div class="p-4 text-muted small">
                                {{ __('Save the testimonial first, then upload an avatar from the edit screen.') }}
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
