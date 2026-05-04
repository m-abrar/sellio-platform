@extends('adminlte::page')

@section('title', 'Advertisements')

@section('content_header')
    <div class="container-fluid pt-4">
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
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.advertisements.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-plus-circle mr-1"></i> ADD ADVERTISEMENT
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
    <div class="card card-premium shadow-premium border-0 overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-layer-group mr-2 text-primary opacity-50"></i> Active Creative Registry
            </h3>
            <div class="card-tools ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase">
                    <i class="fas fa-database mr-1"></i> {{ $advertisements->total() }} CAMPAIGNS
                </span>
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
                                        <div class="mr-3 bg-light border rounded overflow-hidden shadow-xs" style="width:70px; height:50px; border-radius: 12px !important;">
                                            <img src="{{ $advertisement->thumbnail_url }}" 
                                                 alt="Ad Preview" 
                                                 style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                        <div>
                                            <a href="{{ route('admin.advertisements.show', $advertisement) }}" class="d-block font-weight-bold text-dark mb-0 hover-primary">
                                                {{ $advertisement->title }}
                                            </a>
                                            <small class="text-muted text-uppercase font-weight-bold text-monospace smallest" style="letter-spacing: 0.5px;">
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
                                    @if($advertisement->status)
                                        <span class="badge badge-success-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            <i class="fas fa-play-circle mr-1"></i> Running
                                        </span>
                                    @else
                                        <span class="badge badge-secondary-soft text-secondary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs" style="min-width: 100px;">
                                            <i class="fas fa-pause-circle mr-1"></i> Paused
                                        </span>
                                    @endif
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-xs rounded-pill border overflow-hidden">
                                        <a href="{{ route('admin.advertisements.show', $advertisement) }}" 
                                           class="btn btn-white text-primary py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="View Details">
                                            <i class="fas fa-search"></i>
                                        </a>

                                        <a href="{{ route('admin.advertisements.edit', $advertisement) }}" 
                                           class="btn btn-white text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Modify Creative">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>

                                        <form id="delete-form-{{ $advertisement->id }}" action="{{ route('admin.advertisements.destroy', $advertisement) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Archive Campaign"
                                                    onclick="confirmDelete({{ $advertisement->id }})">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="5" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-images fa-4x text-muted opacity-25 mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Campaigns Found</h5>
                                        <p class="text-secondary small mb-3">Upload your first creative to start generating impressions.</p>
                                        <a href="{{ route('admin.advertisements.create') }}" class="btn btn-primary btn-sm px-4 rounded-pill font-weight-bold">
                                            <i class="fas fa-plus mr-1"></i> ADD FIRST AD
                                        </a>
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
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .hover-primary:hover { color: var(--primary) !important; text-decoration: none !important; }
</style>
@endsection

@section('js')
@include('admin._partials._sweetalert')
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
