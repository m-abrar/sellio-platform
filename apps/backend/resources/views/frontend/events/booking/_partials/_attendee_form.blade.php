<form id="attendee-form" method="POST" action="{{ route('events.tickets.booking.update_details', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}">
    @csrf
    @method('PUT')

    <div class="row g-3 g-md-4">
        <div class="col-md-6">
            <label for="user_name" class="filter-label mb-2">{{ __('Full Name') }} <span class="text-danger">*</span></label>
            <div class="input-group unified-input @error('user_name') is-invalid @enderror">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input type="text"
                       class="form-control @error('user_name') is-invalid @enderror"
                       id="user_name"
                       name="user_name"
                       value="{{ old('user_name', $booking->user_name ?? $user->name ?? '') }}"
                       required>
            </div>
            @error('user_name')<div class="invalid-feedback d-block">{{ $message }}</div>@enderror
        </div>

        <div class="col-md-6">
            <label for="user_email" class="filter-label mb-2">{{ __('Email Address') }} <span class="text-danger">*</span></label>
            <div class="input-group unified-input @error('user_email') is-invalid @enderror">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input type="email"
                       class="form-control @error('user_email') is-invalid @enderror"
                       id="user_email"
                       name="user_email"
                       value="{{ old('user_email', $booking->user_email ?? $user->email ?? '') }}"
                       required>
            </div>
            @error('user_email')<div class="invalid-feedback d-block">{{ $message }}</div>@enderror
        </div>

        <div class="col-md-6">
            <label for="user_phone" class="filter-label mb-2">{{ __('Phone Number') }} <span class="text-muted fw-normal">({{ __('optional') }})</span></label>
            <div class="input-group unified-input @error('user_phone') is-invalid @enderror">
                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                <input type="text"
                       class="form-control @error('user_phone') is-invalid @enderror"
                       id="user_phone"
                       name="user_phone"
                       value="{{ old('user_phone', $booking->user_phone ?? $booking->user->phone ?? '') }}">
            </div>
            @error('user_phone')<div class="invalid-feedback d-block">{{ $message }}</div>@enderror
        </div>

        <div class="col-12 text-end">
            <button type="submit" class="btn btn-outline-primary-theme rounded-pill px-4 fw-bold">
                <i class="bi bi-arrow-repeat me-1"></i>{{ __('Update Details') }}
            </button>
        </div>
    </div>
</form>
