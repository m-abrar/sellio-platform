<div class="card shadow-sm rounded-3 mb-4 border-0">
    <div class="card-header bg-white border-bottom">
        <h3 class="card-title font-weight-bold text-dark">Content Details</h3>
    </div>
    <div class="card-body">
        <div class="form-group mb-4">
            <label for="title">Page Title <span class="text-danger">*</span></label>
            <input type="text" name="title" id="title" class="form-control form-control-lg @error('title') is-invalid @enderror" 
                   value="{{ old('title', $page->title ?? '') }}" required placeholder="Enter title here...">
            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        <div class="form-group mb-4">
            <label for="slug">URL Slug</label>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-light border-right-0 small text-muted">/page/</span>
                </div>
                <input type="text" name="slug" id="slug" class="form-control @error('slug') is-invalid @enderror"
                       value="{{ old('slug', $page->slug ?? '') }}">
            </div>
            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
        </div>

        @if(isset($page) && $page->id)
            <div class="bg-light p-3 rounded mb-4 text-center border">
                <p class="small text-muted mb-2">Use the visual builder to design your content</p>
                <a href="{{ route('admin.page-builder.edit', $page->id) }}" target="_blank" class="btn btn-outline-primary px-4">
                    <i class="fas fa-magic mr-1"></i> Open Page Builder
                </a>
            </div>
        @endif

        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label for="type">Content Type</label>
                    <select name="type" id="type" class="form-control">
                        @foreach(['page', 'header', 'footer'] as $type)
                            <option value="{{ $type }}" {{ old('type', $page->type ?? '') == $type ? 'selected' : '' }}>
                                {{ ucfirst($type) }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="header_id">Header Template</label>
                    <select name="header_id" id="header_id" class="form-control">
                        <option value="">None</option>
                        @foreach($headers as $header)
                            <option value="{{ $header->id }}" {{ old('header_id', $page->header_id ?? '') == $header->id ? 'selected' : '' }}>
                                {{ $header->title }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label for="footer_id">Footer Template</label>
                    <select name="footer_id" id="footer_id" class="form-control">
                        <option value="">None</option>
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
