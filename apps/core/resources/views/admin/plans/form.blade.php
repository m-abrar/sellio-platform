@extends('adminlte::page')

@section('title', (isset($plan) ? 'Edit' : 'Create') . ' Plan')

@section('content_header')
<div class="container-fluid">
    <div class="row mb-2">
        <div class="col-sm-6">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-boxes mr-2 text-primary"></i> 
                {{ isset($plan) ? 'Edit Plan: ' . $plan->title : 'Add New Plan' }}
            </h1>
        </div>
        <div class="col-sm-6 text-right">
            <a href="{{ route('admin.plans.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to List
            </a>
        </div>
    </div>
</div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="plan-form" 
          action="{{ isset($plan) ? route('admin.plans.update', $plan->id) : route('admin.plans.store') }}" 
          method="POST"
          enctype="multipart/form-data">
        @csrf
        @if(isset($plan)) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill" id="planTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link active px-4 py-2 rounded-pill" id="details-tab" data-toggle="tab" href="#details" role="tab">
                            <i class="fas fa-info-circle mr-1"></i> Plan Details
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link px-4 py-2 rounded-pill" id="quotas-tab" data-toggle="tab" href="#quotas" role="tab">
                            <i class="fas fa-list-ol mr-1"></i> Quotas & Features
                        </a>
                    </li>
                </ul>

                <div class="tab-content" id="planTabContent">
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        @include('admin.plans.partials.basic-info')
                        @include('admin.plans.partials.settings')
                    </div>

                    <div class="tab-pane fade" id="quotas" role="tabpanel">
                        @include('admin.plans.partials.quotas-features')
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top" style="top: 20px; z-index: 10;">
                    @include('admin.plans.partials.action-buttons')

                    <div class="card shadow-sm border-0 mt-4">
                        <div class="card-header bg-white border-bottom">
                            <h3 class="card-title font-weight-bold text-muted small text-uppercase">
                                <i class="fas fa-image mr-1 text-primary"></i> Plan Badge / Icon
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            @include('admin._partials._image-uploader', [
                                'name' => \App\Models\Plan::PRIMARY_MEDIA, 
                                'label' => 'Select Cover Image',
                                'multiple' => false,
                                'model' => \App\Models\Plan::class,
                                'id' => $plan->id ?? null,
                            ])
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    @if(isset($plan))
    {{-- Hidden Delete Form outside main form --}}
    <form id="delete-plan-form" action="{{ route('admin.plans.destroy', $plan->id) }}" method="POST" style="display: none;">
        @csrf
        @method('DELETE')
    </form>
    @endif
</div>
@endsection

@push('css')
<style>
    .sticky-top { top: 20px; }
    #planTabs.nav-pills .nav-link { color: #6c757d; font-weight: 500; transition: all 0.3s ease; }
    #planTabs.nav-pills .nav-link.active { background-color: var(--primary); color: #fff !important; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .rounded-3 { border-radius: 0.5rem !important; }
</style>
@endpush

@include('admin._partials._toggle-card-css')
