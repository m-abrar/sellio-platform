@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'contact']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
            <h3 class="card-title font-weight-bold">{{ __('Contact Channels') }}</h3>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-muted">{{ __('Public Support Email') }}</label>
                        <div class="input-group border rounded p-1">
                            <div class="input-group-prepend border-0"><span class="input-group-text bg-white border-0"><i class="fas fa-envelope text-primary"></i></span></div>
                            <input type="email" name="email_contact" class="form-control border-0" value="{{ old('email_contact', $settings['email_contact'] ?? '') }}">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-muted">{{ __('Official Business Phone') }}</label>
                        <div class="input-group border rounded p-1">
                            <div class="input-group-prepend border-0"><span class="input-group-text bg-white border-0"><i class="fas fa-phone text-success"></i></span></div>
                            <input type="text" name="phone_contact" class="form-control border-0" value="{{ old('phone_contact', $settings['phone_contact'] ?? '') }}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-white text-right">
            <button type="submit" class="btn btn-primary px-4 font-weight-bold shadow-sm">
                <i class="fas fa-save mr-1"></i> {{ __('Save Contact Details') }}
            </button>
        </div>
    </div>
</form>
@endsection
