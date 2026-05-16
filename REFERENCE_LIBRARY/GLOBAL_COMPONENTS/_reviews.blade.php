{{-- Success Message --}}
@if(session('success'))
    <div class="alert alert-success d-flex align-items-center" role="alert">
        <i class="fas fa-check-circle fa-2x pr-3"></i>
        <p class="mb-0">{{ session('success') }}</p>
    </div>
@endif

{{-- Error Message --}}
@if(session('error'))
    <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="fas fa-times-circle fa-2x pr-3"></i>
        <p class="mb-0">{{ session('error') }}</p>
    </div>
@endif

{{-- Warning Message --}}
@if(session('warning'))
    <div class="alert alert-warning d-flex align-items-center" role="alert">
        <i class="fas fa-exclamation-triangle fa-2x pr-3"></i>
        <p class="mb-0">{{ session('warning') }}</p>
    </div>
@endif

{{-- Multiple Errors --}}
@if($errors->any())
    <div class="alert alert-danger d-flex align-items-center" role="alert">
        <i class="fas fa-exclamation-circle fa-2x pr-3"></i>
        @if($errors->count() > 1)
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        @else
            <p class="mb-0">{{ $errors->first() }}</p>
        @endif
    </div>
@endif


{{-- Profile Success Messages --}}
@if (session('status'))
    <div class="alert alert-success d-flex align-items-center" role="alert">
        <i class="fas fa-check-circle fa-2x pr-3"></i>
        @switch(session('status'))
            @case('profile-updated')
                {{ __('Your profile has been successfully updated!') }}
                @break
            @case('password-updated')
                {{ __('Your password has been successfully changed!') }}
                @break
            @case('avatar-updated')
                {{ __('Your avatar has been successfully updated!') }}
                @break
            @case('verification-link-sent')
                {{ __('A new verification link has been sent to your email address.') }}
                @break
            @case('account-deleted')
                {{ __('Your account has been deleted.') }}
                @break
        @endswitch
    </div>
@endif