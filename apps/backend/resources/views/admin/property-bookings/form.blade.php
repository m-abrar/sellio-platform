@extends('adminlte::page')
@section('plugins.Select2', true)

@php
    $isEdit = $booking->exists;
    $title = $isEdit ? __('Edit Booking') . ' #' . $booking->id : __('Create New Booking');
@endphp

@section('title', $title)

@section('content_header')
    <div class="d-flex justify-content-between align-items-center">
        <h1>
            <i class="fas fa-calendar-alt text-primary mr-2"></i>
            {{ $title }}
        </h1>
        <a href="{{ route('admin.property-bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
        </a>
    </div>
@stop

@section('content')
    <div class="container-fluid">
        @include('admin.alert')

        <div class="row">
            {{-- Form Section --}}
            <div class="col-md-7">
                <div class="card card-outline {{ $isEdit ? 'card-primary' : 'card-success' }} shadow-sm">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-edit mr-1"></i> {{ __('Booking Information') }}
                        </h3>
                    </div>
                    <form action="{{ $isEdit ? route('admin.property-bookings.update', $booking->id) : route('admin.property-bookings.store') }}" 
                          method="POST">
                        @csrf
                        @if($isEdit)
                            @method('PUT')
                        @endif

                        <div class="card-body">
                            <div class="row">
                                {{-- Property Selection --}}
                                <div class="col-md-6 form-group">
                                    <label for="property_id">{{ __('Property') }} <span class="text-danger">*</span></label>
                                    <select name="property_id" id="property_id" class="form-control select2 @error('property_id') is-invalid @enderror" required>
                                        <option value="">{{ __('Select Property') }}</option>
                                        @foreach($properties as $property)
                                            <option value="{{ $property->id }}" {{ (old('property_id', $booking->property_id ?? '') == $property->id) ? 'selected' : '' }}>
                                                {{ $property->title }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('property_id')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>

                                {{-- User/Customer Selection --}}
                                <div class="col-md-6 form-group">
                                    <label for="user_id">{{ __('User / Account') }}</label>
                                    <select name="user_id" id="user_id" class="form-control select2 @error('user_id') is-invalid @enderror">
                                        <option value="">{{ __('Guest / No Account') }}</option>
                                        @foreach($users as $user)
                                            <option value="{{ $user->id }}" {{ (old('user_id', $booking->user_id ?? '') == $user->id) ? 'selected' : '' }}>
                                                {{ $user->name }} ({{ $user->email }})
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('user_id')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>
                            </div>

                            <hr class="my-3">

                            <div class="row">
                                {{-- Guest Name --}}
                                <div class="col-md-6 form-group">
                                    <label for="full_name">{{ __('Guest Full Name') }} <span class="text-danger">*</span></label>
                                    <input type="text" name="full_name" id="full_name" class="form-control @error('full_name') is-invalid @enderror" 
                                           value="{{ old('full_name', $booking->full_name ?? '') }}" required>
                                    @error('full_name')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>

                                {{-- Email --}}
                                <div class="col-md-6 form-group">
                                    <label for="email">{{ __('Email Address') }} <span class="text-danger">*</span></label>
                                    <input type="email" name="email" id="email" class="form-control @error('email') is-invalid @enderror" 
                                           value="{{ old('email', $booking->email ?? '') }}" required>
                                    @error('email')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>
                            </div>

                            <div class="row">
                                {{-- Phone --}}
                                <div class="col-md-6 form-group">
                                    <label for="phone">{{ __('Phone Number') }}</label>
                                    <input type="text" name="phone" id="phone" class="form-control @error('phone') is-invalid @enderror" 
                                           value="{{ old('phone', $booking->phone ?? '') }}">
                                    @error('phone')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>

                                {{-- Guests count --}}
                                <div class="col-md-6 form-group">
                                    <label for="guests">{{ __('Number of Guests') }} <span class="text-danger">*</span></label>
                                    <input type="number" name="guests" id="guests" min="1" class="form-control @error('guests') is-invalid @enderror" 
                                           value="{{ old('guests', $booking->guests ?? 1) }}" required>
                                    @error('guests')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>
                            </div>

                            <hr class="my-3">

                            <div class="row">
                                {{-- Check-in date --}}
                                <div class="col-md-6 form-group">
                                    <label for="check_in_date">{{ __('Check-In Date') }} <span class="text-danger">*</span></label>
                                    <input type="date" name="check_in_date" id="check_in_date" class="form-control @error('check_in_date') is-invalid @enderror" 
                                           value="{{ old('check_in_date', $booking->exists ? $booking->check_in_date->format('Y-m-d') : '') }}" required>
                                    @error('check_in_date')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>

                                {{-- Check-out date --}}
                                <div class="col-md-6 form-group">
                                    <label for="check_out_date">{{ __('Check-Out Date') }} <span class="text-danger">*</span></label>
                                    <input type="date" name="check_out_date" id="check_out_date" class="form-control @error('check_out_date') is-invalid @enderror" 
                                           value="{{ old('check_out_date', $booking->exists ? $booking->check_out_date->format('Y-m-d') : '') }}" required>
                                    @error('check_out_date')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>
                            </div>

                            <div class="row">
                                {{-- Status --}}
                                <div class="col-md-6 form-group">
                                    <label for="status">{{ __('Status') }} <span class="text-danger">*</span></label>
                                    <select name="status" id="status" class="form-control @error('status') is-invalid @enderror" required>
                                        @foreach(['pending', 'confirmed', 'cancelled'] as $status)
                                            <option value="{{ $status }}" {{ (old('status', $booking->status ?? 'pending') == $status) ? 'selected' : '' }}>
                                                {{ Str::title($status) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('status')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>

                                {{-- Total Price --}}
                                <div class="col-md-6 form-group">
                                    <label for="total_price">{{ __('Total Price ($)') }} <span class="text-danger">*</span></label>
                                    <input type="number" step="0.01" name="total_price" id="total_price" class="form-control @error('total_price') is-invalid @enderror" 
                                           value="{{ old('total_price', $booking->total_price ?? '0.00') }}" required>
                                    @error('total_price')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="message">{{ __('Notes / Messages') }}</label>
                                <textarea name="message" id="message" rows="4" class="form-control @error('message') is-invalid @enderror">{{ old('message', $booking->message ?? '') }}</textarea>
                                @error('message')<span class="error invalid-feedback">{{ $message }}</span>@enderror
                            </div>
                        </div>

                        <div class="card-footer bg-white text-right">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save mr-1"></i> {{ $isEdit ? __('Update Booking') : __('Create Booking') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {{-- Sidebar or Calendar Section --}}
            <div class="col-md-5">
                <div class="card card-outline card-secondary shadow-sm">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fas fa-calendar-alt mr-1"></i> {{ __('Availability Calendar') }}</h3>
                    </div>
                    <div class="card-body">
                        @if(isset($calendarEvents))
                            <div id="calendar" style="height: 400px; max-height: 450px;"></div>
                            <div class="mt-3">
                                <h6>Legend:</h6>
                                <span class="badge" style="background-color: #fde68a;">Pending</span>
                                <span class="badge" style="background-color: #bbf7d0;">Confirmed</span>
                                <span class="badge" style="background-color: #fecaca;">Cancelled</span>
                                <span class="badge" style="background-color: #93c5fd;">Current Editing</span>
                            </div>
                        @else
                            <div class="text-center text-muted py-5">
                                <i class="fas fa-calendar-times fa-3x mb-2"></i>
                                <p>{{ __('Calendar visualized on Edit mode only.') }}</p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@section('css')
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <style>
        .select2-container--default .select2-selection--single {
            height: 38px !important;
            border: 1px solid #ced4da !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            line-height: 38px !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 36px !important;
        }
    </style>
@stop

@section('js')
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
    <script>
        $(document).ready(function() {
            // Initialize Select2
            $('.select2').select2({
                theme: 'default',
                width: '100%',
                placeholder: "{{ __('Search or select...') }}",
                allowClear: true
            });

            @if(isset($calendarEvents))
                const calendarEl = document.getElementById('calendar');
                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    themeSystem: 'bootstrap',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    },
                    events: @json($calendarEvents),
                    height: 'auto'
                });
                calendar.render();
            @endif
        });
    </script>
@stop
