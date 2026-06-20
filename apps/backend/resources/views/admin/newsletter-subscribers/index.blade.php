{{--
    Administrative Marketing Module: Audience Acquisition Registry
    
    This view serves as the primary orchestration layer for marketplace 
    newsletter participants. It facilitates the management of prospect 
    identities, acquisition source tracking, opt-in lifecycle monitoring, 
    and bulk audience synchronization (CSV/Excel export protocols).
    
    @extends adminlte::page
    @context Marketing Management
    @variables Collection $subscribers Collection of NewsletterSubscriber model instances.
--}}
@extends('adminlte::page')

@section('title', 'Newsletter Subscribers')

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 text-center text-sm-left mb-3 mb-sm-0">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-envelope-open-text mr-2 text-primary opacity-50"></i> {{ __('Newsletter Audience') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('All Subscribers for multi-channel marketing and prospect engagement.') }}</p>
            </div>
            <div class="col-sm-4 d-flex align-items-center justify-content-center justify-content-sm-end">
                <div class="d-flex justify-content-center justify-content-sm-end align-items-center gap-12 flex-wrap">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm mb-2 mb-sm-0">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.newsletter-subscribers.export') }}" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium mb-2 mb-sm-0">
                        <i class="fas fa-file-export mr-1"></i> {{ __('EXPORT AUDIENCE') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    @include('admin.newsletter-subscribers._filter')

    {{-- Subscriber Management Card --}}
    <div class="card border-0 shadow-premium overflow-hidden rounded-24">
        <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
            <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1 float-none">
                <i class="fas fa-users mr-2 text-primary opacity-50"></i> All Subscribers
            </h3>
            <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase ml-auto">
                {{ $subscribers->total() }} TOTAL SUBSCRIBERS
            </span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive">
                <table id="subscribers-table" class="table table-hover table-premium mb-0 datatable-init"
                       data-datatable-config='{"paging": false, "info": false, "searching": false, "ordering": true, "dom": "t"}'>
                    <thead class="thead-light">
                        <tr>
                            <th>Subscriber Identity</th>
                            <th>Acquisition Source</th>
                            <th>Subscription Date</th>
                            <th class="text-center">Opt-in Status</th>
                            <th class="text-right px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($subscribers as $subscriber)
                            <tr>
                                <td class="align-middle">
                                    <div class="d-flex align-items-center">
                                        <div class="icon-shape mr-3 bg-light border rounded-circle d-flex align-items-center justify-content-center shadow-xs icon-box-40">
                                            <i class="fas fa-user-check text-primary font-0-9"></i>
                                        </div>
                                        <div>
                                            <span class="d-block font-weight-bold text-dark mb-0">{{ $subscriber->email }}</span>
                                            <small class="text-muted text-uppercase font-weight-bold smallest-0-65 ls-0-5">
                                                Identity: {{ $subscriber->user_id ? 'Registered (UID:'.$subscriber->user_id.')' : 'Guest Prospect' }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td class="align-middle">
                                    <span class="badge badge-primary-light text-primary px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">
                                        <i class="fas fa-fingerprint mr-1 text-xs"></i> {{ $subscriber->source ?? 'Main Website' }}
                                    </span>
                                </td>

                                <td class="align-middle small">
                                    <div class="text-dark font-weight-bold">
                                        {{ $subscriber->created_at->format('M d, Y') }}
                                    </div>
                                    <div class="text-muted">
                                        <i class="far fa-clock mr-1 text-xs"></i> {{ $subscriber->created_at->format('g:i A') }}
                                    </div>
                                </td>

                                <td class="text-center align-middle">
                                    <span class="badge {{ $subscriber->is_confirmed ? 'badge-success-light' : 'badge-warning-light' }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 min-w-100">
                                        <i class="fas {{ $subscriber->is_confirmed ? 'fa-check-double' : 'fa-hourglass-half' }} mr-1"></i>
                                        {{ $subscriber->is_confirmed ? 'Confirmed' : 'Pending' }}
                                    </span>
                                </td>

                                <td class="text-right align-middle px-4">
                                    <div class="btn-group btn-group-premium shadow-sm border overflow-hidden rounded-pill bg-white">
                                        <a href="{{ route('admin.newsletter-subscribers.edit', $subscriber->id) }}" 
                                           class="btn btn-white btn-sm text-info py-2 px-3" 
                                           data-toggle="tooltip" title="Edit Detail">
                                            <i class="fas fa-pencil-alt"></i>
                                        </a>
                                        <form id="delete-form-{{ $subscriber->id }}" action="{{ route('admin.newsletter-subscribers.destroy', $subscriber->id) }}" method="POST" class="d-inline">
                                            @csrf @method('DELETE')
                                            <button type="button" class="btn btn-white btn-sm text-danger py-2 px-3 border-left" 
                                                    data-toggle="tooltip" title="Unsubscribe"
                                                    data-action="delete-trigger"
                                                    data-confirm-title="Unsubscribe User?"
                                                    data-confirm-text="This user will be removed from the registry.">
                                                <i class="fas fa-user-minus"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state">
                                <td colspan="6" class="text-center py-5">
                                    <div class="py-4">
                                        <i class="fas fa-users-slash fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">No Subscribers Found</h5>
                                        <p class="text-secondary">Your newsletter audience list is currently empty.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        @if($subscribers->hasPages())
            <div class="card-footer bg-white border-top py-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small font-weight-bold text-uppercase">
                        Showing {{ $subscribers->firstItem() }}-{{ $subscribers->lastItem() }} of {{ $subscribers->total() }}
                    </span>
                    <div>
                        {{ $subscribers->appends(request()->except('page'))->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@stop

@section('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@stop
