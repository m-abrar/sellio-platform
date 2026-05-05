@extends('adminlte::page')

@section('title', 'Properties')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-building mr-2 text-primary"></i> Properties
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Manage real estate listings, property features, and booking availability.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.properties.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-2"></i> Add Property
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    {{-- Premium Filter Card --}}
    <div class="card registry-card-premium mb-4">
        <div class="card-body py-4 px-4">
            <form action="{{ route('admin.properties.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Property Name</label>
                        <div class="input-group input-group-premium">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-search text-xs"></i></span>
                            </div>
                            <input type="text" name="name" class="form-control" placeholder="Filter by Title..." value="{{ request('name') }}">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Location</label>
                        <div class="input-group input-group-premium">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-map-marker-alt text-xs"></i></span>
                            </div>
                            <select name="location_id" class="form-control select2">
                                <option value="">All Locations</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ request('location_id') == $loc->id ? 'selected' : '' }}>{{ $loc->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <div class="input-group input-group-premium">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-folder-open text-xs"></i></span>
                            </div>
                            <select name="category_id" class="form-control select2">
                                <option value="">All Categories</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="col-md-3 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs rounded-pill smallest uppercase" style="height: 46px;">
                            <i class="fas fa-filter mr-2"></i> Update
                        </button>
                        <a href="{{ route('admin.properties.index') }}" class="btn btn-default font-weight-bold shadow-xs rounded-pill px-3 d-flex align-items-center justify-content-center" style="height: 46px;">
                            <i class="fas fa-undo text-danger m-0"></i>
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">Property Inventory</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="properties-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">Media</th>
                            <th>Property Info</th>
                            <th>Type/Structure</th>
                            <th>Pricing</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($properties as $property)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-sm">
                                        <img src="{{ $property->thumbnail_url ?? asset('images/placeholder.png') }}">
                                    </div>
                                </td>
                                
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $property->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-secondary-light mr-2" style="font-size: 0.65rem;">ID: {{ $property->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-user mr-1"></i> {{ $property->user->name ?? 'Admin' }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="d-block font-weight-600 text-sm text-dark">{{ $property->category->title ?? 'Uncategorized' }}</span>
                                    <small class="text-muted text-xs">
                                        {{ $property->number_of_bedrooms ?? 0 }} Beds | {{ $property->number_of_bathrooms ?? 0 }} Baths
                                    </small>
                                </td>

                                <td class="align-middle">
                                    @if($property->is_rental)
                                        <span class="badge badge-premium badge-warning-light">RENTAL</span>
                                        <div class="small font-weight-bold mt-1 text-dark">{{ setting('currency_symbol', '$') }}{{ number_format($property->price_per_night, 2) }} / night</div>
                                    @else
                                        <span class="badge badge-premium badge-danger-light">SALE</span>
                                        <div class="small font-weight-bold mt-1 text-dark">{{ setting('currency_symbol', '$') }}{{ number_format($property->base_price, 2) }}</div>
                                    @endif
                                </td>

                                <td class="align-middle small text-muted">
                                    <i class="fas fa-map-marker-alt text-primary opacity-50 mr-1"></i>
                                    {{ $property->location->name ?? $property->city ?? 'Global' }}
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($property->is_published && $property->approved_at)
                                            <span class="badge badge-premium badge-success-light">Active</span>
                                        @elseif ($property->is_published && !$property->approved_at)
                                            <span class="badge badge-premium badge-warning-light">Pending</span>
                                        @else
                                            <span class="badge badge-premium badge-secondary-light">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm rounded-pill border overflow-hidden bg-white">
                                        <a href="{{ route('admin.properties.edit', $property->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Edit Detail">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <a href="{{ route('admin.properties.duplicate', $property->id) }}" 
                                           class="btn btn-white btn-sm text-success py-2 px-3 border-right" 
                                           data-toggle="tooltip" title="Duplicate">
                                            <i class="fas fa-copy"></i>
                                        </a>
                                        <form action="{{ route('admin.properties.destroy', $property->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-white btn-sm text-danger py-2 px-3" 
                                                    data-toggle="tooltip" title="Delete Listing"
                                                    onclick="return confirm('Permanently delete this property listing?')">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="7" class="text-center py-5">
                                    <i class="fas fa-building fa-3x text-light mb-3 d-block"></i>
                                    <h5 class="text-muted font-weight-bold">No Properties Found</h5>
                                    <p class="text-secondary small">Add a new property to get started.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($properties->hasPages())
            <div class="card-footer bg-white border-0 py-4 px-4">
                <div class="float-right">
                    {{ $properties->appends(request()->query())->links('pagination::bootstrap-4') }}
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

@section('js')
<script>
    $(function () {
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' });
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
