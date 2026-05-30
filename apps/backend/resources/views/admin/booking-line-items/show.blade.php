@extends('adminlte::page')

@section('title', __('Booking Line Item'))

@section('content_header')
    <h1>{{ __('Booking Line Item') }} #{{ $item->id }}</h1>
@stop

@section('content')
@include('admin.alert')

<div class="card">
    <div class="card-body">
        <p><strong>{{ __('Booking') }}:</strong> #{{ $item->property_booking_id }}</p>
        <p><strong>{{ __('Title') }}:</strong> {{ $item->title }}</p>
        <p><strong>{{ __('Quantity') }}:</strong> {{ $item->quantity }}</p>
        <p><strong>{{ __('Price') }}:</strong> {{ number_format($item->price, 2) }}</p>
    </div>
</div>
@endsection
