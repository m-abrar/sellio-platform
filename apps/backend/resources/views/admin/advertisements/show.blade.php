{{--
    Administrative Marketing Module: Ad Impression Intelligence
    
    This view provides a comprehensive audit trail and visual preview 
    for a specific advertisement. It facilitates the inspection of 
    technical metadata, geospatial targeting parameters, and placement 
    orientations, ensuring campaign accuracy before live deployment.
    
    @extends adminlte::page
    @context Marketing Management
    @variables Advertisement $advertisement The advertisement model instance.
--}}
@extends('adminlte::page')

@section('title', 'Ad Details: ' . $advertisement->title)

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-eye mr-2 text-primary"></i> Advertisement Details
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.advertisements.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
            <a href="{{ route('admin.advertisements.edit', $advertisement->id) }}" class="btn btn-primary btn-flat btn-sm shadow-sm ml-2">
                <i class="fas fa-edit mr-1"></i> Edit Advertisement
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid pb-5">
    <div class="row">
        {{-- Left Column: Technical & Targeting Data --}}
        <div class="col-md-8">
            {{-- General Info Card --}}
            <div class="card shadow-sm rounded-10 border-0 mb-4">
                <div class="card-header bg-white border-bottom">
                    <h3 class="card-title font-weight-bold text-dark">General Information</h3>
                </div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <tr>
                            <th class="border-top-0 w-25">Title</th>
                            <td class="border-top-0">{{ $advertisement->title }}</td>
                        </tr>
                        <tr>
                            <th>Link</th>
                            <td>
                                <a href="{{ $advertisement->link }}" target="_blank" class="text-primary">
                                    {{ $advertisement->link }} <i class="fas fa-external-link-alt fa-xs ml-1"></i>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <th>Description</th>
                            <td>{{ $advertisement->description ?? 'No description provided.' }}</td>
                        </tr>
                    </table>
                </div>
            </div>

            {{-- Location Targeting Card --}}
            <div class="card shadow-sm rounded-10 border-0 mb-4">
                <div class="card-header bg-white border-bottom">
                    <h3 class="card-title font-weight-bold text-dark">Targeting Metrics</h3>
                </div>
                <div class="card-body">
                    <div class="row text-center mb-4">
                        <div class="col-md-4 border-right">
                            <label class="text-muted small text-uppercase d-block">Latitude</label>
                            <span class="font-weight-bold h5">{{ $advertisement->latitude ?? 'N/A' }}</span>
                        </div>
                        <div class="col-md-4 border-right">
                            <label class="text-muted small text-uppercase d-block">Longitude</label>
                            <span class="font-weight-bold h5">{{ $advertisement->longitude ?? 'N/A' }}</span>
                        </div>
                        <div class="col-md-4">
                            <label class="text-muted small text-uppercase d-block">Radius</label>
                            <span class="badge badge-primary px-3 py-2 font-1-0"> {{ $advertisement->radius ?? 5 }} KM</span>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group mb-0">
                        <label class="text-muted small text-uppercase">Geographic Reach</label>
                        <p><strong>Cities:</strong> {{ is_array($advertisement->cities) ? implode(', ', $advertisement->cities) : ($advertisement->cities ?? 'Global') }}</p>
                        <p><strong>Zip Codes:</strong> {{ is_array($advertisement->zipcodes) ? implode(', ', $advertisement->zipcodes) : ($advertisement->zipcodes ?? 'Global') }}</p>
                        <p class="mb-0"><strong>Regions:</strong> {{ is_array($advertisement->regions) ? implode(', ', $advertisement->regions) : ($advertisement->regions ?? 'Global') }}</p>
                    </div>
                </div>
            </div>

            {{-- Visual Orientations Display --}}
            <div class="card shadow-sm rounded-10 border-0">
                <div class="card-header bg-white border-bottom">
                    <h3 class="card-title font-weight-bold text-dark">Active Placements</h3>
                </div>
                <div class="card-body">
                    <div class="row orientation-grid text-center">
                        @foreach ([
                            'header' => 'header-tile',
                            'homepage-a' => 'home-tile', 'homepage-b' => 'home-tile', 'homepage-c' => 'home-tile',
                            'homepage-d' => 'home-tile', 'homepage-e' => 'home-tile', 'homepage-f' => 'home-tile',
                            'searchpage' => 'search-tile', 'sidebar' => 'sidebar-tile',
                            'footer' => 'footer-tile'
                        ] as $orientation => $class)
                            @if(in_array($orientation, $advertisement->orientations ?? []))
                            <div class="col-md-3 col-6 mb-3">
                                <div class="tile-box {{ $class }} shadow-sm opacity-100 border-2-success">
                                    <div class="tile-check-icon d-block"><i class="fas fa-check-circle"></i></div>
                                    <span class="tile-label">{{ strtoupper(str_replace('-', ' ', $orientation)) }}</span>
                                </div>
                            </div>
                            @endif
                        @endforeach
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Status & Media --}}
        <div class="col-md-4">
            {{-- Status Card --}}
            <div class="card shadow-sm border-0 rounded-lg overflow-hidden mb-4">
                <div class="card-header {{ $advertisement->status ? 'bg-success' : 'bg-secondary' }} py-3">
                    <h3 class="card-title text-white font-weight-bold w-100 text-center">
                        <i class="fas {{ $advertisement->status ? 'fa-check-circle' : 'fa-times-circle' }} mr-2"></i>
                        AD IS {{ $advertisement->status ? 'ACTIVE' : 'INACTIVE' }}
                    </h3>
                </div>
                <div class="card-body bg-white p-3 text-center">
                    <p class="text-muted small mb-0">Created on {{ $advertisement->created_at->format('M d, Y') }}</p>
                    <p class="text-muted small">Last updated {{ $advertisement->updated_at->diffForHumans() }}</p>
                </div>
            </div>

            {{-- Ad Preview Card --}}
            <div class="card shadow-sm border-0 rounded-10 overflow-hidden">
                <div class="card-header bg-white border-bottom">
                    <h3 class="card-title font-weight-bold text-muted small text-uppercase">Ad Banner</h3>
                </div>
                <div class="card-body p-2 bg-light text-center">
                    @if($advertisement->primary_image_url)
                        <img src="{{ $advertisement->primary_image_url }}" 
                             alt="{{ $advertisement->title }}" 
                             class="img-fluid rounded shadow-sm border">
                    @else
                        <div class="py-5 text-muted font-italic">
                            <i class="fas fa-image fa-3x mb-3 d-block opacity-25"></i>
                            No image uploaded
                        </div>
                    @endif
                </div>
                <div class="card-footer bg-white">
                    <a href="{{ $advertisement->link }}" target="_blank" class="btn btn-outline-primary btn-block btn-sm">
                        Test Link Path
                    </a>
                </div>
            </div>

            {{-- Guide Images (Mini Reference) --}}
            <div class="row mt-4">
                <div class="col-6">
                    <img src="{{asset('admin-assets/diagram-home-page.png')}}" class="img-fluid border rounded grayscale shadow-xs">
                </div>
                <div class="col-6">
                    <img src="{{asset('admin-assets/diagram-search-page.png')}}" class="img-fluid border rounded grayscale shadow-xs">
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
