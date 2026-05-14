@extends('admin.settings.settings-layout')

@section('setting-form-content')
<form action="{{ route('admin.settings.update.group', ['section' => 'social']) }}" method="POST">
    @csrf
    <div class="card border-0 shadow-premium rounded-24">
        <div class="card-header bg-white py-4 px-4 border-0">
            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1 float-none d-block">
                <i class="fas fa-share-alt mr-2 text-primary opacity-50"></i> {{ __('Social Connectivity') }}
            </h3>
            <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-1 mb-0 mt-1">{{ __('Manage official social ecosystem links to enhance platform reach and brand authority.') }}</p>
        </div>
        <div class="card-body px-4 pb-2">
            <div class="row">
                @php
                    $socials = [
                        'facebook_url'  => ['icon' => 'fab fa-facebook', 'class' => 'text-facebook', 'label' => __('Facebook')],
                        'twitter_url'   => ['icon' => 'fab fa-twitter', 'class' => 'text-twitter', 'label' => __('Twitter / X')],
                        'instagram_url' => ['icon' => 'fab fa-instagram', 'class' => 'text-instagram', 'label' => __('Instagram')],
                        'linkedin_url'  => ['icon' => 'fab fa-linkedin', 'class' => 'text-linkedin', 'label' => __('LinkedIn')],
                        'youtube_url'   => ['icon' => 'fab fa-youtube', 'class' => 'text-youtube', 'label' => __('YouTube')],
                    ];
                @endphp

                @foreach($socials as $key => $social)
                <div class="col-md-6 mb-4">
                    <div class="form-group">
                        <label class="small font-weight-bold text-uppercase text-secondary mb-2 ls-05">{{ $social['label'] }} {{ __('Profile') }}</label>
                        <div class="input-group shadow-xs">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="{{ $social['icon'] }} {{ $social['class'] }}"></i></span>
                            </div>
                            <input type="url" name="{{ $key }}" class="form-control" value="{{ old($key, $settings[$key] ?? '') }}" placeholder="https://{{ strtolower(str_replace([' ', '/'], '', $social['label'])) }}.com/your-profile">
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
        <div class="card-footer bg-light py-4 px-4 border-0 text-right">
            <button type="submit" class="btn btn-primary rounded-pill px-5 font-weight-bold">
                <i class="fas fa-link mr-2"></i> {{ __('Sync Social Profiles') }}
            </button>
        </div>
    </div>
</form>
@endsection
