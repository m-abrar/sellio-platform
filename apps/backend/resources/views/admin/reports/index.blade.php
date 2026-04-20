@extends('adminlte::page')

@section('title', 'Reports & Analytics')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-chart-line mr-2 text-primary"></i> Reports & Analytics
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Reports</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row">
            <div class="col-md-4">
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-calendar-check fa-3x text-primary mb-3"></i>
                        <h4 class="font-weight-bold">Booking Summary</h4>
                        <p class="text-muted">View booking trends and analytics</p>
                        <a href="{{ route('admin.reports.bookings') }}" class="btn btn-primary btn-flat font-weight-bold">
                            <i class="fas fa-arrow-right mr-1"></i> View Report
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-home fa-3x text-primary mb-3"></i>
                        <h4 class="font-weight-bold">Property Occupancy</h4>
                        <p class="text-muted">Property performance metrics</p>
                        <a href="{{ route('admin.reports.properties') }}" class="btn btn-primary btn-flat font-weight-bold">
                            <i class="fas fa-arrow-right mr-1"></i> View Report
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-wallet fa-3x text-primary mb-3"></i>
                        <h4 class="font-weight-bold">Revenue & Payments</h4>
                        <p class="text-muted">Financial overview and metrics</p>
                        <a href="{{ route('admin.reports.payments') }}" class="btn btn-primary btn-flat font-weight-bold">
                            <i class="fas fa-arrow-right mr-1"></i> View Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
