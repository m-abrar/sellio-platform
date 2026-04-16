@extends('adminlte::page')

@section('title', 'Autos')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-primary"></i> Auto Listings
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.autos.create') }}" class="btn btn-primary btn-flat shadow-sm">
                    <i class="fas fa-plus mr-1"></i> Add Auto
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card card-outline card-secondary shadow-sm mb-4">
        <div class="card-body py-4">
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
                                <option value="{{ $b->id }}" {{ request('brand_id') == $b->id ? 'selected' : '' }}>{{ $b->name }}</option>
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
    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">Auto Inventory</h3>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="autos-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">ID</th>
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
                                <td class="text-center align-middle font-weight-bold text-muted small">#{{ $auto->id }}</td>
                                
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded overflow-hidden shadow-xs" style="width:50px; height:40px;">
                                            <img src="{{ $auto->thumbnail_url ?? asset('images/placeholder.png') }}" class="w-100 h-100" style="object-fit: cover;">
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $auto->title }}</span>
                                            <small class="text-muted">By: {{ $auto->user->name ?? 'Admin' }}</small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-600 text-sm text-dark">{{ $auto->brand->name ?? 'Unknown' }}</span>
                                    <small class="text-muted">Model: {{ $auto->model ?? 'N/A' }} | Year: {{ $auto->year ?? 'N/A' }}</small>
                                </td>

                                <td class="align-middle">
                                    @if($auto->is_lease)
                                        <span class="badge bg-warning text-dark px-2">LEASE</span>
                                        <div class="small font-weight-bold mt-1">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }} / mo</div>
                                    @else
                                        <span class="badge bg-danger text-white px-2">SALE</span>
                                        <div class="small font-weight-bold mt-1">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="align-middle small">
                                    {{ $auto->mileage_value ?? 0 }} {{ $auto->mileage_units ?? 'km' }}
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($auto->is_published && $auto->approved_at)
                                            <span class="badge badge-success-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Active</span>
                                        @elseif ($auto->is_published && !$auto->approved_at)
                                            <span class="badge badge-warning-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.autos.edit', $auto->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-pencil-alt"></i></a>
                                        <form action="{{ route('admin.autos.destroy', $auto->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" onclick="return confirm('Permanently delete this auto listing?')"><i class="fas fa-trash-alt"></i></button>
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
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection
