@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'contact']) }}" method="POST">
    @csrf
    <div class="card border-0 shadow-premium" style="border-radius: 24px;">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-headset mr-2 text-primary opacity-50"></i> {{ __('Contact Channels & Intelligence') }}
            </h3>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Configure support communication protocols and official platform contact points.') }}</p>
        </div>
        <div class="card-body px-4">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Public Support Email') }}</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-envelope text-primary"></i></span>
                            </div>
                            <input type="email" name="email_contact" class="form-control" value="{{ old('email_contact', $settings['email_contact'] ?? '') }}">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2" style="letter-spacing: 0.5px;">{{ __('Official Business Phone') }}</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-phone text-success"></i></span>
                            </div>
                            <input type="text" name="phone_contact" class="form-control" value="{{ old('phone_contact', $settings['phone_contact'] ?? '') }}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer bg-light py-4 px-4 border-0 text-right">
            <button type="submit" class="btn btn-primary rounded-pill px-5 font-weight-bold shadow-sm">
                <i class="fas fa-save mr-2"></i> {{ __('Save Contact Details') }}
            </button>
        </div>
    </div>
</form>
@endsection
