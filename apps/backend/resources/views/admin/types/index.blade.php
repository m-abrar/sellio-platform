{{--
    Administrative Taxonomy: Listing Type Registry
    
    This view provides the authoritative command center for managing high-level 
    listing classifications. It aggregates type identities, module 
    utilization, and publication status, facilitating efficient auditing 
    and moderation of the platform's specialized classification taxonomy.
    
    @extends adminlte::page
    @context Taxonomy Management
    @variables Collection $types Collection of Type model instances.
--}}
@extends('adminlte::page')

@section('title', __('Listing Types'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-md-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-layer-group mr-2 text-primary"></i> {{ __('Listing Types') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Define classification groupings for specialized listing formats.') }}
                </p>
            </div>
            <div class="col-md-4 text-right">
                <a href="{{ route('admin.types.create') }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                    <i class="fas fa-plus-circle mr-2"></i> {{ __('Add Type') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="card border-0 shadow-premium overflow-hidden rounded-24 datatable-premium-layout">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">{{ __('Listing Type Registry') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-3">
                    <i class="fas fa-layer-group mr-1"></i> {{ count($types) }} {{ __('TYPES FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body p-0">
            <div class="table-responsive">
                {{-- Refined: Applied table-premium for the brand-border hover effect --}}
                <table id="types-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": true, "lengthChange": true, "searching": true, "ordering": true, "info": true, "columnDefs": [{"orderable": false, "targets": [0, 2, 4]}]}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center col-media-80">{{ __('Icon') }}</th>
                            <th>{{ __('Name / Identity') }}</th>
                            <th>{{ __('Module Utilization') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($types as $type)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <i class="{{ $type->icon ?? 'fas fa-layer-group' }} text-primary"></i>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 smallest uppercase letter-spacing-1">{{ $type->title ?? __('N/A') }}</span>
                                    <small class="text-muted text-monospace smallest-0-7">{{ __('UID') }}: #TYP-{{ $type->id }}</small>
                                </td>

                                <td class="align-middle">
                                    @include('admin._partials._taxonomy-spectrum', ['model' => $type])
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $type->is_published ? 'badge-success-light text-success' : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                        {{ $type->is_published ? __('Active') : __('Draft') }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.types.edit', $type->id) }}" class="btn text-info" data-toggle="tooltip" title="Modify Details"><i class="fas fa-edit"></i></a>
                                        <form id="delete-type-{{ $type->id }}" action="{{ route('admin.types.destroy', $type->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                             <button type="button" class="btn text-danger" 
                                                     data-toggle="tooltip" title="{{ __('Remove Type') }}"
                                                     data-action="delete-trigger"
                                                     data-confirm-title="{{ __('Remove Type?') }}"
                                                     data-confirm-text="{{ __('Are you sure you want to delete this listing type?') }}">
                                                 <i class="fas fa-trash-alt"></i>
                                             </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 5,
                            'icon' => 'fas fa-layer-group',
                            'title' => __('No Types Found'),
                            'description' => request('search') 
                                ? __('No results matching ":search"', ['search' => request('search')]) 
                                : __('Organize your ecosystem by creating your first listing type.'),
                            'button_text' => request('search') ? __('Clear Search') : __('Create First Type'),
                            'button_link' => request('search') ? route('admin.types.index') : route('admin.types.create')
                        ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        
        @include('admin._partials._sweetalert')
    </div>
</div>
@endsection

@push('css')
    @include('admin._partials._toggle-card-css')
@endpush


@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
