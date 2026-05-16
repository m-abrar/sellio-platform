<div class="sticky-top">
    <div class="card glass-surface border-0 shadow-lg p-4 mb-4">
        <h4 class="fw-800 text-dark mb-1">Book Consultation</h4>
        <p class="text-muted small mb-4">Response time: Usually within 24h</p>

        <form action="{{ route('services.consultation.store', $service->slug) }}" method="POST">
            @csrf
            
            {{-- Name Field --}}
            <div class="form-floating mb-3">
                <input type="text" 
                       name="name" 
                       class="form-control glass-input @error('name') is-invalid @enderror" 
                       id="floatingName" 
                       placeholder="Name" 
                       value="{{ old('name', auth()->user()->name ?? '') }}" 
                       required>
                <label for="floatingName">Full Name</label>
                @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
            </div>

            {{-- Email Field --}}
            <div class="form-floating mb-3">
                <input type="email" 
                       name="email" 
                       class="form-control glass-input @error('email') is-invalid @enderror" 
                       id="floatingEmail" 
                       placeholder="Email" 
                       value="{{ old('email', auth()->user()->email ?? '') }}" 
                       required>
                <label for="floatingEmail">Email Address</label>
                @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
            </div>

            {{-- Phone Field --}}
            <div class="form-floating mb-3">
                <input type="tel" 
                       name="phone" 
                       class="form-control glass-input @error('phone') is-invalid @enderror" 
                       id="floatingPhone" 
                       placeholder="Phone Number" 
                       value="{{ old('phone', auth()->user()->phone ?? '') }}" 
                       required>
                <label for="floatingPhone">Phone Number</label>
                @error('phone') <div class="invalid-feedback">{{ $message }}</div> @enderror
            </div>

            {{-- Topic / Interest --}}
            <div class="mb-4">
                <label class="small fw-bold text-muted mb-2">Primary Interest</label>
                <select name="topic" class="form-select glass-input py-3 @error('topic') is-invalid @enderror" required>
                    <option value="" disabled {{ old('topic') ? '' : 'selected' }}>Select a service...</option>
                    @foreach ($service->features as $feature)
                        <option value="{{ $feature->title }}" {{ old('topic') == $feature->title ? 'selected' : '' }}>
                            {{ $feature->title }}
                        </option>
                    @endforeach
                </select>
                @error('topic') <div class="invalid-feedback">{{ $message }}</div> @enderror
            </div>

            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-lg fw-bold text-white btn-primary">
                    Schedule My Call <i class="bi bi-arrow-right ms-2"></i>
                </button>
            </div>
            
        </form>
    </div>

    <div class="card bg-success bg-opacity-10 border-0 p-3 rounded-4">
        <div class="d-flex align-items-center">
            <div class="flex-shrink-0 bg-success text-white rounded-circle p-2 me-3 icon-circle icon-circle-sm">
                <i class="bi bi-shield-check fs-5"></i>
            </div>
            <div>
                <h6 class="mb-0 fw-bold text-success small">Secure Consultation</h6>
                <p class="extra-small text-success mb-0 opacity-75">Encrypted and confidential sessions.</p>
            </div>
        </div>
    </div>
</div>
