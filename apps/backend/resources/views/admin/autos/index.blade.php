{{--
    Administrative Automotive: Global Inventory Registry
    
    This view provides the authoritative Dashboard for the automotive 
    marketplace. It aggregates technical identities, specification summaries, 
    and financial parameters (sale/lease) for all vehicle assets. It 
    facilitates high-fidelity lifecycle tracking and inventory oversight 
    through a responsive, data-rich interface.
    
    @extends adminlte::page
    @context Automotive Inventory Management
    @variables Paginator $autos Paginated collection of Auto model instances.
--}}
@extends('adminlte::page')

@section('title', __('Autos'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> {{ __('Auto Listings') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage vehicle listings, specifications, and dealer information.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.autos.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Auto') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.autos._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Auto Inventory') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $autos->total() }} {{ __('ASSETS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="autos-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "searching": false, "ordering": true, "info": false}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">{{ __('Media') }}</th>
                            <th>{{ __('Vehicle Identity') }}</th>
                            <th>{{ __('Specifications') }}</th>
                            <th>{{ __('Financials') }}</th>
                            <th>{{ __('Lifecycle') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($autos as $auto)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $auto->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $auto->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID') }}: #{{ str_pad($auto->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-user-tie mr-1 opacity-50"></i> {{ $auto->user->name ?? __('Admin') }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ $auto->brand->name ?? __('Unknown') }}</div>
                                    <small class="text-muted smallest uppercase letter-spacing-1">
                                        {{ __('Model') }}: {{ $auto->model ?? __('N/A') }} | {{ __('Year') }}: {{ $auto->year ?? __('N/A') }}
                                    </small>
                                </td>

                                <td class="align-middle">
                                    @if($auto->is_lease)
                                        <div class="font-weight-bold text-warning smallest uppercase letter-spacing-1">{{ __('Lease / Rental') }}</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }} <small class="text-muted">/ {{ __('mo') }}</small></div>
                                    @else
                                        <div class="font-weight-bold text-success smallest uppercase letter-spacing-1">{{ __('Direct Sale') }}</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @php $status = $auto->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1">
                                        <i class="fas fa-tachometer-alt mr-1 text-primary opacity-50"></i>{{ $auto->mileage_value ?? 0 }} {{ $auto->mileage_units ?? __('km') }}
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.autos.edit', $auto->id) }}" class="btn text-primary" data-toggle="tooltip" title="{{ __('Modify Asset') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Asset') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Asset?') }}"
                                                    data-confirm-text="{{ __('Permanently delete this auto listing?') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-car',
                                'title' => __('No automotive assets detected.'),
                                'description' => __('Synchronize your inventory or initialize new vehicle entries to populate this registry.'),
                                'button_text' => __('INITIALIZE AUTO'),
                                'button_link' => route('admin.autos.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($autos->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $autos->firstItem() }} - {{ $autos->lastItem() }} {{ __('of') }} {{ $autos->total() }} {{ __('records') }}</div>
                <div>{{ $autos->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
