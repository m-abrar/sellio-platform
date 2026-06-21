@extends('frontend._layouts._app')

@section('title', 'Apply for ' . $job->title) 
@section('body_class', 'has-body-glow')

@section('content')
<main class="container-xl page-wrapper pb-5">
    <div class="row pt-4 g-4">
        <div class="col-12 main-content">
            {{-- Back Button --}}
            @include('frontend.jobs.application.partials._back_button')

            <div class="row g-4 px-lg-3 justify-content-center">
                <div class="col-12">
                    @include('frontend._partials._alerts')
                    
                    <div class="card bg-white border p-4 p-lg-5 overflow-hidden position-relative">
                        {{-- Decorative Badge --}}
                        <div class="position-absolute top-0 end-0 m-4 d-none d-md-block">
                            <span class="badge bg-primary-light text-primary px-3 py-2 rounded-2 fw-semibold">
                                <i class="bi bi-clock-history me-1"></i> Quick Apply
                            </span>
                        </div>

                        <div class="mb-4">
                            <h2 class="fw-800 text-dark mb-2">Join the Team</h2>
                            <p class="text-muted lead">Position: <span class="text-primary fw-bold">{{ $job->title }}</span></p>
                        </div>

                        @auth
                            @php
                                $user = Auth::user();
                                $defaultName = $user->name ?? '';
                                $defaultEmail = $user->email ?? '';
                                $defaultPhone = $user->phone ?? ''; 
                            @endphp

                            <div class="alert bg-primary-light border-0 text-primary mb-5 d-flex align-items-center rounded-4 p-3">
                                <i class="bi bi-person-check-fill fs-3 me-3"></i>
                                <div class="smaller">
                                    Logged in as <strong>{{ $user->email }}</strong>. <br>
                                    Your profile details have been pre-filled for your convenience.
                                </div>
                            </div>

                            <form action="{{ route('jobs.apply.store', $job->slug) }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                
                                <h5 class="fw-bold mb-4 text-dark"><i class="bi bi-person-lines-fill me-2 text-primary"></i>Contact Information</h5>
                                
                                <div class="row g-4 mb-5">
                                    <div class="col-md-6">
                                        <div class="form-floating">
                                            <input type="text" id="full_name" name="full_name" 
                                                class="form-control @error('full_name') is-invalid @enderror"
                                                value="{{ old('full_name', $defaultName) }}" placeholder="{{ __('Full Name') }}" required>
                                            <label for="full_name">Full Name *</label>
                                            @error('full_name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="form-floating">
                                            <input type="email" id="email" name="email" 
                                                class="form-control @error('email') is-invalid @enderror"
                                                value="{{ old('email', $defaultEmail) }}" placeholder="{{ __('Email') }}" required>
                                            <label for="email">Email Address *</label>
                                            @error('email') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="form-floating">
                                            <input type="tel" id="phone" name="phone" 
                                                class="form-control @error('phone') is-invalid @enderror"
                                                value="{{ old('phone', $defaultPhone) }}" placeholder="{{ __('Phone') }}">
                                            <label for="phone">Phone Number</label>
                                            @error('phone') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label for="resume_file" class="form-label smaller fw-bold text-muted mb-1 ps-2">Resume/CV (PDF/DOCX) *</label>
                                        <input type="file" id="resume_file" name="resume_file" 
                                            class="form-control py-2 @error('resume_file') is-invalid @enderror" required>
                                        @error('resume_file') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                    </div>
                                </div>
                                
                                <h5 class="fw-bold mb-4 text-dark"><i class="bi bi-chat-left-text-fill me-2 text-primary"></i>Cover Letter</h5>
                                <div class="mb-5">
                                    <textarea id="cover_letter" name="cover_letter" 
                                        class="form-control @error('cover_letter') is-invalid @enderror" 
                                        rows="6" placeholder="{{ __('Tell us why you\'re a great fit for :title...', ['title' => $job->title]) }}">{{ old('cover_letter') }}</textarea>
                                    @error('cover_letter') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                                
                                <div class="text-center">
                                    <button type="submit" class="btn btn-lg btn-primary px-5 py-3">
                                        Submit Application <i class="bi bi-arrow-right ms-2"></i>
                                    </button>
                                    <p class="text-muted smaller mt-3">By clicking submit, you agree to our recruitment privacy policy.</p>
                                </div>
                            </form>
                        @else
                            <div class="text-center py-5">
                                <div class="mb-4">
                                    <i class="bi bi-lock-fill text-warning" style="font-size: 4rem;"></i>
                                </div>
                                <h4 class="fw-bold">Authentication Required</h4>
                                <p class="text-muted mb-4">You must be logged in to your account to submit a job application.</p>
                                <div class="d-flex justify-content-center gap-3">
                                    <a href="{{ route('login') }}" class="btn btn-primary px-4 py-2">Login Now</a>
                                    <a href="{{ route('register') }}" class="btn btn-outline-secondary px-4 py-2 fw-semibold">Create Account</a>
                                </div>
                            </div>
                        @endauth
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
@endsection

@section('head_extra')
    @include('frontend.jobs.application.partials._head_extra')
@endsection
