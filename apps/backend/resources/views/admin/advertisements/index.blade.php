{{--
    Administrative Marketing Module: Ad Campaign Registry
    
    This view serves as the primary orchestration layer for platform-wide 
    promotional assets. It facilitates the management of creative 
    inventories, placement targeting (json-mapped orientations), and 
    real-time campaign lifecycle monitoring (impression tracking prep).
    
    @extends adminlte::page
    @context Marketing Management
    @variables Collection $advertisements Collection of Advertisement model instances.
--}}
@extends('adminlte::page')

@section('title', __('Advertisements'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ad mr-2 text-primary opacity-50"></i> {{ __('Ad Campaigns') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Creative management and impression orchestration for marketplace promotions.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.advertisements.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD ADVERTISEMENT') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Ad Management Card --}}
    <div class="card card-premium shadow-premium border-0 overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> {{ __('All Ads') }}
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-database mr-1"></i> {{ $advertisements->total() }} {{ __('CAMPAIGNS') }}
                </span>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="addons-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"columnDefs": [{"orderable": false, "targets": [1, 4]}], "responsive": true}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4 w-35-p">{{ __('Creative & Title') }}</th>
                            <th>{{ __('Target URL') }}</th>
                            <th>{{ __('Placements') }}</th>
                            <th class="text-center">{{ __('Status') }}</th>
                            <th class="text-right px-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($advertisements as $advertisement)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        {{-- High-quality thumbnail preview --}}
                                        <div class="mr-3 bg-light border rounded overflow-hidden shadow-xs icon-box-70-50 rounded-12">
                                            <img src="{{ $advertisement->thumbnail_url }}" 
                                                 alt="Ad Preview" 
                                                 class="w-100 h-100 object-fit-cover">
                                        </div>
                                        <div>
                                            <a href="{{ route('admin.advertisements.show', $advertisement) }}" class="d-block font-weight-bold text-dark mb-0 hover-primary">
                                                {{ $advertisement->title }}
                                            </a>
                                            <small class="text-muted text-uppercase font-weight-bold text-monospace smallest ls-0-5">
                                                {{ __('ID:') }} #AD-{{ $advertisement->id }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <a href="{{ $advertisement->link }}" target="_blank" class="text-info small font-weight-bold">
                                        <i class="fas fa-link mr-1 text-xs text-muted"></i>
                                        {{ Str::limit(str_replace(['http://', 'https://'], '', $advertisement->link), 30) }}
                                    </a>
                                </td>

                                <td class="align-middle">
                                    @php
                                        $orientations = is_string($advertisement->orientations)
                                            ? json_decode($advertisement->orientations)
                                            : $advertisement->orientations;
                                    @endphp

                                    @if(is_array($orientations))
                                        @foreach($orientations as $o)
                                            <span class="badge badge-primary-light text-primary px-2 py-1 mb-1 text-uppercase smallest font-weight-bold">
                                                <i class="fas fa-layer-group mr-1 opacity-50"></i> {{ $o }}
                                            </span>
                                        @endforeach
                                    @else
                                        <span class="badge badge-primary-light text-primary px-2 py-1 text-uppercase smallest font-weight-bold">
                                            {{ $orientations }}
                                        </span>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @php $status = $advertisement->getStatusMeta(); @endphp
                                    <span class="badge badge-{{ $status['color'] }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs min-w-100">
                                        <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.advertisements.show', $advertisement) }}" 
                                           class="btn btn-white text-primary py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="{{ __('View Details') }}">
                                            <i class="fas fa-search"></i>
                                        </a>

                                        <a href="{{ route('admin.advertisements.edit', $advertisement) }}" 
                                           class="btn btn-white text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="{{ __('Modify Creative') }}">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>

                                        <form id="delete-form-{{ $advertisement->id }}" action="{{ route('admin.advertisements.destroy', $advertisement) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="{{ __('Archive Campaign') }}"
                                                    data-action="confirm-trigger"
                                                    data-confirm-title="{{ __('Archive Campaign?') }}"
                                                    data-confirm-text="{{ __('This creative will be removed from all active placements.') }}"
                                                    data-confirm-button="{{ __('Yes, archive it') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                        @include('admin._partials._empty-state', [
                            'colspan' => 5,
                            'icon' => 'fas fa-images',
                            'title' => __('No Campaigns Found'),
                            'description' => __('Upload your first creative to start generating impressions.'),
                            'button_text' => __('ADD FIRST AD'),
                            'button_link' => route('admin.advertisements.create')
                        ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('js')
    <script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection
