@extends('adminlte::page')

@section('title', __('Listing Analytics'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row align-items-center mb-4">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-chart-line mr-2 text-primary"></i> {{ __('Listing Analytics') }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ __('Dedicated reporting workspace for this marketplace asset.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.listings.edit', ['listing_type' => $listing_type, 'listing_id' => $listing_id]) }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Edit') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <div class="row">
        <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-premium rounded-xl overflow-hidden h-100">
                <div class="card-body p-4">
                    <div class="d-flex align-items-center mb-4">
                        <div class="table-img-preview shadow-sm mr-3">
                            <img src="{{ $listing->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                        </div>
                        <div class="min-width-0">
                            <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __(class_basename($listing)) }}</div>
                            <h4 class="font-weight-bold text-dark mb-1 text-truncate">{{ $listing->title ?? __('Untitled Asset') }}</h4>
                            <div class="smallest text-muted text-monospace">{{ __('ID:') }} #{{ str_pad($listing->id, 5, '0', STR_PAD_LEFT) }}</div>
                        </div>
                    </div>

                    @if($listing->user)
                        <div class="d-flex align-items-center p-3 bg-light rounded-xl">
                            <div class="rounded-circle overflow-hidden shadow-xs border bg-white mr-3" style="width: 46px; height: 46px;">
                                <img src="{{ $listing->user->avatar_url }}" alt="{{ $listing->user->name }}" class="w-100 h-100" style="object-fit: cover;">
                            </div>
                            <div>
                                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Proprietor') }}</div>
                                <div class="font-weight-bold text-dark">{{ $listing->user->name }}</div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-lg-8 mb-4">
            <div class="row">
                @foreach($reportLinks as $link)
                    <div class="col-md-6 mb-4">
                        <a href="{{ $link['url'] }}" class="text-decoration-none">
                            <div class="card border-0 shadow-premium rounded-xl h-100 transition-all hover-shadow-sm">
                                <div class="card-body p-4 d-flex align-items-center">
                                    <div class="icon-box-soft lg bg-{{ $link['color'] }}-soft text-{{ $link['color'] }} shadow-xs mr-3">
                                        <i class="fas {{ $link['icon'] }}"></i>
                                    </div>
                                    <div>
                                        <h5 class="font-weight-bold text-dark mb-1">{{ $link['label'] }}</h5>
                                        <p class="small text-muted mb-0">{{ $link['description'] }}</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
@endsection
