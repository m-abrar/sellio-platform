@extends('adminlte::page')

@section('title', 'System Settings')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-sliders-h mr-2 text-primary"></i>{{ __('System Configuration') }}
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="row">
        <div class="col-md-3">
            <div class="card card-outline card-primary shadow-sm border-0 sticky-top" style="top: 20px;">
                <div class="card-header bg-white">
                    <h3 class="card-title font-weight-bold">{{ __('Navigation') }}</h3>
                </div>
                <div class="card-body p-2">
                    <ul class="nav nav-pills flex-column settings-nav">
                        @php $currentSection = collect(request()->segments())->last() ?? 'general'; @endphp
                        
                        @foreach(['general', 'modules', 'contact', 'SEO', 'social', 'pages', 'apis'] as $section)
                        <li class="nav-item mb-1">
                            <a href="{{ route('admin.settings.group', ['section' => $section]) }}" 
                               class="nav-link py-2 @if($currentSection == $section) active shadow-sm @endif">
                                <i class="fas fa-{{ match(strtolower($section)) { 
                                    'general' => 'cog', 
                                    'modules' => 'cubes', 
                                    'contact' => 'address-book', 
                                    'seo' => 'search-dollar', 
                                    'social' => 'share-nodes', 
                                    'pages' => 'file-lines', 
                                    'apis' => 'microchip', 
                                    default => 'circle' 
                                } }} mr-2"></i>
                                {{ ucwords(str_replace('-', ' ', $section)) }}
                            </a>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        <div class="col-md-9">
            <div class="settings-content-wrapper">
                @yield('setting-form-content')
            </div>
        </div>
    </div>
</div>
@endsection

@push('css')
<style>
    .settings-nav .nav-link { color: #555; font-weight: 500; transition: all 0.2s; border-radius: 8px; }
    .settings-nav .nav-link:hover { background: #f4f6f9; color: #007bff; }
    .settings-nav .nav-link.active { background-color: #007bff !important; }
    .card {  }
    .form-control:focus { border-color: #007bff; box-shadow: none; }
</style>
@endpush
