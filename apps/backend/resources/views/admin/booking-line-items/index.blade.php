@extends('adminlte::page')

@section('title', __('Booking Line Items'))

@section('content_header')
    <h1>{{ __('Booking Line Items') }}</h1>
@stop

@section('content')
@include('admin.alert')

<div class="card">
    <div class="card-body p-0">
        <table class="table table-hover mb-0">
            <thead>
                <tr>
                    <th>{{ __('Booking') }}</th>
                    <th>{{ __('Title') }}</th>
                    <th>{{ __('Quantity') }}</th>
                    <th>{{ __('Price') }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $item)
                    <tr>
                        <td>#{{ $item->property_booking_id }}</td>
                        <td>{{ $item->title }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ number_format($item->price, 2) }}</td>
                        <td class="text-right">
                            <a href="{{ route('admin.booking-line-items.show', $item) }}" class="btn btn-sm btn-outline-primary">{{ __('View') }}</a>
                        </td>
                    </tr>
                @empty
                    <tr><td colspan="5" class="text-center text-muted py-4">{{ __('No line items found.') }}</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    @if($items->hasPages())
        <div class="card-footer">{{ $items->links() }}</div>
    @endif
</div>
@endsection
