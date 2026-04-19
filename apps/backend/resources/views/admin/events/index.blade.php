@extends('adminlte::page')

@section('title', 'Events')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary"></i> Event Listings
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.events.create') }}" class="btn btn-primary btn-flat shadow-sm">
                    <i class="fas fa-plus mr-1"></i> Add Event
                </a>
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
            <form action="{{ route('admin.events.index') }}" method="GET">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Event Title</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text bg-white border-right-0"><i class="fas fa-search text-muted text-xs"></i></span>
                            </div>
                            <input type="text" name="title" class="form-control border-left-0" placeholder="Filter by Title..." value="{{ request('title') }}">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Category</label>
                        <select name="category_id" class="form-control select2 shadow-xs">
                            <option value="">All Categories</option>
                            @foreach($categories ?? [] as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->title }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-end" style="gap: 10px;">
                        <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                            <i class="fas fa-filter mr-1"></i> APPLY FILTERS
                        </button>
                        <a href="{{ route('admin.events.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                            <i class="fas fa-undo mr-1"></i> RESET
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>

    {{-- Table Card --}}
    <div class="card card-primary card-outline shadow-sm">
        <div class="card-header border-0 bg-white py-3">
            <h3 class="card-title font-weight-600 text-muted">Event Schedule</h3>
            <div class="card-tools">
                <button type="button" class="btn btn-tool" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="events-table" class="table table-hover table-premium mb-0">
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center" style="width: 70px">Media</th>
                            <th>Event Details</th>
                            <th>Schedule</th>
                            <th>Pricing</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($events as $event)
                            <tr>
                                <td class="text-center align-middle">
                                    <div class="table-img-preview shadow-xs">
                                        <img src="{{ $event->thumbnail_url ?? asset('images/placeholder.png') }}">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $event->title }}</span>
                                            <div class="d-flex align-items-center mt-1">
                                                <small class="badge badge-light border text-muted mr-2">ID: {{ $event->id }}</small>
                                                <small class="text-muted">
                                                    <i class="fas fa-user mr-1"></i> {{ $event->user->name ?? 'Admin' }}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle small">
                                    <div><i class="fas fa-clock mr-1 text-muted"></i> {{ \Carbon\Carbon::parse($event->start_date_time)->format('M d, g:i A') }}</div>
                                    <div class="text-muted"><i class="fas fa-flag mr-1"></i> End: {{ \Carbon\Carbon::parse($event->end_date_time)->format('M d, g:i A') }}</div>
                                </td>

                                <td class="align-middle">
                                    @if($event->is_paid)
                                        <span class="badge badge-danger-light px-2 py-1">PAID</span>
                                        <div class="small font-weight-bold mt-1">{{ setting('currency_symbol', '$') }}{{ number_format($event->base_price, 2) }}</div>
                                    @else
                                        <span class="badge badge-success-light px-2 py-1">FREE</span>
                                    @endif
                                </td>

                                <td class="align-middle small">
                                    {{ $event->max_attendees ?? 'Unlimited' }}
                                </td>

                                <td class="align-middle">
                                    <div class="mb-1">
                                        @if ($event->is_published && $event->approved_at)
                                            <span class="badge badge-success-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Active</span>
                                        @elseif ($event->is_published && !$event->approved_at)
                                            <span class="badge badge-warning-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Pending</span>
                                        @else
                                            <span class="badge badge-secondary-light px-2 py-1 text-uppercase" style="font-size: 0.65rem;">Draft</span>
                                        @endif
                                    </div>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm">
                                        <a href="{{ route('admin.events.edit', $event->id) }}" class="btn btn-default btn-sm text-info"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.events.duplicate', $event->id) }}" class="btn btn-default btn-sm text-success"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.events.destroy', $event->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="btn btn-default btn-sm text-danger" onclick="return confirm('Permanently delete this event listing?')"><i class="fas fa-trash-alt"></i></button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" class="text-center py-5"><h5 class="text-muted">No Events Found</h5></td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($events->hasPages())
            <div class="card-footer bg-white border-0 py-3">
                <div class="float-right">
                    {{ $events->appends(request()->query())->links('pagination::bootstrap-4') }}
                </div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('css')
<style>
    .badge-success-light { background-color: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .badge-warning-light { background-color: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }
    .badge-secondary-light { background-color: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
</style>
@endsection
