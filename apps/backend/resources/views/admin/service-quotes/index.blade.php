@extends('adminlte::page')

@section('title', __('Service Quotes'))

@section('plugins.Datatables', true)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice mr-2 text-primary"></i>
                    {{ __('Service Quote Requests') }}
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">{{ __('Dashboard') }}</a></li>
                    <li class="breadcrumb-item active">{{ __('Service Quotes') }}</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="card card-primary card-outline shadow-sm">
            <div class="card-header border-0 bg-white py-3">
                <h3 class="card-title font-weight-600 text-muted">
                    <i class="fas fa-clipboard-list mr-1 text-primary"></i> {{ __('All Quote Requests') }}
                </h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="maximize">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>

            <div class="card-body p-0">
                <div class="table-responsive">
                    <table id="quotes-table" class="table table-hover table-premium mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="text-center" style="width: 70px">Media</th>
                                <th>{{ __('Service') }}</th>
                                <th>{{ __('Customer') }}</th>
                                <th>{{ __('Scope') }}</th>
                                <th>{{ __('Requested Date') }}</th>
                                <th>{{ __('Quoted Price') }}</th>
                                <th class="text-center">{{ __('Status') }}</th>
                                <th class="text-right px-4">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($serviceQuotes as $quote)
                                @php
                                    $statusMap = [
                                        'pending'  => ['class' => 'warning',   'icon' => 'fa-clock'],
                                        'quoted'   => ['class' => 'info',      'icon' => 'fa-tag'],
                                        'accepted' => ['class' => 'success',   'icon' => 'fa-check-circle'],
                                        'rejected' => ['class' => 'danger',    'icon' => 'fa-times-circle'],
                                    ];
                                    $badge = $statusMap[$quote->status] ?? ['class' => 'secondary', 'icon' => 'fa-circle'];
                                @endphp
                                <tr>
                                    <td class="text-center align-middle">
                                        <div class="table-img-preview shadow-xs">
                                            <img src="{{ $quote->service->thumbnail_url ?? asset('images/fallbacks/default.jpg') }}" alt="Service" onerror="this.src='{{ asset('images/fallbacks/default.jpg') }}'">
                                        </div>
                                    </td>

                                    <td class="align-middle">
                                        <span class="d-block font-weight-bold text-dark mb-0">
                                            {{ $quote->service->title ?? __('N/A') }}
                                        </span>
                                        <small class="badge badge-light border text-muted">ID: {{ $quote->id }}</small>
                                    </td>

                                    <td class="align-middle">
                                        @if($quote->user)
                                            <div class="d-flex align-items-center">
                                                <div class="mr-2 bg-light rounded-circle text-center border shadow-xs"
                                                     style="width:32px; height:32px; line-height:30px; flex-shrink:0;">
                                                    <i class="fas fa-user text-muted text-xs"></i>
                                                </div>
                                                <div>
                                                    <span class="d-block font-weight-bold text-dark mb-0">{{ $quote->user->name }}</span>
                                                    <small class="text-muted" style="font-size: 0.7rem;">{{ $quote->user->email }}</small>
                                                </div>
                                            </div>
                                        @else
                                            <span class="badge badge-secondary px-2">{{ __('Guest') }}</span>
                                        @endif
                                    </td>

                                    <td class="align-middle">
                                        @if($quote->scope_size)
                                            <span class="badge badge-light border text-capitalize px-2">
                                                {{ $quote->scope_size }}
                                            </span>
                                        @else
                                            <span class="text-muted">—</span>
                                        @endif
                                    </td>

                                    <td class="align-middle">
                                        @if($quote->requested_date)
                                            <div class="font-weight-600 mb-0">{{ $quote->requested_date->format('M d, Y') }}</div>
                                        @else
                                            <span class="text-muted">{{ __('Flexible') }}</span>
                                        @endif
                                        <small class="text-muted">{{ $quote->created_at->diffForHumans() }}</small>
                                    </td>

                                    <td class="align-middle font-weight-bold">
                                        @if($quote->quoted_price)
                                            <span class="text-success">${{ number_format($quote->quoted_price, 2) }}</span>
                                        @else
                                            <span class="text-muted">{{ __('Pending') }}</span>
                                        @endif
                                    </td>

                                    <td class="text-center align-middle">
                                        <span class="badge badge-{{ $badge['class'] }} px-3 py-1 text-uppercase shadow-xs"
                                              style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                            <i class="fas {{ $badge['icon'] }} mr-1"></i>
                                            {{ $quote->status }}
                                        </span>
                                    </td>

                                    <td class="text-right align-middle px-4">
                                        <div class="btn-group shadow-sm">
                                            <a href="{{ route('admin.service-quotes.show', $quote->id) }}"
                                               class="btn btn-default btn-sm text-info"
                                               data-toggle="tooltip" title="{{ __('View Details') }}">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <form action="{{ route('admin.service-quotes.destroy', $quote->id) }}"
                                                  method="POST" class="d-inline"
                                                  onsubmit="return confirm('{{ __('Delete this quote request permanently?') }}')">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-default btn-sm text-danger"
                                                        data-toggle="tooltip" title="{{ __('Delete') }}">
                                                    <i class="fas fa-trash-alt"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="8" class="text-center py-5">
                                        <i class="fas fa-file-invoice fa-3x text-muted mb-3 d-block"></i>
                                        <h5 class="text-muted font-weight-bold">{{ __('No Quote Requests Yet') }}</h5>
                                        <p class="text-secondary small">{{ __('Service quote requests submitted by customers will appear here.') }}</p>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if($serviceQuotes->hasPages())
                <div class="card-footer bg-white border-0 py-3">
                    <div class="float-right">
                        {{ $serviceQuotes->links('pagination::bootstrap-4') }}
                    </div>
                </div>
            @endif
        </div>
    </div>
@stop

@section('js')
<script>
    $(function () {
        if ($('#quotes-table tbody tr').length > 0 && !$('#quotes-table tbody tr td[colspan]').length) {
            $('#quotes-table').DataTable({
                "paging":    false,
                "searching": true,
                "ordering":  true,
                "info":      false,
                "autoWidth": false,
                "responsive": true,
                "order": [[0, "desc"]],
                dom: '<"d-flex justify-content-start ml-3 mb-3"f>rt',
                "language": {
                    "search": "",
                    "searchPlaceholder": "{{ __('Search quotes...') }}"
                },
                "columnDefs": [{ "orderable": false, "targets": [7] }]
            });
        }
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
