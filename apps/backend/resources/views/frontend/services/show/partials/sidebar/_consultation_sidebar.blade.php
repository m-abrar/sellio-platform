<div class="sticky-top">
    <div class="card detail-sidebar-card mb-4 overflow-hidden">
        <div class="card-header border-0 p-4" style="background:var(--primary-color)">
            <h4 class="fw-800 mb-1 text-white"><i class="bi bi-chat-dots-fill me-2"></i>{{ __('Book consultation') }}</h4>
            <p class="mb-0 text-white opacity-75 small">{{ __('Response time: Usually within 24h') }}</p>
        </div>
        <div class="card-body p-4">
            <h6 class="fw-800 mb-3 text-primary" style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase">
                <i class="bi bi-person me-2"></i>{{ __('Your details') }}
            </h6>

            <form action="{{ route('services.consultation.store', $service->slug) }}" method="POST">
                @csrf

                <div class="form-floating mb-3">
                    <input type="text"
                           name="name"
                           class="form-control rounded-3 shadow-none @error('name') is-invalid @enderror"
                           style="border:1.5px solid rgba(15,23,42,.12)"
                           id="floatingName"
                           placeholder="{{ __('Name') }}"
                           value="{{ old('name', auth()->user()->name ?? '') }}"
                           required>
                    <label for="floatingName">{{ __('Full Name') }}</label>
                    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="form-floating mb-3">
                    <input type="email"
                           name="email"
                           class="form-control rounded-3 shadow-none @error('email') is-invalid @enderror"
                           style="border:1.5px solid rgba(15,23,42,.12)"
                           id="floatingEmail"
                           placeholder="{{ __('Email') }}"
                           value="{{ old('email', auth()->user()->email ?? '') }}"
                           required>
                    <label for="floatingEmail">{{ __('Email Address') }}</label>
                    @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="form-floating mb-3">
                    <input type="tel"
                           name="phone"
                           class="form-control rounded-3 shadow-none @error('phone') is-invalid @enderror"
                           style="border:1.5px solid rgba(15,23,42,.12)"
                           id="floatingPhone"
                           placeholder="{{ __('Phone Number') }}"
                           value="{{ old('phone', auth()->user()->phone ?? '') }}"
                           required>
                    <label for="floatingPhone">{{ __('Phone Number') }}</label>
                    @error('phone') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="mb-4">
                    <label class="small fw-semibold text-muted mb-2">{{ __('Primary Interest') }}</label>
                    <select name="topic" class="form-select py-3 shadow-none rounded-3 @error('topic') is-invalid @enderror" style="border:1.5px solid rgba(15,23,42,.12)" required>
                        <option value="" disabled {{ old('topic') ? '' : 'selected' }}>{{ __('Select a service…') }}</option>
                        @foreach ($service->features as $feature)
                            <option value="{{ $feature->title }}" {{ old('topic') == $feature->title ? 'selected' : '' }}>
                                {{ $feature->title }}
                            </option>
                        @endforeach
                    </select>
                    @error('topic') <div class="invalid-feedback">{{ $message }}</div> @enderror
                </div>

                <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-primary btn-header-cta">
                        {{ __('Schedule my call') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div class="card detail-sidebar-card p-3 rounded-4" style="border-left:3px solid var(--primary-color)">
        <div class="d-flex align-items-center">
            <div class="flex-shrink-0 me-3 d-flex align-items-center justify-content-center rounded-3"
                 style="width:38px;height:38px;background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                <i class="bi bi-shield-check fs-5"></i>
            </div>
            <div>
                <h6 class="mb-0 fw-semibold small">{{ __('Secure consultation') }}</h6>
                <p class="extra-small text-muted mb-0">{{ __('Encrypted and confidential sessions.') }}</p>
            </div>
        </div>
    </div>
</div>
