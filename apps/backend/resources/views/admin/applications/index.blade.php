@extends('adminlte::page')

@section('title', 'Theme Manager')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-palette mr-2 text-primary"></i> Visual Theme Manager
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Theme Manager</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    {{-- Strategy Section --}}
    <div class="row mb-4">
        <div class="col-12">
            <div class="card bg-white border-0 shadow-sm overflow-hidden" style="border-radius: 12px;">
                <div class="card-body p-0">
                    <div class="d-flex align-items-center">
                        <div class="bg-indigo px-4 d-flex align-items-center justify-content-center" style="align-self: stretch;">
                            <i class="fas fa-wand-magic-sparkles text-white fa-2x"></i>
                        </div>
                        <div class="p-3">
                            <h5 class="mb-1 font-weight-bold">UI Customization Engine</h5>
                            <p class="mb-0 text-muted small">Hot-swap the frontend identity. Activating a theme updates CSS variables, layout structures, and blade component mappings globally.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    

    <div class="row">
        @forelse($applications as $application)
            <div class="col-sm-12 col-md-6 col-lg-4 mb-4">
                <div class="card h-100 theme-card shadow-sm border-0 {{ $application->is_active ? 'active-border' : '' }}">
                    {{-- Theme Preview Thumbnail --}}
                    <div class="position-relative overflow-hidden theme-thumbnail-container">
                        <img src="{{ asset('frontend/images/preview.png') }}"
                             class="card-img-top" 
                             alt="{{ $application->title }}"
                             style="height: 220px; object-fit: cover; transition: all 0.5s ease;">
                        
                        <div class="theme-overlay">
                             <a href="{{ url('/?theme=' . $application->app_key) }}" target="_blank" class="btn btn-light btn-sm font-weight-bold px-3 shadow">
                                <i class="fas fa-eye mr-1"></i> Live Preview
                             </a>
                        </div>

                        @if($application->is_active)
                            <div class="active-status-ribbon">
                                <i class="fas fa-check-circle mr-1"></i> ACTIVE
                            </div>
                        @endif
                    </div>

                    <div class="card-body py-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="font-weight-bold text-dark mb-0">{{ $application->title }}</h6>
                            <code class="text-xs px-2 py-0 bg-light border rounded">{{ $application->app_key }}</code>
                        </div>
                        <p class="text-muted mb-0" style="font-size: 0.8rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            {{ $application->description ?? 'Standard UI skin with optimized layout components and responsive design grids.' }}
                        </p>
                    </div>

                    <div class="card-footer bg-white border-0 pt-0 pb-3">
                        <div class="d-flex align-items-center">
                            @if(!$application->is_active)
                                <form action="{{ route('admin.applications.activate', $application->id) }}" method="POST" class="flex-grow-1 mr-2">
                                    @csrf
                                    <button class="btn btn-primary btn-sm btn-block font-weight-bold shadow-xs" type="submit">
                                        Activate Theme
                                    </button>
                                </form>
                            @else
                                <button class="btn btn-success btn-sm btn-block font-weight-bold shadow-xs flex-grow-1 mr-2" disabled>
                                    <i class="fas fa-check mr-1"></i> Selected
                                </button>
                            @endif

                            <a href="{{ route('admin.applications.edit', $application->id) }}" 
                               class="btn btn-outline-secondary btn-sm" 
                               data-toggle="tooltip" title="Theme Settings">
                                <i class="fas fa-cog"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-12 text-center py-5">
                <i class="fas fa-fill-drip fa-4x text-light mb-3"></i>
                <h5 class="text-muted font-weight-bold">No Themes Available</h5>
                <p class="text-secondary small">Ensure themes are correctly symlinked to the public storage directory.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection

@section('css')
<style>
    .bg-indigo { background-color: #6610f2; }
    .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .text-xs { font-size: 0.7rem; }
    
    .theme-card {
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        background: #fff;
    }

    .theme-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
    }

    .active-border {
        border: 2px solid #007bff !important;
    }

    .theme-thumbnail-container {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    /* Hover Overlay Effect */
    .theme-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .theme-card:hover .theme-overlay {
        opacity: 1;
    }

    .theme-card:hover .card-img-top {
        transform: scale(1.05);
    }

    /* Active Ribbon */
    .active-status-ribbon {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background: #28a745;
        color: #fff;
        padding: 4px 12px;
        border-radius: 30px;
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.15);
    }

    .btn-block { border-radius: 8px; }
</style>
@endsection

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@endsection
