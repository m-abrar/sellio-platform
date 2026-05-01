@extends('adminlte::page')

@section('title', $subscriptionQuota->exists ? 'Edit Subscription Quotas' : 'Add Subscription Quotas')

@section('content_header')
    <h1>{{ $subscriptionQuota->exists ? 'Edit Subscription Quotas' : 'Add Subscription' }}</h1>
@stop

@section('content')

@include('admin.alert')

<div class="row pb-5">

    <!-- Left Column (Main Form) -->
    <div class="col-md-8">
        <div class="position-sticky">

            <form id="subscriptionQuota-form" 
                action="{{ $subscriptionQuota->exists ? route('admin.subscription-quotas.update', $subscriptionQuota->id) : route('admin.subscription-quotas.store') }}" 
                method="POST">
                @csrf
                @if($subscriptionQuota->exists) @method('PATCH') @endif

                <!-- Tabs Navigation -->
                <ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill" id="subscriptionTabs" role="tablist" style="width: fit-content;">
                    <li class="nav-item">
                        <a class="nav-link active px-4 py-2 rounded-pill" id="details-tab" data-toggle="tab" href="#details" role="tab">
                            <i class="fas fa-info-circle mr-1"></i> Usage Details
                        </a>
                    </li>
                </ul>

                <!-- Tabs Content -->
                <div class="tab-content" id="subscriptionTabContent">

                    <!-- Details Tab -->
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        @include('admin.subscription-quotas.partials.details')
                    </div>

                </div>

            </form>

        </div>
    </div>

    <!-- Right Column -->
    <div class="col-md-4">
        <div class="position-sticky">

            @include('admin.subscription-quotas.partials.action-buttons')

        </div>
    </div>

</div>

@endsection

@push('js')
<script>
document.addEventListener('DOMContentLoaded', function () {
    // Handle Status Toggle in Settings
    let statusSwitch = document.getElementById('statusSwitch');
    if(statusSwitch){
        statusSwitch.addEventListener('change', function(){
            this.value = this.checked ? 'active' : 'inactive';
        });
    }
});
</script>
@endpush

@push('css')
<style>
.position-sticky {
    position: sticky;
    z-index: 100;
    top: 10px !important;
}

#subscriptionTabs.nav-pills {
    flex-wrap: wrap;
    gap: 0.5rem;
}

#subscriptionTabs.nav-pills .nav-link {
    border-radius: 0.5rem;
    color: #6c757d;
    font-weight: 500;
    transition: all 0.2s ease-in-out;
    background-color: #fff;
}

#subscriptionTabs.nav-pills .nav-link:hover {
    background-color: #fff;
    color: #222 !important;
    border-radius: 0.3rem;
}

#subscriptionTabs.nav-pills .nav-link.active {
    border-bottom: 3px solid #9ACD32;
    color: #9ACD32 !important;
    font-weight: 600;
    background-color: #fff;
    border-radius: 0.3rem;
    box-shadow: 0 2px 4px rgba(13,110,253,0.2);
}
</style>
@endpush
