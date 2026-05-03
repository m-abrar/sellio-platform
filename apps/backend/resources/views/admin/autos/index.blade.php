@extends('adminlte::page')

@section('title', 'Autos')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> Auto Listings
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage vehicle listings, specifications, and dealer information.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.autos.create') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium">
                    <i class="fas fa-plus-circle mr-1"></i> ADD AUTO
                </a>
            </div>
        </div>
    </div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
        <div class="card-body py-4 px-4">
            <form action="{{ route('admin.autos.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Auto Title</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control border-left-0" placeholder="Filter by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Brand</label>
                        <select name="brand_id" class="form-control select2 shadow-xs">
                            <option value="">All Brands</option>
                            @foreach($brands ?? [] as $b)
                                <option value="{{ $b->id }}" {{ request('brand_id') == $b->id ? 'selected' : '' }}>{{ $b->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category_id" class="form-control select2 shadow-xs">
                            <option value="">All Categories</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                            <i class="fas fa-filter mr-1"></i> APPLY FILTERS
                        </button>
                        <a href="{{ route('admin.autos.index') }}" class="btn btn-default font-weight-bold shadow-xs">
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
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Auto Inventory</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="autos-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">Media</th>
                            <th>Auto Info</th>
                            <th>Year & Brand</th>
                            <th>Pricing</th>
                            <th>Mileage</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($autos as $auto)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-xs rounded-lg overflow-hidden border" style="width: 50px; height: 50px; margin: 0 auto;">
                                        <img src="{{ $auto->thumbnail_url ?? asset('images/placeholder.png') }}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $auto->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-secondary-light mr-2" style="font-size: 0.65rem;">ID: {{ $auto->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-user mr-1"></i> {{ $auto->user->name ?? 'Admin' }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-600 text-sm text-dark">{{ $auto->brand->name ?? 'Unknown' }}</span>
                                    <small class="text-muted text-xs">Model: {{ $auto->model ?? 'N/A' }} | Year: {{ $auto->year ?? 'N/A' }}</small>
                                </td>

                                <td class="align-middle">
                                    @if($auto->is_lease)
                                        <span class="badge badge-premium badge-warning-light">LEASE</span>
                                        <div class="small font-weight-bold mt-1 text-dark">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }} / mo</div>
                                    @else
                                        <span class="badge badge-premium badge-danger-light">SALE</span>
                                        <div class="small font-weight-bold mt-1 text-dark">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="align-middle small text-muted">
                                    <i class="fas fa-tachometer-alt mr-1"></i>
                                    {{ $auto->mileage_value ?? 0 }} {{ $auto->mileage_units ?? 'km' }}
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($auto->is_published && $auto->approved_at)
                                            <span class="badge badge-premium badge-success-light">Active</span>
                                        @elseif ($auto->is_published && !$auto->approved_at)
                                            <span class="badge badge-premium badge-warning-light">Pending</span>
                                        @else
                                            <span class="badge badge-premium badge-secondary-light">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm rounded-pill border overflow-hidden bg-white">
                                        <a href="{{ route('admin.autos.edit', $auto->id) }}" class="btn btn-white btn-sm text-info py-2 px-3 border-right" data-toggle="tooltip" title="Edit"><i class="fas fa-pencil-alt"></i></a>
                                        <form action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" data-toggle="tooltip" title="Delete" onclick="return confirm('Permanently delete this auto listing?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" class="text-center py-5"><h5 class="text-muted">No Autos Found</h5></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($autos->hasPages())
            <div class="card-footer bg-white border-0 py-3">
                <div class="float-right">
                    {{ $autos->appends(request()->query())->links('pagination::bootstrap-4') }}
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('js')
@include('admin._partials._sweetalert-delete')
@endsection
