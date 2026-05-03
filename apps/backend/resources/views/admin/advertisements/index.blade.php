@extends('adminlte::page')

@section('title', 'Advertisements')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ad mr-2 text-primary opacity-50"></i> Ad Campaigns
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Creative management and impression orchestration for marketplace promotions.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.welcome') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO DASHBOARD
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Ad Management Card --}}
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-3 px-4">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Active Creative Registry</h3>
            <div class="card-tools">
                <a href="{{ route('admin.advertisements.create') }}" class="btn btn-primary btn-flat shadow-sm px-3">
                    <i class="fas fa-plus-circle mr-1"></i> Add Advertisement
                </a>
            </div>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="advertisements-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="px-4" style="width: 35%">Creative & Title</th>
                            <th>Target URL</th>
                            <th>Placements</th>
                            <th class="text-center">Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($advertisements as $advertisement)
                            <tr>
                                <td class="align-middle px-4">
                                    <div class="d-flex align-items-center">
                                        {{-- High-quality thumbnail preview --}}
                                        <div class="mr-3 bg-light border rounded overflow-hidden shadow-xs" style="width:70px; height:50px; border-radius: 6px !important;">
                                            <img src="{{ $advertisement->thumbnail_url }}" 
                                                 alt="Ad Preview" 
                                                 style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                        <div>
                                            {{-- ADDED: Link on Title --}}
                                            <a href="{{ route('admin.advertisements.show', $advertisement) }}" class="d-block font-weight-bold text-dark mb-0 hover-primary">
                                                {{ $advertisement->title }}
                                            </a>
                                            <small class="text-muted text-uppercase font-weight-bold text-monospace" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                                ID: #AD-{{ $advertisement->id }}
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
                                            <span class="badge badge-primary-light text-primary px-2 py-1 mb-1 text-uppercase" style="font-size: 0.65rem;">
                                                <i class="fas fa-layer-group mr-1"></i> {{ $o }}
                                            </span>
                                        @endforeach
                                    @else
                                        <span class="badge badge-primary-light text-primary px-2 py-1 text-uppercase" style="font-size: 0.65rem;">
                                            {{ $orientations }}
                                        </span>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    @if($advertisement->status)
                                        <span class="badge badge-success-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; min-width: 90px;">
                                            <i class="fas fa-play-circle mr-1"></i> Running
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; min-width: 90px;">
                                            <i class="fas fa-pause-circle mr-1"></i> Paused
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm border overflow-hidden rounded-pill bg-white">
                                        <a href="{{ route('admin.advertisements.show', $advertisement) }}" 
                                           class="btn btn-white btn-sm text-primary py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="View Details">
                                            <i class="fas fa-search"></i>
                                        </a>

                                        <a href="{{ route('admin.advertisements.edit', $advertisement) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Creative">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>

                                        <form id="delete-form-{{ $advertisement->id }}" action="{{ route('admin.advertisements.destroy', $advertisement) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Archive Campaign"
                                                    onclick="confirmDelete({{ $advertisement->id }})">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-images fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Campaigns Found</h5>
                                        <p class="text-secondary small">Upload your first creative to start generating impressions.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection

@section('css')
<style>
    /* Blueprint Layout Utilities */
    .table-premium thead th { border-top: none; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px; color: #6c757d; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-monospace { font-family: 'SFMono-Regular', Consolas, monospace !important; }
    .font-weight-600 { font-weight: 600 !important; }
    
    /* ADDED: Hover effect for links */
    .hover-primary:hover { color: #007bff !important; text-decoration: underline; }

    /* Blueprint Light Badge Classes */
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-secondary-light { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
    .badge-primary-light { background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }

    /* Action Buttons Style */
    .btn-group-premium .btn { border: 1px solid #e9ecef; background: #fff; padding: 0.25rem 0.75rem; }
    .btn-group-premium .btn:hover { background: #f8f9fa; }
</style>
@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    function confirmDelete(id) {
        Swal.fire({
            title: 'Archive Campaign?',
            text: "This creative will be removed from all active placements.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, archive it',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('delete-form-' + id).submit();
            }
        })
    }
</script>
@endsection
