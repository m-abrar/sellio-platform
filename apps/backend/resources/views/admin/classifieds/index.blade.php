@extends('adminlte::page')

@section('title', 'Classified Ads')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-tags mr-2 text-primary"></i> Classified Ads
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage general classified advertisements and community listings.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.classifieds.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD AD
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
        <div class="card-body py-4 px-4">
            <form action="{{ route('admin.classifieds.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Ad Title</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control border-left-0" placeholder="Filter by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category_id" class="form-control select2 shadow-xs">
                            <option value="">All Categories</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs rounded-pill">
                            <i class="fas fa-filter mr-1"></i> APPLY FILTERS
                        </button>
                        <a href="{{ route('admin.classifieds.index') }}" class="btn btn-default font-weight-bold shadow-xs rounded-pill">
                            <i class="fas fa-undo mr-1"></i> RESET
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Classified Inventory</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="classifieds-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">Media</th>
                            <th>Item Details</th>
                            <th>Location</th>
                            <th>Pricing</th>
                            <th>Condition</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($classifieds as $ad)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 50px; height: 50px; margin: 0 auto;">
                                        <img src="{{ $ad->thumbnail_url ?? asset('images/placeholder.png') }}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $ad->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-secondary-light mr-2" style="font-size: 0.65rem;">ID: {{ $ad->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-folder mr-1"></i> {{ $ad->category->title ?? 'General' }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle small text-muted">
                                    <i class="fas fa-map-marker-alt mr-1 text-primary opacity-50"></i>
                                    {{ $ad->city ?? 'Remote' }}{{ isset($ad->country) ? ', ' . $ad->country : '' }}
                                </td>

                                <td class="align-middle">
                                    <div class="font-weight-bold text-dark">{{ $ad->price_formatted ?? '$0.00' }}</div>
                                    @if($ad->is_sale && $ad->is_for_rent) <small class="text-muted">Sale & Rent</small> @endif
                                </td>

                                <td class="align-middle">
                                    <span class="badge badge-premium badge-secondary-light">{{ $ad->condition_label ?? 'Used' }}</span>
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($ad->is_published && $ad->approved_at)
                                            <span class="badge badge-premium badge-success-light">Active</span>
                                        @elseif ($ad->is_published && !$ad->approved_at)
                                            <span class="badge badge-premium badge-warning-light">Pending</span>
                                        @else
                                            <span class="badge badge-premium badge-secondary-light">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm rounded-pill border overflow-hidden bg-white">
                                        <a href="{{ route('admin.classifieds.edit', $ad->id) }}" class="btn btn-white btn-sm text-info py-2 px-3 border-right" data-toggle="tooltip" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.classifieds.duplicate', $ad->id) }}" class="btn btn-white btn-sm text-success py-2 px-3 border-right" data-toggle="tooltip" title="Duplicate"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.classifieds.destroy', $ad->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Delete" onclick="return confirm('Permanently delete this classified ad?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" class="text-center py-5"><h5 class="text-muted">No Ads Found</h5></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($classifieds->hasPages())
            <div class="card-footer bg-white border-0 py-3">
                <div class="float-right">
                    {{ $classifieds->appends(request()->query())->links('pagination::bootstrap-4') }}
                </div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection
