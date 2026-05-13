{{--
    Administrative Feedback Alert System
    
    This partial orchestrates the display of session-based notifications 
    (Success, Error, Warning, Status) and form validation errors.
    It uses animated transitions and premium glassmorphic styling to 
    provide a non-intrusive yet highly visible feedback loop.
--}}
@php
    $alerts = [
        ['key' => 'success', 'type' => 'success', 'icon' => 'check-circle'],
        ['key' => 'error', 'type' => 'danger', 'icon' => 'times-circle'],
        ['key' => 'warning', 'type' => 'warning', 'icon' => 'exclamation-triangle'],
        ['key' => 'status', 'type' => 'success', 'icon' => 'info-circle'],
    ];
@endphp

@foreach($alerts as $alert)
    @if(session($alert['key']))
        <div class="alert alert-{{ $alert['type'] }}-light alert-premium animate__animated animate__fadeInDown border-0 shadow-sm d-flex align-items-center p-3 mb-4 alert-border-{{ $alert['type'] }}" role="alert">
            <div class="icon-box-soft bg-{{ $alert['type'] }}-soft text-{{ $alert['type'] }} mr-3 shadow-xs alert-icon-box">
                <i class="fas fa-{{ $alert['icon'] }} fa-lg"></i>
            </div>
            <div class="alert-content">
                <h6 class="font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1">{{ strtoupper($alert['key']) }} {{ __('NOTIFICATION') }}</h6>
                <p class="mb-0 text-secondary small font-weight-600">
                    @if($alert['key'] === 'status')
                        @switch(session('status'))
                            @case('profile-updated') {{ __('Your profile has been successfully updated!') }} @break
                            @case('password-updated') {{ __('Your password has been successfully changed!') }} @break
                            @case('avatar-updated') {{ __('Your avatar has been successfully updated!') }} @break
                            @case('verification-link-sent') {{ __('A new verification link has been sent to your email address.') }} @break
                            @case('account-deleted') {{ __('Your account has been deleted.') }} @break
                            @default {{ session('status') }}
                        @endswitch
                    @else
                        {{ session($alert['key']) }}
                    @endif
                </p>
            </div>
            <button type="button" class="close ml-auto opacity-50" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    @endif
@endforeach

{{-- Impersonation Notification --}}
@if(Session::has('impersonate_original_user_id'))
    <div class="alert alert-primary-light alert-premium border-0 shadow-premium d-flex align-items-center p-3 mb-4 alert-border-primary" role="alert" style="position: relative; z-index: 9999;">
        <div class="icon-box bg-primary text-white mr-3 shadow-lg alert-icon-box">
            <i class="fas fa-user-secret fa-lg"></i>
        </div>
        <div class="alert-content">
            <h6 class="font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">{{ __('IMPERSONATION MODE ACTIVE') }}</h6>
            <p class="mb-0 text-secondary small font-weight-600">
                {{ __('You are currently logged in as') }} <strong>{{ Auth::user()->name }}</strong>.
            </p>
        </div>
        <div class="ml-auto">
            <a href="{{ route('admin.users.stop-impersonating') }}" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-sm">
                <i class="fas fa-sign-out-alt mr-1"></i> {{ __('STOP IMPERSONATION') }}
            </a>
        </div>
    </div>
@endif

{{-- Validation Errors --}}
@if($errors->any())
    <div class="alert alert-danger-light alert-premium animate__animated animate__shakeX border-0 shadow-sm d-flex align-items-start p-3 mb-4 alert-border-danger" role="alert">
        <div class="icon-box-soft bg-danger-soft text-danger mr-3 shadow-xs alert-icon-box">
            <i class="fas fa-exclamation-circle fa-lg"></i>
        </div>
        <div class="alert-content">
            <h6 class="font-weight-bold text-dark mb-1 smallest text-uppercase letter-spacing-1">{{ __('VALIDATION ERRORS') }}</h6>
            @if($errors->count() > 1)
                <ul class="mb-0 text-secondary small font-weight-600 ps-0 list-unstyled">
                    @foreach ($errors->all() as $error)
                        <li><i class="fas fa-caret-right mr-1 opacity-50"></i> {{ $error }}</li>
                    @endforeach
                </ul>
            @else
                <p class="mb-0 text-secondary small font-weight-600">{{ $errors->first() }}</p>
            @endif
        </div>
        <button type="button" class="close ml-auto opacity-50" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
@endif

