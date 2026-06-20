{{--
    Administrative Classifieds: Global Asset Registry
    
    This view provides the authoritative Dashboard for the 
    community marketplace. It aggregates item identities, engagement 
    metrics, financial valuations, and lifecycle tracking for all 
    marketplace assets. It facilitates efficient catalog oversight 
    through a responsive data architecture and multi-dimensional filtering.
    
    @extends adminlte::page
    @context Classified Module Management
    @variables Paginator $classifieds Paginated collection of Classified model instances.
--}}
@extends('adminlte::page')

@section('title', __('Classified Ads'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> {{ __('Classified Ads') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage general classified advertisements and community listings.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classifieds.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD AD') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.classifieds._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Classified Inventory') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $classifieds->total() }} {{ __('ASSETS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="classifieds-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "searching": true, "columnDefs": [{"orderable": false, "targets": [0, 5]}]}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">{{ __('Media') }}</th>
                            <th>{{ __('Item Identity') }}</th>
                            <th>{{ __('Engagement') }}</th>
                            <th>{{ __('Financials') }}</th>
                            <th>{{ __('Lifecycle') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($classifieds as $ad)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $ad->thumbnail_url ?? asset('images/placeholder.png') }}" data-fallback="{{ asset('images/fallbacks/default.jpg') }}">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $ad->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID') }}: #{{ str_pad($ad->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-folder mr-1 opacity-50"></i> {{ $ad->category->title ?? __('General') }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        <span class="badge badge-secondary-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ $ad->condition_label ?? __('Used') }}</span>
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>{{ $ad->city ?? __('Remote') }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-success h6 mb-0">{{ $ad->price_formatted ?? '$0.00' }}</div>
                                    @if($ad->is_sale && $ad->is_for_rent) <small class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Sale & Rent') }}</small> @endif
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $ad->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.classifieds.edit', $ad->id) }}" class="btn text-primary" data-toggle="tooltip" title="{{ __('Modify Ad') }}"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.classifieds.duplicate', $ad->id) }}" class="btn text-success" data-toggle="tooltip" title="{{ __('Clone Entry') }}"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.classifieds.destroy', $ad->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger"
                                                    data-toggle="tooltip" title="{{ __('Purge Ad') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Ad?') }}"
                                                    data-confirm-text="{{ __('Permanently delete this classified listing?') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-tags',
                                'title' => __('No ads detected in registry.'),
                                'description' => __('Synchronize your marketplace board or initialize new ad entries to populate this registry.'),
                                'button_text' => __('INITIALIZE AD'),
                                'button_link' => route('admin.classifieds.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($classifieds->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $classifieds->firstItem() }} - {{ $classifieds->lastItem() }} {{ __('of') }} {{ $classifieds->total() }} {{ __('records') }}</div>
                <div>{{ $classifieds->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endpush

@section('css')
@include('admin._partials._toggle-card-css')
@endsection
