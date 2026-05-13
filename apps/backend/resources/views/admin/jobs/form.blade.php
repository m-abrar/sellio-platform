{{--
    Administrative Jobs: Vacancy Asset Configuration
    
    This view serves as the authoritative interface for job listing 
    management. It orchestrates complex data entry for role 
    responsibilities, compensation packages, workspace types (remote/onsite), 
    and application deadlines. It also integrates operational intelligence 
    through recruitment pipeline metrics and visual identity management.
    
    @extends adminlte::page
    @context Job Inventory Management
    @variables JobListing $job The job model instance being edited/created.
    @variables Collection $categories Job categories for vertical taxonomy.
    @variables Collection $locations Regional hubs for geographic clustering.
--}}
@extends('adminlte::page')

@section('title', ($job->exists ? 'Edit' : 'Create') . ' Job')

@section('plugins.Select2', true)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-briefcase mr-2 text-primary"></i> 
                    {{ $job->exists ? 'Modify Job' : 'New Job Position' }}
                </h1>
                <p class="text-muted mt-2 small uppercase letter-spacing-1 mb-0">
                    {{ $job->exists ? 'Update role responsibilities, compensation, and application deadlines.' : 'Define a new career opportunity with detailed specs and requirements.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.jobs.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Positions
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ $job->exists ? route('admin.jobs.update', $job->id) : route('admin.jobs.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if($job->exists) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Basic Information --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">General Information</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Job Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-hero" value="{{ old('title', $job->title ?? '') }}" required list="job-title-suggestions" placeholder="e.g. Senior Software Engineer">
                            <datalist id="job-title-suggestions">
                                @foreach($titleSuggestions ?? [] as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-premium text-monospace small" placeholder="auto-generated-slug" value="{{ old('slug', $job->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Job Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control textarea-premium" placeholder="Describe the role, responsibilities, and requirements...">{{ old('description', $job->description ?? '') }}</textarea>
                            @error('description') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
                        </div>
                    </div>
                </div>

                {{-- Salary & Benefits --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Compensation</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Min Salary</label>
                                    <input type="number" step="0.01" name="salary_min" class="form-control form-control-premium" value="{{ old('salary_min', $job->salary_min ?? '') }}" placeholder="e.g. 50000">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Max Salary</label>
                                    <input type="number" step="0.01" name="salary_max" class="form-control form-control-premium" value="{{ old('salary_max', $job->salary_max ?? '') }}" placeholder="e.g. 80000">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Frequency</label>
                                    <select name="salary_frequency" class="form-control form-control-premium">
                                        <option value="yearly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'yearly' ? 'selected' : '' }}>Yearly (yr)</option>
                                        <option value="monthly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'monthly' ? 'selected' : '' }}>Monthly (mo)</option>
                                        <option value="weekly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'weekly' ? 'selected' : '' }}>Weekly (wk)</option>
                                        <option value="hourly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'hourly' ? 'selected' : '' }}>Hourly (hr)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Requirements --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Job Specs & Workspace</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Workplace Type</label>
                                    <select name="workplace_type" class="form-control form-control-premium">
                                        <option value="1" {{ old('workplace_type', $job->workplace_type ?? '') == '1' ? 'selected' : '' }}>Remote</option>
                                        <option value="2" {{ old('workplace_type', $job->workplace_type ?? '2') == '2' ? 'selected' : '' }}>On-Site</option>
                                        <option value="3" {{ old('workplace_type', $job->workplace_type ?? '') == '3' ? 'selected' : '' }}>Hybrid</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Experience Level</label>
                                    <input type="text" name="experience_level" class="form-control form-control-premium" placeholder="Junior / Mid / Senior" value="{{ old('experience_level', $job->experience_level ?? '') }}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Deadline</label>
                                    <input type="date" name="application_deadline" class="form-control form-control-premium" value="{{ old('application_deadline', $job->exists && $job->application_deadline ? $job->application_deadline->format('Y-m-d') : '') }}">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">City</label>
                                    <input type="text" name="city" class="form-control form-control-premium" value="{{ old('city', $job->city ?? '') }}" placeholder="e.g. New York">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-0">
                                    <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Country</label>
                                    <input type="text" name="country" class="form-control form-control-premium" value="{{ old('country', $job->country ?? '') }}" placeholder="e.g. USA">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Gallery Collection --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Office Photos</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\JobListing::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => 'job',
                            'id' => $job->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($job->exists)
                {{-- Recent Applications --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Recent Applications ({{ $applicationsCount ?? 0 }})</h3>
                    </div>
                    <div class="card-body p-5 text-center">
                        <div class="text-muted small uppercase letter-spacing-1">Application sub-listing grid view leads to unified router tables.</div>
                    </div>
                </div>
                @endif

                {{-- Display & Billing Options --}}
                <div class="card border-0 shadow-premium rounded-xl overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-main">Display & Billing Options</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_full_time', 'id' => 'isFullTime', 'label' => 'Full-Time Position', 'status' => 'Regular', 'checked' => old('is_full_time', $job->is_full_time ?? true)],
                                    ['name' => 'is_contract', 'id' => 'isContract', 'label' => 'Contractual / Freelance', 'status' => 'Flexible', 'checked' => old('is_contract', $job->is_contract ?? false)],
                                ];
                            @endphp
                            @foreach($toggles as $t)
                                <div class="col-md-6 mb-3">
                                    <label class="w-100 cursor-pointer mb-0">
                                        <input type="hidden" name="{{ $t['name'] }}" value="0">
                                        <input type="checkbox" name="{{ $t['name'] }}" value="1" id="{{ $t['id'] }}" class="d-none toggle-input" {{ $t['checked'] ? 'checked' : '' }}>
                                        <div class="d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm px-4 py-3 border rounded-xl border-light-soft">
                                            <div>
                                                <div class="font-weight-bold text-dark small uppercase letter-spacing-1">{{ $t['label'] }}</div>
                                                <div class="small toggle-status text-muted uppercase letter-spacing-1">{{ $t['status'] ?? 'Option' }}</div>
                                            </div>
                                            <div class="toggle-indicator shadow-sm"></div>
                                        </div>
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                @include('admin._partials._form-actions', [
                    'model' => $job,
                    'title' => 'JOB',
                    'back' => 'admin.jobs.index',
                    'duplicate' => 'admin.jobs.duplicate'
                ])

                {{-- Listing Controls --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Listing Controls</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="custom-control custom-switch custom-switch-premium">
                            <input type="hidden" name="is_featured" value="0">
                            <input type="checkbox" name="is_featured" value="1" class="custom-control-input" id="isFeatured" {{ old('is_featured', $job->is_featured ?? false) ? 'checked' : '' }}>
                            <label class="custom-control-label small font-weight-bold text-dark uppercase letter-spacing-1" for="isFeatured">Featured Listing</label>
                        </div>
                    </div>
                </div>

                {{-- Primary Media --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\JobListing::PRIMARY_MEDIA,
                            'label' => 'Company Logo',
                            'multiple' => false,
                            'model' => 'job',
                            'id' => $job->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card border-0 shadow-premium mb-4 rounded-xl overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title-side">Classification</h3>
                    </div>
                    <div class="card-body p-4 pt-0">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Marketplace Category</label>
                            <select name="category_id" class="form-control select2" required>
                                <option value="">Select Category</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $job->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted uppercase mb-2 letter-spacing-1">Regional Hub</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">Select Location</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $job->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->title }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/job-form.js') }}"></script>
@endpush

@push('css')
@include('admin._partials._toggle-card-css')
@endpush
