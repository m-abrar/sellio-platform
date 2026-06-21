{{--
    Administrative Events: Global Inventory Registry
    
    This view provides the authoritative Dashboard for the event 
    marketplace. It aggregates schedule itineraries, ticketing 
    specifications (paid/complimentary), and attendee capacity metrics 
    for all event assets. It facilitates efficient lifecycle tracking 
    and inventory oversight through a responsive data architecture.
    
    @extends adminlte::page
    @context Event Inventory Management
    @variables Paginator $events Paginated collection of Event model instances.
--}}
@extends('adminlte::page')

@section('title', __('Events'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary"></i> {{ __('Event Listings') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Manage event tickets, venue details, and attendee registrations.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.events.create') }}" class="btn btn-primary btn-registry-add">
                    <i class="fas fa-plus-circle mr-1"></i> {{ __('ADD EVENT') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    @include('admin.events._filter')

    {{-- Main Table --}}
    <div class="card registry-table-card">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
            <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 float-none letter-spacing-1">{{ __('Event Schedule') }}</h3>
            <div class="card-tools d-flex align-items-center ml-auto">
                <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase mr-2">
                    <i class="fas fa-database mr-1"></i> {{ $events->total() }} {{ __('ASSETS FOUND') }}
                </span>
                <button type="button" class="btn btn-tool text-muted" data-card-widget="maximize">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="events-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "searching": false, "ordering": true, "info": false}'>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center pl-4 col-media-70">{{ __('Media') }}</th>
                            <th>{{ __('Event Identity') }}</th>
                            <th>{{ __('Schedule') }}</th>
                            <th>{{ __('Ticketing') }}</th>
                            <th>{{ __('Status') }}</th>
                            <th class="text-right pr-4">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($events as $event)
                            <tr>
                                <td class="text-center align-middle pl-4">
                                    <div class="table-img-preview shadow-sm mx-auto">
                                        <img src="{{ $event->thumbnail_url ?? asset('images/placeholder.png') }}" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="d-block font-weight-bold text-dark mb-0 text-0-95">{{ $event->title }}</span>
                                    <div class="d-flex align-items-center mt-1 gap-10">
                                        <span class="smallest font-weight-bold text-muted text-monospace">{{ __('ID') }}: #{{ str_pad($event->id, 5, '0', STR_PAD_LEFT) }}</span>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-user-tie mr-1 opacity-50"></i> {{ $event->user->name ?? __('Admin') }}
                                        </span>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <div class="smallest text-muted font-weight-bold uppercase letter-spacing-1 mb-1">
                                        <i class="fas fa-calendar-check mr-1 text-primary opacity-50"></i> {{ \Carbon\Carbon::parse($event->start_date_time)->format('M d, g:i A') }}
                                    </div>
                                    <div class="smallest text-muted uppercase letter-spacing-1">
                                        <i class="fas fa-users mr-1 opacity-50"></i> {{ $event->max_attendees ?? __('Unlimited') }} {{ __('Attendees') }}
                                    </div>
                                </td>

                                <td class="align-middle">
                                    @if($event->is_paid)
                                        <div class="font-weight-bold text-danger smallest uppercase letter-spacing-1">{{ __('Paid Entry') }}</div>
                                        <div class="font-weight-bold text-dark h6 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($event->base_price, 2) }}</div>
                                    @else
                                        <span class="badge badge-success-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ __('Complimentary') }}</span>
                                    @endif
                                </td>

                                <td class="text-center align-middle">
                                    <div class="mb-1">
                                        @php $status = $event->getStatusMeta(); @endphp
                                        <span class="badge badge-{{ $status['color'] }}-light px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                            <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
                                        </span>
                                    </div>
                                </td>

                                <td class="text-right align-middle pr-4">
                                    <div class="btn-group btn-group-premium">
                                        <a href="{{ route('admin.events.edit', $event->id) }}" class="btn text-primary" data-toggle="tooltip" title="{{ __('Modify Event') }}"><i class="fas fa-pencil-alt"></i></a>
                                        <a href="{{ route('admin.events.duplicate', $event->id) }}" class="btn text-success" data-toggle="tooltip" title="{{ __('Clone Event') }}"><i class="fas fa-copy"></i></a>
                                        <form action="{{ route('admin.events.destroy', $event->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn text-danger" 
                                                    data-toggle="tooltip" title="{{ __('Purge Event') }}"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="{{ __('Purge Event?') }}"
                                                    data-confirm-text="{{ __('Permanently delete this event listing?') }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            @include('admin._partials._empty-state', [
                                'colspan' => 6,
                                'icon' => 'fas fa-calendar-alt',
                                'title' => __('No events detected in schedule.'),
                                'description' => __('Synchronize your calendar or initialize new event entries to populate this registry.'),
                                'button_text' => __('INITIALIZE EVENT'),
                                'button_link' => route('admin.events.create')
                            ])
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($events->hasPages())
            <div class="card-footer bg-white border-top py-4 px-4 d-flex justify-content-between align-items-center">
                <div class="text-muted smallest font-weight-bold uppercase letter-spacing-1">{{ __('Displaying') }} {{ $events->firstItem() }} - {{ $events->lastItem() }} {{ __('of') }} {{ $events->total() }} {{ __('records') }}</div>
                <div>{{ $events->appends(request()->query())->links('pagination::bootstrap-4') }}</div>
            </div>
        @endif
    </div>
</div>
@include('admin._partials._sweetalert-delete')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection
