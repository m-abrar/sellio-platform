@extends('adminlte::page')

@section('title', $LineItem->exists ? 'Edit Line Item' : 'Add Line Item')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                     {{ $LineItem->exists ? 'Edit Line Item' : 'Add Line Item' }}
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ $LineItem->exists ? route('admin.line-items.update', $LineItem->id) : route('admin.line-items.store') }}" method="POST">
    @csrf
    @if($LineItem->exists) @method('PATCH') @endif

    <div class="row">
        <!-- Left Column (Main Form) -->
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header border-0 bg-white py-3"><h3 class="card-title">Line Item Details</h3></div>
                <div class="card-body">

                    <div class="form-group">
                        <label for="title">Name <span class="text-danger">*</span></label>
                        <input type="text" name="title" id="title" class="form-control @error('title') is-invalid @enderror" 
                               value="{{ old('title', $LineItem->title ?? '') }}" required>
                        @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="type">Type <span class="text-danger">*</span></label>
                        <select name="type" id="type" class="form-control @error('type') is-invalid @enderror">
                            <option value="fixed" {{ old('type', $LineItem->type ?? '') == 'fixed' ? 'selected' : '' }}>Flat Rate</option>
                            <option value="percentage" {{ old('type', $LineItem->type ?? '') == 'percentage' ? 'selected' : '' }}>Percentage</option>
                        </select>
                        @error('type') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="amount">Amount/Value <span class="text-danger">*</span></label>
                        <input type="number" name="amount" id="amount" class="form-control @error('amount') is-invalid @enderror" 
                               value="{{ old('amount', $LineItem->amount ?? '') }}" required>
                        @error('amount') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="applies_on">Applies On <span class="text-danger">*</span></label>
                        <select name="applies_on" id="applies_on" class="form-control @error('applies_on') is-invalid @enderror">
                            <option value="booking" {{ old('applies_on', $LineItem->applies_on ?? '') == 'booking' ? 'selected' : '' }}>Booking</option>
                            <option value="service" {{ old('applies_on', $LineItem->applies_on ?? '') == 'service' ? 'selected' : '' }}>Service</option>
                            <option value="item" {{ old('applies_on', $LineItem->applies_on ?? '') == 'item' ? 'selected' : '' }}>Item</option>
                        </select>
                        @error('applies_on') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label>Status</label>
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="statusSwitch" name="status" value="active" 
                                   {{ $LineItem->exists && $LineItem->status == 'active' ? 'checked' : '' }}>
                            <label class="custom-control-label" for="statusSwitch">Active</label>
                        </div>
                    </div>

                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Line Item
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-4">
            <!-- Image or Icon -->
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\LineItem::PRIMARY_MEDIA,
                'label' => 'Icon (Optional)',
                'multiple' => false,
                'model' => \App\Models\LineItem::class,
                'id' => $LineItem->id ?? null,
            ])
        </div>
    </div>
</form>
@endsection

@push('js')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Handle Status Toggle
        let statusSwitch = document.getElementById('statusSwitch');
        if (statusSwitch) {
            statusSwitch.addEventListener('change', function () {
                this.value = this.checked ? 'active' : 'inactive';
            });
        }
    });
</script>
@endpush

@push('css')
    
@endpush
