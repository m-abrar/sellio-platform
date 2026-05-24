<div class="theme-overlay">
    <div class="d-flex flex-column align-items-center">
        @if($theme->is_active)
            <span class="btn btn-success btn-sm font-weight-bold px-4 rounded-pill smallest shadow-premium mb-3">
                <i class="fas fa-check-circle mr-1"></i> {{ __('Active') }}
            </span>
        @else
            <form action="{{ route('admin.themes.activate', $theme->id) }}" method="POST" class="m-0 mb-3">
                @csrf
                <button type="submit" class="btn btn-primary btn-sm font-weight-bold px-4 shadow rounded-pill smallest">
                   <i class="fas fa-bolt mr-1"></i> {{ __('Activate') }}
                </button>
            </form>
        @endif
        
        <div class="d-flex justify-content-center gap-10">
            <a href="{{ config('app.storefront_url') }}/preview/{{ $theme->theme_key }}" target="_blank" class="btn btn-preview-premium btn-xs font-weight-bold px-3 shadow rounded-pill smallest" title="{{ __('Preview') }}">
                <i class="fas fa-eye mr-1"></i> {{ __('Preview') }}
            </a>
            <a href="{{ route('admin.content.edit', ['page' => 'home', 'theme_key' => $theme->theme_key]) }}" class="btn btn-settings-premium btn-xs font-weight-bold px-3 shadow rounded-pill smallest" title="{{ __('Customize Content') }}">
                <i class="fas fa-edit mr-1"></i> {{ __('Content') }}
            </a>
            <a href="{{ route('admin.themes.edit', $theme->id) }}" class="btn btn-settings-premium btn-xs font-weight-bold px-3 shadow rounded-pill smallest" title="{{ __('Settings') }}">
                <i class="fas fa-cog mr-1"></i> {{ __('Settings') }}
            </a>
        </div>
    </div>
</div>
