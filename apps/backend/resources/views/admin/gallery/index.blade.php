{{--
    Administrative Media Module: Global Gallery Registry
    
    This view serves as the primary gateway for platform-wide media assets. 
    It orchestrates the discovery, replacement, and management of 
    diverse storage collections (listings, profile avatars, brand logos) 
    through a centralized visual interface.
    
    @extends adminlte::page
    @context Media Asset Management
    @variables Paginator $mediaItems Paginated collection of Media model instances.
    @variables Array $sources Array of unique media source collections.
--}}
@extends('adminlte::page')

@section('title', 'Global Media Manager | Admin Assets')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-photo-video mr-2 text-primary"></i> 
                    Central Media Manager
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Aggregate storage for marketplace listings, brand assets, and user uploads.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <button type="button" class="btn btn-primary rounded-pill px-4 font-weight-bold shadow-premium" data-toggle="modal" data-target="#uploadModal">
                        <i class="fas fa-plus-circle mr-1"></i> ADD STANDALONE ASSET
                    </button>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')
        {{-- Premium Filter Card --}}
        <div class="card glass-card shadow-sm mb-4 border-0" style="border-radius: 20px;">
            <div class="card-body py-3">
                <form action="{{ route('admin.gallery.index') }}" method="GET" class="row align-items-end justify-content-center">
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-2">Media Source</label>
                        <select name="source" class="form-control shadow-xs rounded-10" onchange="this.form.submit()">
                            <option value="">All Storage Collections</option>
                            @foreach($sources as $source)
                                <option value="{{ $source }}" {{ request('source') == $source ? 'selected' : '' }}>
                                    {{ $source }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="small text-muted font-weight-bold text-uppercase letter-spacing-1 mb-2">Keyword Search</label>
                        <div class="input-group shadow-xs">
                            <input type="text" name="search" class="form-control rounded-l-10" placeholder="Filename search..." value="{{ request('search') }}">
                            <div class="input-group-append">
                                <button class="btn btn-primary px-3 rounded-r-10" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto d-flex align-items-end">
                        @if(request()->anyFilled(['source', 'search']))
                            <a href="{{ route('admin.gallery.index') }}" class="btn btn-link text-muted small font-weight-bold">
                                <i class="fas fa-undo-alt mr-1"></i> RESET FILTERS
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
                        <div class="card h-100 border-0 shadow-sm gallery-card overflow-hidden" style="border-radius: 20px;">
                            <div class="position-relative">
                                <img src="{{ $media->getUrl() }}" 
                                     class="card-img-top img-fluid h-200-p object-fit-cover" 
                                     alt="{{ $media->name }}">
                                
                                <div class="gallery-overlay d-flex align-items-center justify-content-center">
                                    <button type="button" class="btn btn-white btn-sm mx-1 rounded-circle shadow-sm icon-box-38" data-toggle="modal" data-target="#replaceModal{{ $media->id }}" title="Replace Asset">
                                        <i class="fas fa-sync-alt text-primary"></i>
                                    </button>
                                    <form id="delete-form-{{ $media->id }}" action="{{ route('admin.gallery.destroy', $media->id) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('DELETE')
                                        <button type="button" class="btn btn-white btn-sm mx-1 rounded-circle shadow-sm icon-box-38" title="Delete" 
                                                onclick="confirmDelete('delete-form-{{ $media->id }}', 'Delete Asset?', 'This operation is permanent and may break linked listings!', 'Delete It')">
                                            <i class="fas fa-trash text-danger"></i>
                                        </button>
                                    </form>
                                    <a href="{{ $media->getUrl() }}" target="_blank" class="btn btn-white btn-sm mx-1 rounded-circle shadow-sm icon-box-38" title="Fullscreen">
                                        <i class="fas fa-expand text-primary"></i>
                                    </a>
                                </div>

                                <span class="badge badge-dark position-absolute m-3 px-2 py-1 shadow-sm top-0 right-0 rounded-8 smallest-0-65 opacity-80 ls-0-5">
                                    {{ number_format($media->size / 1024, 0) }} KB
                                </span>
                            </div>
                            <div class="card-body p-3">
                                <div class="mb-2">
                                    <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1">{{ Str::afterLast($media->model_type, '\\') }} #{{ $media->model_id }}</span>
                                    <span class="badge badge-secondary-soft text-muted px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 ml-1">{{ $media->collection_name }}</span>
                                </div>
                                <h6 class="font-weight-bold text-truncate text-dark mb-1 font-0-85" title="{{ $media->file_name }}">{{ $media->file_name }}</h6>
                                <p class="small text-muted mb-0 opacity-75">
                                    <i class="far fa-clock mr-1"></i> {{ $media->created_at->diffForHumans() }}
                                </p>
                            </div>
                        </div>
                    </div>

                    {{-- Replace Modal --}}
                    <div class="modal fade" id="replaceModal{{ $media->id }}" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header border-0">
                                    <h5 class="modal-title">Replace Media Asset</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form action="{{ route('admin.gallery.update', $media->id) }}" method="POST" enctype="multipart/form-data">
                                    @csrf
                                    @method('PUT')
                                    <div class="modal-body p-4">
                                        <div class="p-3 bg-light rounded-xl mb-4 text-center border">
                                            <p class="small text-muted mb-2 font-weight-bold text-uppercase" style="letter-spacing: 1px;">Current Version</p>
                                            <img src="{{ $media->getUrl() }}" class="img-thumbnail border-0 shadow-sm h-max-120 rounded-12">
                                            <div class="mt-2 small text-dark font-weight-bold">{{ $media->file_name }}</div>
                                        </div>
                                        <div class="form-group mb-0">
                                            <label class="small font-weight-bold text-secondary text-uppercase mb-2">New Media Source</label>
                                            <div class="custom-file">
                                                <input type="file" name="image" class="custom-file-input" id="replaceFile{{ $media->id }}" required>
                                                <label class="custom-file-label rounded-10" for="replaceFile{{ $media->id }}">Select new image...</label>
                                            </div>
                                            <div class="bg-warning-light text-warning p-3 rounded-lg mt-3 small border border-warning-soft">
                                                <i class="fas fa-exclamation-triangle mr-1"></i> <strong>Atenntion:</strong> This replacement will propagate to all listings and modules linked to this asset ID.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer border-0">
                                        <button type="button" class="btn btn-light rounded-pill px-4 font-weight-bold" data-dismiss="modal">CANCEL</button>
                                        <button type="submit" class="btn btn-primary rounded-pill px-4 font-weight-bold">UPDATE ASSET</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="mb-4">
                            <i class="fas fa-images fa-5x text-muted opacity-25"></i>
                        </div>
                        <h4 class="text-muted font-weight-bold">Vault is Empty</h4>
                        <p class="text-muted">No media matching your current filters was found in the central storage.</p>
                    </div>
                @endforelse
            </div>

            <div class="d-flex justify-content-center mt-4">
                {{ $mediaItems->links() }}
            </div>
        </div>
    </div>

    {{-- Upload Modal --}}
    <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title">New Standalone Asset</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form action="{{ route('admin.gallery.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body p-4">
                        <div class="form-group mb-4 text-center">
                            <div class="upload-area p-5 border-dashed-2 rounded-xl bg-light transition-0-3" onclick="document.getElementById('newAssetFile').click();">
                                <div class="icon-circle bg-white shadow-sm mx-auto mb-3 icon-box-60 rounded-circle d-flex align-items-center justify-content-center">
                                    <i class="fas fa-cloud-upload-alt fa-lg text-primary"></i>
                                </div>
                                <p class="mb-1 font-weight-bold text-dark">Click to select asset</p>
                                <small class="text-muted">Will be indexed in "Gallery" collection</small>
                            </div>
                            <input type="file" name="image" class="d-none" id="newAssetFile" required onchange="updateFileName(this)">
                            <div id="fileNameDisplay" class="mt-3 text-primary font-weight-bold small"></div>
                        </div>
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-secondary text-uppercase mb-2">Descriptive Title</label>
                            <input type="text" name="title" class="form-control rounded-10" placeholder="e.g. Hero Banner Winter 2024">
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-light rounded-pill px-4 font-weight-bold" data-dismiss="modal">CANCEL</button>
                        <button type="submit" class="btn btn-primary rounded-pill px-4 font-weight-bold">START UPLOAD</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@stop

@section('js')
@include('admin._partials._sweetalert')
<script>
    function updateFileName(input) {
        const fileName = input.files[0] ? input.files[0].name : '';
        document.getElementById('fileNameDisplay').innerHTML = fileName ? '<i class="fas fa-check-circle mr-1"></i> Ready: ' + fileName : '';
    }
    
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
</script>
@stop
