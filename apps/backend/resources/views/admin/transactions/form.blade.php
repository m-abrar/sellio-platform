{{--
    Administrative Finance: Transaction Configuration
    
    This view facilitates the manual entry and modification of financial 
    transaction records. It handles reference number mapping, valuation 
    parameters, status lifecycle management, and enables the attachment 
    of visual evidence (screenshots) for payment verification.
    
    @extends adminlte::page
    @context Financial Operations
    @variables Transaction $transaction The transaction model instance.
--}}
@extends('adminlte::page')

@section('title', $transaction->exists ? 'Edit Transaction' : 'Add Transaction')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                     {{ $transaction->exists ? 'Edit Transaction' : 'Add Transaction' }}
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ $transaction->exists ? route('admin.transactions.update', $transaction->id) : route('admin.transactions.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @if($transaction->exists) @method('PATCH') @endif

    <div class="row">
        <!-- Left Column (Main Form) -->
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-header border-0 bg-white py-3"><h3 class="card-title">Transaction Details</h3></div>
                <div class="card-body">
                    
                    <div class="form-group">
                        <label for="reference_number">Reference Number <span class="text-danger">*</span></label>
                        <input type="text" name="reference_number" id="reference_number" class="form-control @error('reference_number') is-invalid @enderror" 
                               value="{{ old('reference_number', $transaction->reference_number ?? '') }}" required>
                        @error('reference_number') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="amount">Amount <span class="text-danger">*</span></label>
                        <input type="number" name="amount" id="amount" class="form-control @error('amount') is-invalid @enderror"
                               value="{{ old('amount', $transaction->amount ?? '') }}" required>
                        @error('amount') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="status">Status</label>
                        <select name="status" id="status" class="form-control @error('status') is-invalid @enderror">
                            <option value="completed" {{ old('status', $transaction->status ?? '') == 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="pending" {{ old('status', $transaction->status ?? '') == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="failed" {{ old('status', $transaction->status ?? '') == 'failed' ? 'selected' : '' }}>Failed</option>
                        </select>
                        @error('status') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea name="description" class="form-control @error('description') is-invalid @enderror">{{ old('description', $transaction->description ?? '') }}</textarea>
                        @error('description') <span class="invalid-feedback">{{ $message }}</span> @enderror
                    </div>

                    <div class="text-right">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-4">
        
            @include('admin.transactions.partials.booking')

            <!-- Transaction Screenshot -->
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\Transaction::PRIMARY_MEDIA,
                'label' => 'Transaction Screenshot',
                'multiple' => false,
                'model' => 'transaction',
                'id' => $transaction->id ?? null,
            ])

        </div>
    </div>
</form>

@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/transactions-form.js') }}"></script>
@endpush

@push('css')
    
@endpush
