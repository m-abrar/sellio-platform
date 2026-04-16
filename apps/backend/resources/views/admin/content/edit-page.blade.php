@extends('adminlte::page')

{{-- Professional Title following the Executive Persona --}}
@section('title', 'Content Engine | ' . Str::of($theme_key)->replace('_', ' ')->title())

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-2">
        <h1 class="font-weight-bold text-dark">
            <i class="fas fa-edit mr-2 text-primary"></i> 
            Content Engine: {{ ucfirst($page) }}
            <small class="d-block d-md-inline-block ml-md-3 text-muted lead">Theme Architecture</small>
        </h1>
        <div class="d-none d-md-block">
            <a href="{{ route('admin.content.index') }}" class="btn btn-outline-secondary btn-sm rounded-pill px-3 shadow-sm transition-hover">
                <i class="fas fa-arrow-left mr-1"></i> Back to Fleet
            </a>
        </div>
    </div>
@stop

@section('content')
<div class="dashboard-blueprint pb-5">
    @include('admin.alert')

    <form method="POST" action="{{ route('admin.content.bulk_update') }}" enctype="multipart/form-data">
        @csrf

        <div class="row">
            {{-- MAIN CONFIGURATION AREA --}}
            <div class="col-md-8">
                {{-- Loop through settings grouped by section --}}
                @foreach ($settings as $sectionName => $sectionSettings)
                    <div class="section-header {{ !$loop->first ? 'mt-5' : '' }}">
                        <span class="dot bg-primary"></span>
                        <h5 class="text-uppercase font-weight-bold text-secondary">
                            {{ ucfirst(str_replace('_', ' ', $sectionName)) }} Configuration
                        </h5>
                    </div>

                    <div class="card border-0 shadow-sm mb-4 overflow-hidden">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th style="width: 35%" class="border-0 text-uppercase small font-weight-bold text-muted px-4 py-3">Property</th>
                                            <th style="width: 65%" class="border-0 text-uppercase small font-weight-bold text-muted px-4 py-3">Value / Asset</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($sectionSettings as $item)
                                            <tr class="transition-hover">
                                                <td class="px-4 py-4 border-0">
                                                    <div class="d-flex align-items-center">
                                                        <div class="icon-circle bg-primary-light text-primary mr-3" style="width: 35px; height: 35px; font-size: 0.8rem;">
                                                            <i class="fas {{ $item->input_type === 'textarea' ? 'fa-align-left' : ($item->input_type === 'image' ? 'fa-image' : 'fa-pen-fancy') }}"></i>
                                                        </div>
                                                        <div>
                                                            <span class="d-block font-weight-bold text-dark">
                                                                {{ Str::of($item->content_key)->replace('_', ' ')->title() }}
                                                            </span>
                                                            <small class="text-muted text-uppercase" style="font-size: 10px;">{{ $item->input_type }}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-4 border-0">
                                                    @include('admin.content._partials._editor_input_factory', ['item' => $item])
                                                </td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            {{-- SIDEBAR CONTROL PANEL --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px;">
                    <div class="card border-0 shadow-sm bg-dark overflow-hidden mb-4">
                        <div class="card-header border-0 bg-transparent py-3" style="border-bottom: 3px solid #3498db !important;">
                            <h6 class="m-0 font-weight-bold text-white text-uppercase" style="letter-spacing: 1px;">
                                <i class="fas fa-layer-group mr-2 text-info"></i>Deployment Context
                            </h6>
                        </div>
                        <div class="card-body bg-white py-4 text-center">
                             <div class="mb-3">
                                <span class="badge badge-pill badge-primary-light text-primary px-4 py-2 border">
                                    {{ Str::of($theme_key)->replace('_', ' ')->title() }}
                                </span>
                             </div>
                             <p class="text-muted small">You are currently editing the global content for the <strong>{{ $page }}</strong> view.</p>
                             
                             <hr>

                             <button type="submit" class="btn btn-primary btn-block btn-lg shadow-sm font-weight-bold py-3 text-uppercase" style="letter-spacing: 1px;">
                                <i class="fas fa-save mr-2"></i> Publish Changes
                            </button>
                        </div>
                        <div class="card-footer bg-light border-0 text-center py-2">
                            <small class="text-muted font-weight-bold uppercase" style="font-size: 10px;">
                                <i class="fas fa-info-circle mr-1"></i> Live Mode Active
                            </small>
                        </div>
                    </div>

                    {{-- Helper Card --}}
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-3 d-flex align-items-center bg-primary-light rounded">
                            <i class="fas fa-lightbulb text-primary mr-3"></i>
                            <p class="mb-0 small text-primary font-weight-bold">
                                Quick Tip: Images are automatically optimized upon upload to ensure fast page speeds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
