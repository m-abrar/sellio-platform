@extends('adminlte::page')

@section('title', (isset($event) ? 'Edit' : 'Create') . ' Event')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-calendar-alt mr-2 text-primary"></i> 
                    {{ isset($event) ? 'Modify Event' : 'New Event Listing' }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.events.index') }}" class="btn btn-default btn-flat btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Listings
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ isset($event) ? route('admin.events.update', $event->id) : route('admin.events.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($event)) @method('PATCH') @endif

        <div class="row">
            {{-- Main Content Column --}}
            <div class="col-md-8">
                {{-- Basic Information --}}
                <div class="card card-primary card-outline shadow-sm">
                    <div class="card-header border-0 bg-white py-3">
                        <h3 class="card-title font-weight-bold text-dark">General Information</h3>
                    </div>
                    <div class="card-body">
                        <div class="form-group mb-4">
                            <label class="font-weight-600"><i class="fas fa-calendar-alt mr-1 text-primary"></i> Event Title <span class="text-danger">*</span></label>
                            <input type="text" name="title" id="title" class="form-control form-control-lg form-control-border @error('title') is-invalid @enderror" value="{{ old('title', $event->title ?? '') }}" required list="event-title-suggestions">
                            <datalist id="event-title-suggestions">
                                @foreach(\App\Models\Event::select('title')->distinct()->limit(20)->pluck('title') as $title)
                                    <option value="{{ $title }}">
                                @endforeach
                            </datalist>
                            @error('title') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-4">
                            <label for="slug" class="font-weight-600">URL Slug</label>
                            <input type="text" name="slug" id="slug" class="form-control form-control-lg form-control-border @error('slug') is-invalid @enderror" placeholder="auto-generated-slug" value="{{ old('slug', $event->slug ?? '') }}">
                            @error('slug') <span class="invalid-feedback">{{ $message }}</span> @enderror
                        </div>

                        <div class="form-group mb-0">
                            <label class="font-weight-600">Full Description <span class="text-danger">*</span></label>
                            <textarea name="description" rows="6" class="form-control @error('description') is-invalid @enderror" placeholder="Describe the event itinerary, speakers, and perks...">{{ old('description', $event->description ?? '') }}</textarea>
                        </div>
                    </div>
                </div>

                {{-- Schedule & Location --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Schedule & Venue</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group"><label>Start Date & Time <span class="text-danger">*</span></label><input type="datetime-local" name="start_date_time" class="form-control" value="{{ old('start_date_time', isset($event) ? \Carbon\Carbon::parse($event->start_date_time)->format('Y-m-d\TH:i') : '') }}" required></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>End Date & Time <span class="text-danger">*</span></label><input type="datetime-local" name="end_date_time" class="form-control" value="{{ old('end_date_time', isset($event) ? \Carbon\Carbon::parse($event->end_date_time)->format('Y-m-d\TH:i') : '') }}" required></div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-6">
                                <div class="form-group"><label>Max Attendees</label><input type="number" name="max_attendees" class="form-control" placeholder="Unlimited if blank" value="{{ old('max_attendees', $event->max_attendees ?? '') }}"></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Venue Address</label><input type="text" name="address" class="form-control" placeholder="Street layout" value="{{ old('address', $event->address ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Pricing --}}
                <div class="card shadow-sm border-0">
                    <div class="card-header border-0 bg-light">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">Pricing Setup</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group"><label>Base Ticket Price <span class="text-danger">*</span></label><input type="number" step="0.01" name="base_price" class="form-control" value="{{ old('base_price', $event->base_price ?? '0') }}" required></div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group"><label>Discounted Price</label><input type="number" step="0.01" name="sale_price" class="form-control" value="{{ old('sale_price', $event->sale_price ?? '') }}"></div>
                            </div>
                        </div>
                    </div>
                </div>



                {{-- Gallery --}}
                <div class="card shadow-sm border-0">
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Event::GALLERY_MEDIA,
                            'label' => 'Event Gallery Photos',
                            'multiple' => true,
                            'model' => \App\Models\Event::class,
                            'id' => $event->id ?? null,
                        ])
                    </div>
                </div>

                @if(isset($event))
                {{-- Recent Bookings --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-ticket-alt mr-2 text-warning"></i> Recent Bookings</h3></div>
                    <div class="card-body p-0">
                        <table class="table table-sm table-hover mb-0">
                            <thead><tr><th>User</th><th>Quantity</th><th>Date</th></tr></thead>
                            <tbody>
                                @forelse($recentBookings ?? [] as $bk)
                                    <tr><td>{{ $bk->user->name ?? 'Guest' }}</td><td>{{ $bk->quantity ?? 1 }}</td><td>{{ $bk->created_at->format('M d') }}</td></tr>
                                @empty
                                    <tr><td colspan="3" class="text-center py-3 text-muted">No bookings yet</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
                @endif
                {{-- Display & Billing Options --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-bold text-dark"><i class="fas fa-cog mr-2 text-secondary"></i> Display & Pricing Options</h3></div>
                    <div class="card-body">
                        <div class="row">
                            @php
                                $toggles = [
                                    ['name' => 'is_paid', 'id' => 'isPaid', 'label' => 'Paid Event', 'status' => 'Ticketing', 'checked' => old('is_paid', $event->is_paid ?? false)],
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
                @include('admin.events.partials.action-buttons')

                {{-- Primary Media --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white">
                        <h3 class="card-title font-weight-600 small text-uppercase">Primary Image</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\Event::PRIMARY_MEDIA,
                            'label' => 'Main Listing Image',
                            'multiple' => false,
                            'model' => \App\Models\Event::class,
                            'id' => $event->id ?? null,
                        ])
                    </div>
                </div>

                {{-- Classification --}}
                <div class="card shadow-sm border-0 mt-4">
                    <div class="card-header bg-white"><h3 class="card-title font-weight-600 small text-uppercase">Classification</h3></div>
                    <div class="card-body">
                        <div class="form-group"><label class="small font-weight-bold">Category</label><select name="category_id" class="form-control select2" required><option value="">Select Category</option>@foreach($categories ?? [] as $cat)<option value="{{ $cat->id }}" {{ (old('category_id', $event->category_id ?? '') == $cat->id) ? 'selected' : '' }}>{{ $cat->title }}</option>@endforeach</select></div>
                        <div class="form-group"><label class="small font-weight-bold">Location</label><select name="location_id" class="form-control select2"><option value="">Select Location</option>@foreach($locations ?? [] as $loc)<option value="{{ $loc->id }}" {{ (old('location_id', $event->location_id ?? '') == $loc->id) ? 'selected' : '' }}>{{ $loc->name }}</option>@endforeach</select></div>
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

@if(isset($event))
    <form id="delete-form" action="{{ route('admin.events.destroy', $event->id) }}" method="POST" class="d-none">
        @csrf @method('DELETE')
    </form>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        function triggerDelete() {
            Swal.fire({
                title: 'Are you sure?',
                text: "Permanently delete this event listing?",
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
