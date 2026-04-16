@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', 'Line Items')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Line Items
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="card card-primary card-outline shadow-sm border-0">
    <div class="card-header border-0 bg-white py-3">
        <h3 class="card-title">Available Line Items</h3>
        <a href="{{ route('admin.line-items.create') }}" class="btn btn-primary float-right">
            <i class="fas fa-plus"></i> Add Line Item
        </a>
    </div>
    <div class="card-body">
        <table id="line-items-table" class="table table-hover table-premium mb-0">
            <thead class="thead-light">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Applies On</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($lineItems as $item)
                    <tr>
                        <td>{{ $item->title }}</td>
                        <td>{{ ucfirst($item->type) }}</td>
                        <td>
                            @if($item->type == 'percentage')
                                {{ $item->amount }}%
                            @else
                                {{ setting('currency_symbol') }}{{ number_format($item->amount, 2) }} 
                            @endif
                        </td>
                        <td>{{ ucfirst($item->applies_on) }}</td>
                        <td>
                            @if($item->status === 'active')
                                <span class="badge badge-success">Active</span>
                            @else
                                <span class="badge badge-danger">Inactive</span>
                            @endif
                        </td>
                        <td class="table-column-actions">
                            <a href="{{ route('admin.line-items.edit', $item->id) }}" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i>
                            </a>
                            <form action="{{ route('admin.line-items.destroy', $item->id) }}" method="POST" style="display:inline;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this line item?')">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

@endsection


@section('js')
    
    
    <script>
        $(document).ready(function () {
            $('#line-items-table').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                responsive: true
            });
        });
    </script>
@endsection
