<div class="card card-premium mb-4">
    <div class="card-header bg-white border-0 py-4 px-4">
        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Content Identity
        </h3>
    </div>
    <div class="card-body p-4">
        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Page Title <span class="text-danger">*</span></label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0"><i class="fas fa-heading text-primary"></i></span>
                </div>
                <input type="text" name="title" id="title" class="form-control border-0 @error('title') is-invalid @enderror" 
                       value="{{ old('title', $page->title ?? '') }}" required placeholder="Enter primary title here...">
            </div>
            @error('title') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">URL Slug (Permanent Link)</label>
            <div class="input-group border rounded p-1 shadow-xs bg-white">
                <div class="input-group-prepend border-0">
                    <span class="input-group-text bg-white border-0 text-muted smallest font-weight-bold uppercase">/page/</span>
                </div>
                <input type="text" name="slug" id="slug" class="form-control border-0 @error('slug') is-invalid @enderror"
                       value="{{ old('slug', $page->slug ?? '') }}" placeholder="auto-generated-slug">
            </div>
            @error('slug') <span class="invalid-feedback d-block">{{ $message }}</span> @enderror
        </div>

        @if($page->exists)
            <div class="bg-primary-soft p-4 rounded-xl mb-4 text-center border border-primary-soft">
                <p class="small text-dark font-weight-bold text-uppercase mb-3" style="letter-spacing: 1px;">Visual Architecture</p>
                <a href="{{ route('admin.page-builder.edit', $page->id) }}" target="_blank" class="btn btn-primary rounded-pill px-5 font-weight-bold shadow-premium">
                    <i class="fas fa-magic mr-2"></i> OPEN PAGE BUILDER
                </a>
            </div>
        @endif

        <div class="row">
            <div class="col-md-4">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Content Layer</label>
                    <select name="type" id="type" class="form-control custom-select shadow-xs" style="border-radius: 10px;">
                        @foreach(['page', 'header', 'footer'] as $type)
                            <option value="{{ $type }}" {{ old('type', $page->type ?? '') == $type ? 'selected' : '' }}>
                                {{ ucfirst($type) }} Registry
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Header Overlay</label>
                    <select name="header_id" id="header_id" class="form-control custom-select shadow-xs" style="border-radius: 10px;">
                        <option value="">Standard Default</option>
                        @foreach($headers as $header)
                            <option value="{{ $header->id }}" {{ old('header_id', $page->header_id ?? '') == $header->id ? 'selected' : '' }}>
                                {{ $header->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group mb-0">
                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Footer Base</label>
                    <select name="footer_id" id="footer_id" class="form-control custom-select shadow-xs" style="border-radius: 10px;">
                        <option value="">Standard Default</option>
                        @foreach($footers as $footer)
                            <option value="{{ $footer->id }}" {{ old('footer_id', $page->footer_id ?? '') == $footer->id ? 'selected' : '' }}>
                                {{ $footer->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>
    </div>
</div>
