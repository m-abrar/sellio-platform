@extends('adminlte::page')

@section('plugins.Datatables', true)

@section('title', $reportTitle)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0"><i class="fas fa-building mr-2"></i> {{ $reportTitle }}</h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">{{ $reportTitle }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<div class="container-fluid">
    <div class="card card-outline card-info">
    <div class="card-header">
        <h3 class="card-title"><i class="fas fa-filter mr-1"></i> Filter Report Period</h3>
        <div class="card-tools">
            <span class="badge badge-secondary">Period: {{ $startDateFormatted ?? date('Y-m-d', strtotime('-30 days')) }} to {{ $endDateFormatted ?? date('Y-m-d') }}</span>
        </div>
    </div>
    <div class="card-body">
        <form method="GET" action="{{ route('admin.reports.properties') }}">
            <div class="row">
                <div class="col-md-5 form-group">
                    <label for="startDate">Start Date</label>
                    <input type="date" name="start_date" id="startDate" class="form-control" 
                           value="{{ $startDateFormatted ?? date('Y-m-d', strtotime('-30 days')) }}">
                </div>
                <div class="col-md-5 form-group">
                    <label for="endDate">End Date</label>
                    <input type="date" name="end_date" id="endDate" class="form-control" 
                           value="{{ $endDateFormatted ?? date('Y-m-d') }}">
                </div>
                <div class="col-md-2 form-group d-flex align-items-end">
                    <button type="submit" class="btn btn-info btn-block">
                        <i class="fas fa-search mr-1"></i> Apply Filter
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

{{-- Summary Info Boxes --}}
<div class="row mt-3">
    
    {{-- Average Occupancy Rate --}}
    <div class="col-lg-3 col-6">
        <div class="small-box bg-warning">
            <div class="inner">
                <h3>{{ $occupancyRate ?? '0%' }}</h3>
                <p>Occupancy Rate (in Date Range)</p>
            </div>
            <div class="icon">
                <i class="fas fa-chart-pie"></i>
            </div>
            <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>

    {{-- Properties Occupied (at least once) --}}
    <div class="col-lg-3 col-6">
        <div class="small-box bg-danger">
            <div class="inner">
                <h3>{{ $occupiedUnits ?? 0 }}</h3>
                <p>Properties Occupied</p>
            </div>
            <div class="icon">
                <i class="fas fa-house-user"></i>
            </div>
            <a href="#" class="small-box-footer">Bookings Check <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    
    {{-- Available Units --}}
    <div class="col-lg-3 col-6">
        <div class="small-box bg-success">
            <div class="inner">
                <h3>{{ $availableUnits ?? 0 }}</h3>
                <p>Units Available (Relative)</p>
            </div>
            <div class="icon">
                <i class="fas fa-door-open"></i>
            </div>
            <a href="#" class="small-box-footer">View Available <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
    
    {{-- Total Units Tracked --}}
    <div class="col-lg-3 col-6">
        <div class="small-box bg-info">
            <div class="inner">
                <h3>{{ $totalUnits ?? 0 }}</h3>
                <p>Total Units Tracked</p>
            </div>
            <div class="icon">
                <i class="fas fa-list-ol"></i>
            </div>
            <a href="#" class="small-box-footer">Manage Properties <i class="fas fa-arrow-circle-right"></i></a>
        </div>
    </div>
</div>

{{-- Property Availability Table --}}
<div class="row">
    <div class="col-lg-12">
        <div class="card card-primary card-outline">
            <div class="card-header">
                <h3 class="card-title">Property Availability Overview</h3>
            </div>
            <div class="card-body">
                @if(isset($propertyList) && $propertyList->isNotEmpty())
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped" id="propertyTable" style="width:100%">
                            <thead>
                                <tr>
                                    <th>Property/Listing</th>
                                    <th>Location</th>
                                    <th>Total Units</th>
                                    <th>Status (in Range)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($propertyList as $property)
                                    <tr>
                                        <td>{{ $property->title }}</td>
                                        <td>{{ $property->location }}</td>
                                        <td>{{ $property->total_units }}</td>
                                        <td>
                                            @php
                                                // Adjusting status checks for the new Controller logic
                                                $status = strtolower(explode(' ', $property->status)[0]);
                                            @endphp
                                            @if($status == 'available')
                                                <span class="badge badge-success">Available</span>
                                            @elseif($status == 'occupied')
                                                <span class="badge badge-danger">Occupied</span>
                                            @else
                                                <span class="badge badge-secondary">{{ $property->status }}</span>
                                            @endif
                                        </td>
                                        <td>
                                            <a href="{{ $property->link ?? '#' }}" target="_blank" class="btn btn-primary btn-xs" title="View Property">
                                                <i class="fa fa-eye"></i>
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <p class="text-center text-muted">
                        No properties found or no data available for the selected date range.
                    </p>
                @endif
            </div>
        </div>
    </div>
</div>
</div>
@endsection

@section('js')
    <script>
        // DataTables initialization script
        $(function () {
            $('#propertyTable').DataTable({
                "paging": true,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "responsive": true,
            });
        });
    </script>
@endsection
