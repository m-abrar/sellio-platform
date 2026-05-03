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
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
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
<div class="container-fluid">
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
                <div class="card card-premium overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;">General Information</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label class="font-weight-600"><i class="fas fa-briefcase mr-1 text-primary"></i> Job Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-lg @error('title') is-invalid @enderror" value="{{ old('title', $job->title ?? '') }}" required list="job-title-suggestions">
                            <datalist id="job-title-suggestions">
                                @foreach(\App\Models\JobListing::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600 text-muted small">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-monospace @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $job->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Job Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control @error('description') is-invalid @enderror" placeholder="Describe the role, responsibilities, and requirements...">{{ old('description', $job->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Salary & Benefits --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Compensation</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group"><label>Min Salary</label><input type="number" step="0.01" name="salary_min" class="form-control" value="{{ old('salary_min', $job->salary_min ?? '') }}"></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Max Salary</label><input type="number" step="0.01" name="salary_max" class="form-control" value="{{ old('salary_max', $job->salary_max ?? '') }}"></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Frequency</label><select name="salary_frequency" class="form-control"><option value="yearly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'yearly' ? 'selected' : '' }}>Yearly (yr)</option><option value="monthly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'monthly' ? 'selected' : '' }}>Monthly (mo)</option><option value="weekly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'weekly' ? 'selected' : '' }}>Weekly (wk)</option><option value="hourly" {{ old('salary_frequency', $job->salary_frequency ?? '') == 'hourly' ? 'selected' : '' }}>Hourly (hr)</option></select></div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Requirements --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Job Specs & Workspace</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group"><label>Workplace Type</label><select name="workplace_type" class="form-control"><option value="1" {{ old('workplace_type', $job->workplace_type ?? '') == '1' ? 'selected' : '' }}>Remote</option><option value="2" {{ old('workplace_type', $job->workplace_type ?? '2') == '2' ? 'selected' : '' }}>On-Site</option><option value="3" {{ old('workplace_type', $job->workplace_type ?? '') == '3' ? 'selected' : '' }}>Hybrid</option></select></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Experience Level</label><input type="text" name="experience_level" class="form-control" placeholder="Junior / Mid / Senior" value="{{ old('experience_level', $job->experience_level ?? '') }}"></div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group"><label>Deadline</label><input type="date" name="application_deadline" class="form-control" value="{{ old('application_deadline', $job->exists && $job->application_deadline ? $job->application_deadline->format('Y-m-d') : '') }}"></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="form-group"><label>City</label><input type="text" name="city" class="form-control" value="{{ old('city', $job->city ?? '') }}"></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Country</label><input type="text" name="country" class="form-control" value="{{ old('country', $job->country ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>



                {{-- Gallery Collection --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase" style="letter-spacing: 1px;">Office Photos</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\JobListing::GALLERY_MEDIA,
                            'label' => 'Select Gallery Images',
                            'multiple' => true,
                            'model' => \App\Models\JobListing::class,
                            'id' => $job->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                @if($job->exists)
                {{-- Recent Applications --}}
                <div class="card card-premium overflow-hidden mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0"><i class="fas fa-file-invoice mr-2 text-success opacity-50"></i> Recent Applications ({{ $applicationsCount ?? 0 }})</h3>
                    </div>
                    <div class="card-body p-5 text-center">
                        <div class="text-muted small">Application sub-listing grid view leads to unified router tables.</div>
                    </div>
                </div>
                @endif
                {{-- Display & Billing Options --}}
                <div class="card card-premium mt-4 overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase small" style="letter-spacing: 1px;"><i class="fas fa-cog mr-2 text-secondary"></i> Display & Billing Options</h3>
                    </div>
                    <div class="card-body p-4">
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
                                        <div class="border rounded px-3 py-3 d-flex justify-content-between align-items-center h-100 toggle-card shadow-sm">
                                            <div>
                                                <div class="font-weight-bold text-dark small">{{ $t['label'] }}</div>
                                                <div class="small toggle-status text-muted">{{ $t['status'] ?? 'Option' }}</div>
                                            </div>
                                            <div class="toggle-indicator"></div>
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
                {{-- Action Card --}}
                @include('admin.jobs.partials.action-buttons')

                {{-- Primary Media --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\JobListing::PRIMARY_MEDIA,
                            'label' => 'Company Logo',
                            'multiple' => false,
                            'model' => \App\Models\JobListing::class,
                            'id' => $job->id ?? null,
                            'noCard' => true,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card card-premium mb-4 overflow-hidden">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                            <i class="fas fa-sitemap mr-2 text-primary opacity-50"></i> Classification
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label class="small font-weight-bold text-muted text-uppercase">Marketplace Category</label>
                            <select name="category_id" class="form-control select2" required>
                                <option value="">Select Category</option>
                                @foreach($categories ?? [] as $cat)
                                    <option value="{{ $cat->id }}" {{ (old('category_id', $job->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-muted text-uppercase">Regional Hub</label>
                            <select name="location_id" class="form-control select2">
                                <option value="">Select Location</option>
                                @foreach($locations ?? [] as $loc)
                                    <option value="{{ $loc->id }}" {{ (old('location_id', $job->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->name }}</option>
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
<script>
    $(document).ready(function () { 
        $('.select2').select2({ theme: 'bootstrap4', width: '100%' }); 

        const titleInput = $('#title');
        const slugInput = $('#slug');

        titleInput.on('input', function () {
            if(!slugInput.data('edited')){
                let slug = $(this).val().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                slugInput.val(slug);
            }
        });

        slugInput.on('change', function() { $(this).data('edited', true); });
    });
</script>
@include('admin._partials._toggle-card-css')
@endpush

@if($job->exists)
    <form id="delete-form" action="{{ route('admin.jobs.destroy', $job->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this job listing?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form').submit();
                }
            })
        }
    </script>
@endif
