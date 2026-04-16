@extends('adminlte::page')

@section('title', 'Edit Application')

@section('content_header')
  <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Edit Application: <small class="text-capitalize">{{ $application->title }}</small>
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ route('admin.applications.update', $application->id) }}" method="POST">
  @csrf

  <div class="row">

    <!-- Left Column -->
    <div class="col-md-12">
      <div class="card card-primary card-outline shadow-sm border-0">
        <div class="card-header border-0 bg-white py-3"><h3 class="card-title"><i class="fas fa-palette"></i> Theme Variables</h3></div>

        <div class="card-body">

          {{-- =========================
              COLORS
          ========================== --}}
          <h5 class="mb-3"><i class="fas fa-tint"></i> Colors</h5>
          <div class="row">
            <div class="col-md-2 form-group">
              <label>Primary Color <span class="text-danger">*</span></label>
              <input type="color" name="variables[--color-primary]" class="form-control" value="{{ $application->variables['--color-primary'] ?? '#1b4e9b' }}">
            </div>
            <div class="col-md-2 form-group">
              <label>Secondary Color</label>
              <input type="color" name="variables[--color-secondary]" class="form-control" value="{{ $application->variables['--color-secondary'] ?? '#6c757d' }}">
            </div>
            <div class="col-md-2 form-group">
              <label>Accent Color</label>
              <input type="color" name="variables[--color-accent]" class="form-control" value="{{ $application->variables['--color-accent'] ?? '#ff9800' }}">
            </div>
            <div class="col-md-2 form-group">
              <label>Background Color</label>
              <input type="color" name="variables[--color-background]" class="form-control" value="{{ $application->variables['--color-background'] ?? '#ffffff' }}">
            </div>
            <div class="col-md-2 form-group">
              <label>Text Color</label>
              <input type="color" name="variables[--color-text]" class="form-control" value="{{ $application->variables['--color-text'] ?? '#212529' }}">
            </div>
            <div class="col-md-2 form-group">
              <label>Muted Text</label>
              <input type="color" name="variables[--color-text-light]" class="form-control" value="{{ $application->variables['--color-text-light'] ?? '#6c757d' }}">
            </div>
          </div>

          <hr>

          {{-- =========================
              TYPOGRAPHY
          ========================== --}}
          <h5 class="mb-3"><i class="fas fa-font"></i> Typography</h5>
          <div class="row">
            <div class="col-md-6 form-group">
              <label>Base Font (font-family)</label>
              <input type="text" name="variables[--font-family-base]" class="form-control" value="{{ $application->variables['--font-family-base'] ?? 'Inter, sans-serif' }}">
              <small class="form-text text-muted">Example: "Inter, sans-serif" or "Roboto, sans-serif"</small>
            </div>
            <div class="col-md-6 form-group">
              <label>Heading Font (font-family)</label>
              <input type="text" name="variables[--font-family-heading]" class="form-control" value="{{ $application->variables['--font-family-heading'] ?? 'Poppins, sans-serif' }}">
              <small class="form-text text-muted">Example: "Poppins, sans-serif" or "Montserrat, sans-serif"</small>
            </div>
          </div>

          <hr>

          {{-- =========================
              LAYOUT & SPACING
          ========================== --}}
          <h5 class="mb-3"><i class="fas fa-vector-square"></i> Layout & Spacing</h5>
          <div class="row">
            <div class="col-md-4 form-group">
              <label>Base Radius</label>
              <input type="text" name="variables[--radius-base]" class="form-control" value="{{ $application->variables['--radius-base'] ?? '0.375rem' }}">
              <small class="form-text text-muted">Example: 4px, 0.375rem, 10px</small>
            </div>
            <div class="col-md-4 form-group">
              <label>Button Radius</label>
              <input type="text" name="variables[--radius-button]" class="form-control" value="{{ $application->variables['--radius-button'] ?? '0.375rem' }}">
            </div>
            <div class="col-md-4 form-group">
              <label>Container Width</label>
              <input type="text" name="variables[--layout-container-width]" class="form-control" value="{{ $application->variables['--layout-container-width'] ?? '1140px' }}">
            </div>
          </div>

          <hr>

          {{-- =========================
              SHADOWS & EFFECTS
          ========================== --}}
          <h5 class="mb-3"><i class="fas fa-layer-group"></i> Effects</h5>
          <div class="form-group col-md-6">
            <label>Card Shadow</label>
            <input type="text" name="variables[--shadow-card]" class="form-control" value="{{ $application->variables['--shadow-card'] ?? '0 1px 3px rgba(0,0,0,0.1)' }}">
          </div>

          

        </div>
      </div>

      <div class="text-left">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> Save Theme
            </button>
          </div>

    </div>


  </div>
</form>
@endsection

@push('css')

@endpush
