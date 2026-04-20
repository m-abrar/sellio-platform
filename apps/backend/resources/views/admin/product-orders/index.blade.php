@extends('adminlte::page')

@section('title', __('Product Orders'))

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-shopping-bag mr-2 text-primary"></i>
                    {{ __('Product Orders') }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Product Orders') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        {{-- Premium Filter Card --}}
        <div class="card card-outline card-secondary shadow-sm mb-4">
            <div class="card-body py-3">
                <form method="GET" action="{{ route('admin.product-orders.index') }}" class="row justify-content-center">
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Order #</label>
                        <input type="text" name="order_number" class="form-control shadow-xs" placeholder="Search..." value="{{ request('order_number') }}">
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Product</label>
                        <input type="text" name="product_name" class="form-control shadow-xs" placeholder="Search..." value="{{ request('product_name') }}">
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                        <select name="status" class="form-control shadow-xs">
                            <option value="">All</option>
                            <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ $status == 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="completed" {{ $status == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ $status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Payment</label>
                        <select name="payment_status" class="form-control shadow-xs">
                            <option value="">All</option>
                            <option value="paid" {{ request('payment_status') == 'paid' ? 'selected' : '' }}>Paid</option>
                            <option value="unpaid" {{ request('payment_status') == 'unpaid' ? 'selected' : '' }}>Unpaid</option>
                        </select>
                    </div>
                    <div class="col-auto d-flex align-items-end" style="gap: 8px;">
                        <button type="submit" class="btn btn-primary font-weight-bold shadow-xs">
                            <i class="fas fa-filter mr-1"></i> FILTER
                        </button>
                        <a href="{{ route('admin.product-orders.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                            <i class="fas fa-undo"></i>
                        </a>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-list mr-1 text-primary"></i> {{ __('All Orders') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th class="text-center">Status</th>
                                <th>Date</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($orders as $order)
                                <tr>
                                    <td class="text-center align-middle">
                                        @php
                                            $firstItem = $order->items->first();
                                            $thumbnail = $firstItem && $firstItem->product ? $firstItem->product->thumbnail_url : asset('images/fallbacks/default.jpg');
                                        @endphp
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $thumbnail }}" alt="Order item" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <strong>{{ $order->order_number }}</strong>
                                        @if($firstItem)
                                            <div class="text-xs text-muted mt-1">
                                                <i class="fas fa-box-open mr-1"></i> {{ $firstItem->product_name }}
                                                @if($order->items->count() > 1)
                                                    <span class="badge badge-secondary ml-1">+{{ $order->items->count() - 1 }} more</span>
                                                @endif
                                            </div>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-xs mr-2 bg-light rounded-circle text-center border shadow-xs" style="width:28px; height:28px; line-height:26px;">
                                                <i class="fas fa-user text-muted text-xs"></i>
                                            </div>
                                            <div>
                                                <span class="d-block font-weight-bold text-dark mb-0">{{ $order->user->name ?? 'N/A' }}</span>
                                                <div class="text-xs text-muted">
                                                    {{ $order->user->email ?? '' }}
                                                    <span class="mx-1">|</span>
                                                    ID: #{{ $order->user_id }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-bold">${{ number_format($order->total_amount, 2) }}</div>
                                        @if($firstItem)
                                            <div class="text-xs text-muted mt-1">
                                                {{ $firstItem->quantity }} x ${{ number_format($firstItem->unit_price, 2) }}
                                                @if($firstItem->selected_attributes && is_array($firstItem->selected_attributes))
                                                    <br>
                                                    <span class="text-info">
                                                        @foreach($firstItem->selected_attributes as $key => $value)
                                                            {{ $key }}: {{ is_array($value) ? implode(', ', $value) : $value }}@if(!$loop->last), @endif
                                                        @endforeach
                                                    </span>
                                                @endif
                                            </div>
                                        @endif
                                    </td>
                                    <td>
                                        <span class="badge {{ $order->payment_status === 'paid' ? 'badge-success' : 'badge-warning' }}">
                                            {{ ucfirst($order->payment_status) }}
                                        </span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge badge-info">{{ ucfirst($order->status) }}</span>
                                    </td>
                                    <td>{{ $order->created_at->format('M d, Y') }}</td>
                                    <td class="text-right px-4">
                                        <a href="{{ route('admin.product-orders.show', $order->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-eye"></i></a>
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="8" class="text-center py-4">No orders found</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            @if ($orders->hasPages())
                <div class="card-footer border-0 bg-white">
                    {{ $orders->links() }}
                </div>
            @endif
        </div>
    </div>
@stop
