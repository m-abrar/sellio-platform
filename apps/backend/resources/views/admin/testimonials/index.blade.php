@extends('adminlte::page')

@section('title', __('Testimonials'))

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-comment-dots mr-2 text-primary opacity-50"></i> {{ __('Testimonials') }}
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                {{ __('Curated social proof with theme-specific placement priority.') }}
            </p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.testimonials.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD TESTIMONIAL') }}
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="card card-premium shadow-premium border-0 rounded-24 mb-4">
        <div class="card-body">
            <form method="GET" action="{{ route('admin.testimonials.index') }}" class="row align-items-end">
                <div class="col-md-3">
                    <label class="small font-weight-bold text-muted uppercase">{{ __('Status') }}</label>
                    <select name="status" class="form-control">
                        <option value="">{{ __('All statuses') }}</option>
                        @foreach([\App\Models\Testimonial::STATUS_DRAFT, \App\Models\Testimonial::STATUS_PUBLISHED, \App\Models\Testimonial::STATUS_ARCHIVED] as $status)
                            <option value="{{ $status }}" @selected(request('status') === $status)>{{ Str::headline($status) }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="small font-weight-bold text-muted uppercase">{{ __('Theme') }}</label>
                    <select name="theme_id" class="form-control">
                        <option value="">{{ __('All theme scopes') }}</option>
                        <option value="global" @selected(request('theme_id') === 'global')>{{ __('Global only') }}</option>
                        @foreach($themes as $theme)
                            <option value="{{ $theme->id }}" @selected((string) request('theme_id') === (string) $theme->id)>
                                {{ $theme->title }} ({{ $theme->theme_key }})
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="small font-weight-bold text-muted uppercase">{{ __('Featured') }}</label>
                    <select name="featured" class="form-control">
                        <option value="">{{ __('Any') }}</option>
                        <option value="1" @selected(request('featured') === '1')>{{ __('Featured on a theme') }}</option>
                        <option value="0" @selected(request('featured') === '0')>{{ __('Not featured') }}</option>
                    </select>
                </div>
                <div class="col-md-2 text-right">
                    <button class="btn btn-dark rounded-pill px-4 font-weight-bold" type="submit">
                        <i class="fas fa-filter mr-1"></i> {{ __('Filter') }}
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-database mr-2 text-primary opacity-50"></i> {{ __('Testimonial Registry') }}
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                {{ $testimonials->total() }} {{ __('RECORDS') }}
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4">{{ __('Author') }}</th>
                            <th>{{ __('Quote') }}</th>
                            <th>{{ __('Theme Scope') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($testimonials as $testimonial)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        <div class="mr-3 bg-light border rounded-circle overflow-hidden shadow-xs" style="width:48px;height:48px;">
                                            @if($testimonial->avatar_url)
                                                <img src="{{ $testimonial->avatar_url }}" alt="{{ $testimonial->author_name }}" class="w-100 h-100 object-fit-cover">
                                            @else
                                                <div class="w-100 h-100 d-flex align-items-center justify-content-center text-primary font-weight-bold">
                                                    {{ Str::upper(Str::substr($testimonial->author_name, 0, 1)) }}
                                                </div>
                                            @endif
                                        </div>
                                        <div>
                                            <strong class="d-block text-dark">{{ $testimonial->author_name }}</strong>
                                            <small class="text-muted">{{ $testimonial->author_title ?: __('No title') }}{{ $testimonial->company ? ' · ' . $testimonial->company : '' }}</small>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle text-muted">{{ Str::limit($testimonial->quote, 90) }}</td>
                                <td class="align-middle">
                                    @if($testimonial->themes->isEmpty())
                                        <span class="badge badge-secondary-light text-secondary px-2 py-1 rounded-pill">{{ __('Global') }}</span>
                                    @else
                                        @foreach($testimonial->themes as $theme)
                                            <span class="badge badge-primary-light text-primary px-2 py-1 mb-1 rounded-pill">
                                                {{ $theme->theme_key }} · #{{ $theme->pivot->priority }}
                                                @if($theme->pivot->is_featured) · {{ __('Featured') }} @endif
                                            </span>
                                        @endforeach
                                    @endif
                                </td>
                                <td class="text-center align-middle">
                                    @php
                                        $colors = ['draft' => 'secondary', 'published' => 'success', 'archived' => 'dark'];
                                    @endphp
                                    <span class="badge badge-{{ $colors[$testimonial->status] ?? 'secondary' }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                                        {{ Str::headline($testimonial->status) }}
                                    </span>
                                </td>
                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.testimonials.edit', $testimonial) }}" class="btn btn-white text-info py-2 px-3 border-right" title="{{ __('Edit') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.testimonials.destroy', $testimonial) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white text-danger py-2 px-3" title="{{ __('Archive') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 5,
                                'icon' => 'fas fa-comment-dots',
                                'title' => __('No Testimonials Found'),
                                'description' => __('Create curated social proof for your storefront themes.'),
                                'button_text' => __('ADD FIRST TESTIMONIAL'),
                                'button_link' => route('admin.testimonials.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
        @if($testimonials->hasPages())
            <div class="card-footer bg-white border-0">
                {{ $testimonials->links() }}
            </div>
        @endif
    </div>
</div>
@endsection
