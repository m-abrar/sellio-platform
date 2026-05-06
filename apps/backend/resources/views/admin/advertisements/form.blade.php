@extends('adminlte::page')

@section('title', ($advertisement->exists ? 'Edit' : 'Add') . ' Advertisement')

@section('content_header')
<div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-ad mr-2 text-primary"></i> 
                {{ $advertisement->exists ? 'Edit Advertisement' : 'Create New Campaign' }}
            </h1>
            <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                {{ $advertisement->exists ? 'Modify campaign parameters, creative assets, and targeting logic.' : 'Initialize a new marketing campaign with custom creative and placement rules.' }}
            </p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.advertisements.index') }}" class="btn btn-back shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to Ledger
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form id="ad-form" 
          action="{{ $advertisement->exists ? route('admin.advertisements.update', $advertisement->id) : route('admin.advertisements.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($advertisement->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Left Column: Ad Details & Targeting --}}
            <div class="col-md-8">
                @include('admin.advertisements.partials._form')
            </div>

            {{-- Right Column: Actions, Image & Help --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $advertisement,
                    'title' => 'AD',
                    'back' => 'admin.advertisements.index'
                ])

                {{-- Image Upload Card --}}
                <div class="card border-0 shadow-premium mt-4 mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-image mr-2 text-primary opacity-50"></i> Creative Banner
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Advertisement::PRIMARY_MEDIA,
                            'label' => 'Select Ad Image',
                            'multiple' => false,
                            'model' => \App\Models\Advertisement::class,
                            'id' => $advertisement->id ?? null,
                            'noCard' => true,
                        ])
                        <div class="p-4 bg-light border-top">
                            <p class="text-muted mb-2 small uppercase letter-spacing-1"><strong>Recommended Sizes:</strong></p>
                            <ul class="list-unstyled small text-muted mb-0 leading-relaxed">
                                <li>• <strong>General:</strong> 600x300 (2:1)</li>
                                <li>• <strong>Header/Footer:</strong> 2000x100 (20:1)</li>
                                <li>• <strong>Sidebar:</strong> 300x600 (1:2)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {{-- Visual Guides Card --}}
                <div class="card border-0 shadow-premium mt-4 mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Placement Guide</h3>
                    </div>
                    <div class="card-body p-3">
                        <div class="row no-gutters">
                            <div class="col-6 p-1 text-center">
                                <img src="{{asset('admin-assets/diagram-home-page.png')}}" alt="Home" class="img-fluid border guide-img shadow-sm rounded-xl">
                                <small class="d-block mt-2 text-muted smallest uppercase letter-spacing-1">Home Feed</small>
                            </div>
                            <div class="col-6 p-1 text-center">
                                <img src="{{asset('admin-assets/diagram-search-page.png')}}" alt="Search" class="img-fluid border guide-img shadow-sm rounded-xl">
                                <small class="d-block mt-2 text-muted smallest uppercase letter-spacing-1">Search Ops</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@stop
@stop

@section('js')
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
</script>
@stop
