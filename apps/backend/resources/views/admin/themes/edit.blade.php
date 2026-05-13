{{--
    Administrative Aesthetic Module: Visual Token Configuration
    
    This view provides a granular interface for modifying a theme's 
    visual architecture. It facilitates the configuration of brand 
    color palettes, typography mapping (with real-time Google Font 
    previews), and layout spacing tokens (radius, width, shadows).
    
    @extends adminlte::page
    @context Aesthetic Management
    @variables Theme $theme The theme model instance being modified.
--}}
@extends('adminlte::page')

@section('title', 'Edit Theme')

@section('content_header')
  <div class="container-fluid pt-4">
    <div class="row mb-4 align-items-center">
        <div class="col-sm-8">
            <h1 class="m-0 text-dark font-weight-bold">
                <i class="fas fa-palette mr-2 text-primary"></i> 
                Edit Theme: <small class="text-capitalize text-muted font-weight-bold">{{ $theme->title }}</small>
            </h1>
            <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Customize visual tokens, brand identity, and interface aesthetics.</p>
        </div>
        <div class="col-sm-4 text-right">
            <a href="{{ route('admin.themes.index') }}" class="btn btn-back shadow-sm">
                <i class="fas fa-arrow-left mr-1"></i> Back to Themes
            </a>
        </div>
    </div>
</div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ route('admin.themes.update', $theme->id) }}" method="POST">
  @csrf

  <div class="row">

    <!-- Left Column -->
    <div class="col-md-8">
      <div class="card card-premium overflow-hidden">
        <div class="card-header border-0 bg-white py-3 px-4">
            <h3 class="card-title font-weight-bold text-dark text-uppercase small ls-1"><i class="fas fa-palette mr-2 text-primary opacity-50"></i> Theme Variables</h3>
        </div>

        <div class="card-body p-4">

          {{-- =========================
              COLORS
          ========================== --}}
          <h5 class="mb-4 font-weight-bold text-muted small text-uppercase letter-spacing-1"><i class="fas fa-tint mr-2"></i> Brand Colors</h5>
          <div class="row">
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Primary</label>
              <input type="color" name="variables[--color-primary]" class="form-control" value="{{ $theme->variables['--color-primary'] ?? '#1b4e9b' }}">
            </div>
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Secondary</label>
              <input type="color" name="variables[--color-secondary]" class="form-control" value="{{ $theme->variables['--color-secondary'] ?? '#6c757d' }}">
            </div>
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Accent</label>
              <input type="color" name="variables[--color-accent]" class="form-control" value="{{ $theme->variables['--color-accent'] ?? '#ff9800' }}">
            </div>
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Background</label>
              <input type="color" name="variables[--color-background]" class="form-control" value="{{ $theme->variables['--color-background'] ?? '#ffffff' }}">
            </div>
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Text</label>
              <input type="color" name="variables[--color-text]" class="form-control" value="{{ $theme->variables['--color-text'] ?? '#212529' }}">
            </div>
            <div class="col-md-2 form-group">
              <label class="smallest font-weight-bold text-muted text-uppercase">Muted</label>
              <input type="color" name="variables[--color-text-light]" class="form-control" value="{{ $theme->variables['--color-text-light'] ?? '#6c757d' }}">
            </div>
          </div>

          <hr class="my-4">

          {{-- =========================
              TYPOGRAPHY
          ========================== --}}
          <h5 class="mb-4 font-weight-bold text-muted small text-uppercase letter-spacing-1"><i class="fas fa-font mr-2"></i> Typography Architect</h5>
          <div class="row">
            <div class="col-md-5 form-group">
              <label class="font-weight-600">Base Font (font-family)</label>
              <input type="text" id="font-family-base" name="variables[--font-family-base]" class="form-control" value="{{ $theme->variables['--font-family-base'] ?? 'Inter, sans-serif' }}">
              <small class="form-text text-muted">Example: "Inter, sans-serif"</small>
            </div>
            <div class="col-md-5 form-group">
              <label class="font-weight-600">Heading Font (font-family)</label>
              <input type="text" id="font-family-heading" name="variables[--font-family-heading]" class="form-control" value="{{ $theme->variables['--font-family-heading'] ?? 'Poppins, sans-serif' }}">
              <small class="form-text text-muted">Example: "Poppins, sans-serif"</small>
            </div>
            <div class="col-md-2 d-flex align-items-end mb-3">
               <div class="p-3 border rounded w-100 text-center bg-light shadow-sm theme-preview-box">
                  <h6 id="preview-heading" class="mb-1 fs-1-rem">Heading Preview</h6>
                  <p id="preview-base" class="mb-0 fs-0-8-rem">Body text preview.</p>
               </div>
            </div>
          </div>

          <hr class="my-4">

          {{-- =========================
              LAYOUT & SPACING
          ========================== --}}
          <h5 class="mb-4 font-weight-bold text-muted small text-uppercase letter-spacing-1"><i class="fas fa-vector-square mr-2"></i> Layout & Spacing</h5>
          <div class="row">
            <div class="col-md-4 form-group">
              <label class="font-weight-600">Base Radius</label>
              <input type="text" name="variables[--radius-base]" class="form-control" value="{{ $theme->variables['--radius-base'] ?? '0.375rem' }}">
            </div>
            <div class="col-md-4 form-group">
              <label class="font-weight-600">Button Radius</label>
              <input type="text" name="variables[--radius-button]" class="form-control" value="{{ $theme->variables['--radius-button'] ?? '0.375rem' }}">
            </div>
            <div class="col-md-4 form-group">
              <label class="font-weight-600">Container Width</label>
              <input type="text" name="variables[--layout-container-width]" class="form-control" value="{{ $theme->variables['--layout-container-width'] ?? '1140px' }}">
            </div>
          </div>

          <hr class="my-4">

          {{-- =========================
              SHADOWS & EFFECTS
          ========================== --}}
          <h5 class="mb-4 font-weight-bold text-muted small text-uppercase letter-spacing-1"><i class="fas fa-layer-group mr-2"></i> Visual Effects</h5>
          <div class="form-group mb-0">
            <label class="font-weight-600">Global Card Shadow</label>
            <input type="text" name="variables[--shadow-card]" class="form-control" value="{{ $theme->variables['--shadow-card'] ?? '0 1px 3px rgba(0,0,0,0.1)' }}">
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column -->
    <div class="col-md-4">
        @include('admin._partials._form-actions', [
            'model' => $theme,
            'title' => 'THEME',
            'back' => 'admin.themes.index'
        ])

        <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft shadow-xs mt-4">
            <h6 class="font-weight-bold text-primary mb-2 text-uppercase smallest letter-spacing-1">Designer Intelligence</h6>
            <p class="text-muted small mb-0">
                Modifying these variables will impact the visual aesthetics of the entire frontend platform. Ensure high color contrast for accessibility.
            </p>
        </div>
    </div>


  </div>
</form>
@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/theme-editor.js') }}"></script>
@endpush
