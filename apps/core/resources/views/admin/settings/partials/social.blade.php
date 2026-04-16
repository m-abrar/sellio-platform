@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'social']) }}" method="POST">
    @csrf
    <div class="card shadow-sm border-0">
        <div class="card-header bg-white py-3">
            <h3 class="card-title font-weight-bold text-dark">
                <i class="fas fa-share-alt mr-2 text-primary"></i>{{ __('Social Presence') }}
            </h3>
        </div>
        <div class="card-body bg-light-gray">
            <div class="row">
                @php
                    $socials = [
                        'facebook_url'  => ['icon' => 'fab fa-facebook', 'color' => '#1877F2', 'label' => 'Facebook'],
                        'twitter_url'   => ['icon' => 'fab fa-twitter', 'color' => '#1DA1F2', 'label' => 'Twitter / X'],
                        'instagram_url' => ['icon' => 'fab fa-instagram', 'color' => '#E4405F', 'label' => 'Instagram'],
                        'linkedin_url'  => ['icon' => 'fab fa-linkedin', 'color' => '#0A66C2', 'label' => 'LinkedIn'],
                        'youtube_url'   => ['icon' => 'fab fa-youtube', 'color' => '#FF0000', 'label' => 'YouTube'],
                    ];
                @endphp

                @foreach($socials as $key => $social)
                <div class="col-md-6 mb-3">
                    <div class="card border-0 shadow-xs">
                        <div class="card-body p-3">
                            <label class="small font-weight-bold"><i class="{{ $social['icon'] }} mr-1" style="color: {{ $social['color'] }}"></i> {{ $social['label'] }}</label>
                            <input type="text" name="{{ $key }}" class="form-control border-light" value="{{ old($key, $settings[$key] ?? '') }}" placeholder="https://...">
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        <div class="card-footer bg-white text-right">
            <button type="submit" class="btn btn-primary px-5 rounded-pill font-weight-bold">
                <i class="fas fa-sync mr-1"></i> {{ __('Update Social Links') }}
            </button>
        </div>
    </div>
</form>
@endsection
