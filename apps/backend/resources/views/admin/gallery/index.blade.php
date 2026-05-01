@extends('adminlte::page')

@section('title', 'Global Media Manager | Admin Assets')

@section('content_header')
    <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="text-dark font-weight-bold">
            <i class="fas fa-photo-video mr-2 text-primary"></i> 
            Central Media Manager
            <small class="lead d-block d-md-inline-block ml-md-3 text-muted">All images across all modules</small>
        </h1>
        <button type="button" class="btn btn-primary shadow-sm font-weight-bold" data-toggle="modal" data-target="#uploadModal" style="border-radius: 10px;">
            <i class="fas fa-plus-circle mr-2"></i> Add Standalone Asset
        </button>
    </div>
@stop

@section('content')
    {{-- Premium Filter Card --}}
    <div class="card card-outline card-secondary shadow-sm mb-4">
        <div class="card-body py-3">
            <form action="{{ route('admin.gallery.index') }}" method="GET" class="row align-items-end justify-content-center">
                <div class="col-auto">
                    <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Source</label>
                    <select name="source" class="form-control shadow-xs" onchange="this.form.submit()">
                        <option value="">All Sources</option>
                        @foreach($sources as $source)
                            <option value="{{ $source }}" {{ request('source') == $source ? 'selected' : '' }}>
                                {{ $source }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-auto">
                    <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Search</label>
                    <div class="input-group shadow-xs">
                        <input type="text" name="search" class="form-control" placeholder="Search filename..." value="{{ request('search') }}">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-auto d-flex align-items-end">
                    @if(request()->anyFilled(['source', 'search']))
                        <a href="{{ route('admin.gallery.index') }}" class="btn btn-link text-muted small">
                            <i class="fas fa-times-circle mr-1"></i> Clear
                        </a>
                    @endif
                </div>
            </form>
        </div>
    </div>

    <div class="gallery-container pb-5">
        <div class="row">
            @forelse($mediaItems as $media)
                <div class="col-6 col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 border-0 shadow-sm gallery-card overflow-hidden" style="border-radius: 15px;">
                        <div class="position-relative">
                            <img src="{{ $media->getUrl() }}" 
                                 class="card-img-top img-fluid" 
                                 alt="{{ $media->name }}" 
                                 style="height: 180px; object-fit: cover;">
                            
                            <div class="gallery-overlay d-flex align-items-center justify-content-center">
                                <button type="button" class="btn btn-light btn-sm mx-1 rounded-circle shadow-sm" data-toggle="modal" data-target="#replaceModal{{ $media->id }}" title="Replace Asset">
                                    <i class="fas fa-sync-alt text-primary"></i>
                                </button>
                                <form action="{{ route('admin.gallery.destroy', $media->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Delete this media permanently?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-light btn-sm mx-1 rounded-circle shadow-sm" title="Delete">
                                        <i class="fas fa-trash text-danger"></i>
                                    </button>
                                </form>
                                <a href="{{ $media->getUrl() }}" target="_blank" class="btn btn-light btn-sm mx-1 rounded-circle shadow-sm" title="Fullscreen">
                                    <i class="fas fa-expand text-primary"></i>
                                </a>
                            </div>

                            <span class="badge badge-light position-absolute m-2 px-2 py-1 shadow-sm" style="top:0; right:0; border-radius: 8px; font-size: 0.7rem; opacity: 0.9;">
                                {{ number_format($media->size / 1024, 0) }} KB
                            </span>
                        </div>
                        <div class="card-body p-3">
                            <div class="mb-2">
                                <span class="badge badge-primary small mb-1">{{ Str::afterLast($media->model_type, '\\') }} #{{ $media->model_id }}</span>
                                <span class="badge badge-secondary small ml-1">{{ $media->collection_name }}</span>
                            </div>
                            <h6 class="font-weight-bold text-truncate small mb-1" title="{{ $media->file_name }}">{{ $media->file_name }}</h6>
                            <p class="small text-muted mb-0 opacity-75">
                                <i class="far fa-clock mr-1"></i> {{ $media->created_at->diffForHumans() }}
                            </p>
                        </div>
                    </div>
                </div>

                {{-- Replace Modal --}}
                <div class="modal fade" id="replaceModal{{ $media->id }}" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content border-0 shadow" style="border-radius: 15px;">
                            <div class="modal-header border-0 pb-0">
                                <h5 class="modal-title font-weight-bold">Replace System Asset</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form action="{{ route('admin.gallery.update', $media->id) }}" method="POST" enctype="multipart/form-data">
                                @csrf
                                @method('PUT')
                                <div class="modal-body p-4">
                                    <div class="p-3 bg-light rounded mb-4 text-center">
                                        <p class="small text-muted mb-2">Current File:</p>
                                        <img src="{{ $media->getUrl() }}" class="img-thumbnail" style="max-height: 100px;">
                                        <div class="mt-2 small text-dark font-weight-bold">{{ $media->file_name }}</div>
                                    </div>
                                    <div class="form-group mb-0">
                                        <label class="small font-weight-bold">Choose Replacement File</label>
                                        <div class="custom-file">
                                            <input type="file" name="image" class="custom-file-input" id="replaceFile{{ $media->id }}" required>
                                            <label class="custom-file-label" for="replaceFile{{ $media->id }}">Select new image...</label>
                                        </div>
                                        <small class="text-danger mt-2 d-block">Warning: This will update the image across all modules using this specific asset.</small>
                                    </div>
                                </div>
                                <div class="modal-footer border-0 pt-0">
                                    <button type="button" class="btn btn-light font-weight-bold" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-primary font-weight-bold">Update File Everywhere</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-12 text-center py-5">
                    <div class="mb-4">
                        <i class="fas fa-images fa-4x text-muted opacity-25"></i>
                    </div>
                    <h4 class="text-muted">No media matching your criteria</h4>
                    <p class="text-muted">Try clearing your filters or uploading a new asset.</p>
                </div>
            @endforelse
        </div>

        <div class="d-flex justify-content-center mt-4">
            {{ $mediaItems->links() }}
        </div>
    </div>

    {{-- Upload Modal (Creates a Gallery item) --}}
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow" style="border-radius: 15px;">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title font-weight-bold">New Standalone Asset</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{ route('admin.gallery.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body p-4">
                        <div class="form-group mb-3 text-center">
                            <div class="upload-area p-5 border-dashed rounded" style="border: 2px dashed #dee2e6; cursor: pointer;" onclick="document.getElementById('newAssetFile').click();">
                                <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-2"></i>
                                <p class="mb-0 font-weight-bold">Click to Upload</p>
                                <small class="text-muted">Will be stored under "Gallery"</small>
                            </div>
                            <input type="file" name="image" class="d-none" id="newAssetFile" required onchange="updateFileName(this)">
                            <div id="fileNameDisplay" class="mt-2 text-success font-weight-bold small"></div>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold">Title / Label</label>
                            <input type="text" name="title" class="form-control" placeholder="e.g. Website Logo Large">
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light font-weight-bold" data-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary font-weight-bold">Upload to Gallery</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop

@section('css')
    <style>
        .btn-primary { background-color: var(--primary); border-color: var(--primary); color: #fff; }
        .btn-primary:hover { background-color: var(--primary); filter: brightness(90%); border-color: var(--primary); color: #fff; }
        .badge-primary { background-color: var(--primary); color: #fff; }
        .text-primary { color: var(--primary) !important; }
        .border-dashed { border-style: dashed !important; }
        
        .gallery-card { position: relative; transition: all 0.3s ease; }
        .gallery-card:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(0,0,0,0.12) !important; }
        
        .gallery-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(2px);
        }
        .gallery-card:hover .gallery-overlay { opacity: 1; }
        
        .upload-area:hover { background-color: #f8f9fa; border-color: var(--primary) !important; }
        .opacity-25 { opacity: 0.25; }
        .opacity-75 { opacity: 0.75; }
    </style>
@stop

@section('js')
    <script>
        function updateFileName(input) {
            const fileName = input.files[0] ? input.files[0].name : '';
            document.getElementById('fileNameDisplay').textContent = fileName ? 'Selected: ' + fileName : '';
        }
        
        $(".custom-file-input").on("change", function() {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        });
    </script>
@stop
