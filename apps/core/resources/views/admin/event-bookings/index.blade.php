@extends('adminlte::page')

@section('title', __('Event Bookings'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-check mr-2 text-primary"></i>
                    {{ __('Event Bookings') }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Event Bookings') }}</li>
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
            <div class="card-body py-4">
                <form method="GET" action="{{ route('admin.event-bookings.index') }}">
                    <div class="row align-items-end">
                        <div class="col-md-4">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Event</label>
                            <select name="event" class="form-control shadow-xs">
                                <option value="">All Events</option>
                                @foreach ($events as $e)
                                    <option value="{{ $e->id }}" {{ request('event') == $e->id ? 'selected' : '' }}>{{ $e->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Status</label>
                            <select name="status" class="form-control shadow-xs">
                                <option value="">All Statuses</option>
                                <option value="pending" {{ $status == 'pending' ? 'selected' : '' }}>Pending</option>
                                <option value="confirmed" {{ $status == 'confirmed' ? 'selected' : '' }}>Confirmed</option>
                                <option value="cancelled" {{ $status == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                            </select>
                        </div>
                        <div class="col-md-2 d-flex align-items-end" style="gap: 10px;">
                            <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                                <i class="fas fa-filter mr-1"></i> APPLY
                            </button>
                            <a href="{{ route('admin.event-bookings.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                                <i class="fas fa-undo"></i>
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Main Table --}}
        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted"><i class="fas fa-calendar-alt mr-1 text-primary"></i> {{ __('All Bookings') }}</h3>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="bookings-table" class="table table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th style="width: 60px" class="text-center">ID</th>
                                <th style="width: 60px" class="text-center">{{ __('Item') }}</th>
                                <th>Event</th>
                                <th>Guest</th>
                                <th>Date</th>
                                <th class="text-center">Status</th>
                                <th class="text-right px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($bookings as $booking)
                                <tr>
                                    <td class="text-center align-middle">
                                        <span class="text-muted font-weight-bold text-monospace">#{{ $booking->id }}</span>
                                    </td>
                                    <td class="text-center align-middle">
                                        <img src="{{ $booking->event->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" class="img-thumbnail shadow-xs" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </td>
                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $booking->event->title ?? 'N/A' }}
                                        </span>
                                        <small class="text-muted">ID: #{{ $booking->event_id }}</small>
                                    </td>
                                    <td class="align-middle">
                                        @if($booking->user)
                                            <div class="d-flex align-items-center">
                                                <div class="mr-2 bg-light rounded-circle text-center border shadow-sm" style="width:32px; height:32px; line-height:30px; flex-shrink:0;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $booking->user->name }}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">{{ $booking->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary px-2">{{ __('Guest') }}</span>
                                        @endif
                                    </td>
                                    <td class="align-middle">
                                        <div class="font-weight-600 mb-0">{{ $booking->created_at->format('M d, Y') }}</div>
                                        <small class="text-muted"><i class="far fa-clock mr-1 text-xs"></i>{{ $booking->created_at->format('H:i') }}</small>
                                    </td>
                                    @php
                                        $statusClass = 'secondary';
                                        if($booking->status == 'pending') $statusClass = 'warning';
                                        elseif($booking->status == 'confirmed') $statusClass = 'success';
                                        elseif($booking->status == 'cancelled') $statusClass = 'danger';
                                    @endphp
                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $statusClass }}-light px-3 py-1 text-uppercase shadow-xs" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            {{ $booking->status ?? 'Confirmed' }}
                                        </span>
                                    </td>
                                    <td class="text-right px-4">
                                        <a href="{{ route('admin.event-bookings.show', $booking->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-eye"></i></a>
                                    </td>
                                </tr>
                            @empty
                                <tr><td colspan="6" class="text-center">No bookings found</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@stop
