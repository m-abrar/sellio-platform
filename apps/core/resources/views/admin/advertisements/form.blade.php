@extends('adminlte::page')

@section('title', (isset($advertisement) ? 'Edit' : 'Add') . ' Advertisement')

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-ad mr-2 text-primary"></i> 
                {{ isset($advertisement) ? 'Edit Advertisement' : 'Create New Ad' }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.advertisements.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="ad-form" 
          action="{{ isset($advertisement) ? route('admin.advertisements.update', $advertisement->id) : route('admin.advertisements.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($advertisement)) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column: Ad Details & Targeting --}}
            <div class="col-md-8">
                @include('admin.advertisements.partials._form')
            </div>

            {{-- Right Column: Actions, Image & Help --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    
                    {{-- Action Card --}}
                    @include('admin.advertisements.partials.action-buttons')

                    {{-- Image Upload Card --}}
                    <div class="card shadow-sm border-0 mt-4 overflow-hidden rounded-3">
                        <div class="card-header bg-white border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                                <i class="fas fa-image mr-1 text-primary"></i> Banner Image
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            @include('admin._partials._image-uploader', [
                                'name' => \App\Models\Advertisement::PRIMARY_MEDIA,
                                'label' => 'Select Ad Image',
                                'multiple' => false,
                                'model' => \App\Models\Advertisement::class,
                                'id' => $advertisement->id ?? null,
                            ])
                            <div class="p-3 bg-light border-top">
                                <p class="text-muted mb-1 small"><i class="fas fa-info-circle mr-1"></i> <strong>Recommended Sizes:</strong></p>
                                <ul class="list-unstyled small text-muted mb-0" style="line-height: 1.6;">
                                    <li>• <strong>General:</strong> 600x300 (2:1)</li>
                                    <li>• <strong>Header/Footer:</strong> 2000x100 (20:1)</li>
                                    <li>• <strong>Sidebar:</strong> 300x600 (1:2)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {{-- Visual Guides Card --}}
                    <div class="card shadow-sm border-0 mt-4 rounded-3 overflow-hidden">
                        <div class="card-header bg-white border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">Placement Guide</h3>
                        </div>
                        <div class="card-body p-2">
                            <div class="row no-gutters">
                                <div class="col-6 p-1">
                                    <img src="{{asset('admin/diagram-home-page.png')}}" alt="Home" class="img-fluid border rounded shadow-xs">
                                    <small class="d-block text-center mt-1 text-muted">Home</small>
                                </div>
                                <div class="col-6 p-1">
                                    <img src="{{asset('admin/diagram-search-page.png')}}" alt="Search" class="img-fluid border rounded shadow-xs">
                                    <small class="d-block text-center mt-1 text-muted">Search</small>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </form>
</div>
@endsection
