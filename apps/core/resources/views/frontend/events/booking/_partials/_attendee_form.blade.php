<form id="attendee-form" method="POST" action="{{ route('events.tickets.booking.update_details', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}">
    @csrf
    @method('PUT') {{-- Assuming you use PUT/PATCH for updates --}}
    
    <div class="row g-3">
        <div class="col-md-6">
            <label for="user_name" class="form-label">Full Name <span class="text-danger">*</span></label>
            {{-- Pre-fill with booking data, falling back to authenticated user data --}}
            <input type="text" 
                   class="form-control @error('user_name') is-invalid @enderror" 
                   id="user_name" 
                   name="user_name" 
                   value="{{ old('user_name', $booking->user_name ?? $user->name ?? '') }}" 
                   required>
            @error('user_name')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="col-md-6">
            <label for="user_email" class="form-label">Email Address <span class="text-danger">*</span></label>
            <input type="email" 
                   class="form-control @error('user_email') is-invalid @enderror" 
                   id="user_email" 
                   name="user_email" 
                   value="{{ old('user_email', $booking->user_email ?? $user->email ?? '') }}" 
                   required>
            @error('user_email')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>

        <div class="col-md-6">
            <label for="user_phone" class="form-label">Phone Number (Optional)</label>
            <input type="text" 
                   class="form-control @error('user_phone') is-invalid @enderror" 
                   id="user_phone" 
                   name="user_phone" 
                   value="{{ old('user_phone', $booking->user_phone ?? $booking->user->phone ?? '') }}">
            @error('user_phone')<div class="invalid-feedback">{{ $message }}</div>@enderror
        </div>
        
        <div class="col-12 text-end">
            <button type="submit" class="btn btn-sm btn-outline-secondary">Update Details</button>
        </div>
    </div>
</form>
