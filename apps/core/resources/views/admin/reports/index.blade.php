@extends('admin.layouts.app')

@section('content')
    <h1>Reports & Analytics</h1>
    
    <div class="row">
        <div class="col-md-4">
            <a href="{{ route('admin.reports.bookings') }}" class="btn btn-primary">Booking Report</a>
        </div>
        <div class="col-md-4">
            <a href="{{ route('admin.reports.properties') }}" class="btn btn-primary">Property Report</a>
        </div>
        <div class="col-md-4">
            <a href="{{ route('admin.reports.payments') }}" class="btn btn-primary">Payment Report</a>
        </div>
    </div>
@endsection
