@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Addons')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Addons
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-header border-0 bg-white py-3">
        <h3 class="card-title">Available Addons</h3>
        <a href="{{ route('admin.addons.create') }}" class="btn btn-primary float-right">
            <i class="fas fa-plus"></i> Add Addon
        </a>
    </div>
    <div class="card-body">
        <table id="addons-table" class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($addons as $addon)
                    <tr>
                        <td>{{ $addon->title }}</td>
                        <td>{{ $addon->description ?? '—' }}</td>
                        <td>{{ setting('currency_symbol') }}{{ number_format($addon->price, 2) }}</td>
                        <td>
                            @if($addon->status === 'active')
                                <span class="badge badge-success">Active</span>
                            @else
                                <span class="badge badge-danger">Inactive</span>
                            @endif
                        </td>
                        <td class="table-column-actions">
                            <a href="{{ route('admin.addons.edit', $addon->id) }}" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form action="{{ route('admin.addons.destroy', $addon->id) }}" method="POST" style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this addon?')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="text-center py-4">No addons found</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection


@section('js')
@include('admin._partials._sweetalert-delete')

    <script>
        $(document).ready(function () {
            $('#addons-table').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                responsive: true
            });
        });
    </script>
@endsection
