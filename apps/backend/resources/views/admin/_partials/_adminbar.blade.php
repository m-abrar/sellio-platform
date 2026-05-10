{{--
    Administrative Quick Access Bar (Admin Bar)
    
    This partial renders a floating utility bar at the top of the viewport 
    for authenticated administrators. It provides rapid access to the 
    dashboard, theme settings, content management, and menu configuration.
    
    @layout resources/views/admin/layout.blade.php
    @context Authenticated Admin
--}}
<div id="admin-bar" role="navigation" aria-label="Admin Quick Bar">
  <div class="container d-flex justify-content-between align-items-center h-100">
    
    {{-- Left Side: Primary Navigation --}}
    <div class="admin-bar-left d-flex align-items-center">
      
      {{-- 1. Dashboard --}}
      <a href="{{ route('admin.welcome') }}" class="me-3">
        <i class="fas fa-tachometer-alt me-1"></i>{{ __('Dashboard') }}
      </a>
      
      <span class="separator">|</span>

      {{-- 2. Quick Actions (Add New) --}}
      <div class="dropdown me-3">
        <a class="dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-plus-circle me-1"></i>{{ __('Add New') }}
        </a>
        <ul class="dropdown-menu dropdown-menu-dark">
          {{-- Note: Replace '#' with your actual route names --}}
          <li><a class="dropdown-item" href="#"><i class="fas fa-building me-2"></i>{{ __('New Listing') }}</a></li>
          <li><a class="dropdown-item" href="#"><i class="fas fa-user-plus me-2"></i>{{ __('New User') }}</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#"><i class="fas fa-file-alt me-2"></i>{{ __('New Page') }}</a></li>
          <li><a class="dropdown-item" href="#"><i class="fas fa-blog me-2"></i>{{ __('New Blog') }}</a></li>
        </ul>
      </div>

      <span class="separator">|</span>

      {{-- 3. Theme Context --}}
      <div class="me-3">
        @if(isset($activeTheme))
          <a href="{{ route('admin.themes.edit', $activeTheme->id) }}" class="text-decoration-none">
            <i class="fas fa-palette me-1"></i>
            <span class="badge bg-primary">{{ $activeTheme->theme_key }}</span>
          </a>
        @endif
      </div>

      <span class="separator">|</span>

      {{-- 4. Content Management (Dynamic Pages) --}}
      <div class="dropdown me-3">
        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-edit me-1"></i>{{ __('Edit Content') }}
        </a>
        <ul class="dropdown-menu dropdown-menu-dark">
          {{-- Ensure $themePages is shared via View::share in Middleware or ServiceProvider --}}
          @forelse ($themePages ?? [] as $page)
            <li>
              <a class="dropdown-item text-capitalize" href="{{ route('admin.content.edit', ['page' => $page->page, 'theme_key' => $activeTheme->theme_key ?? '']) }}">
                <i class="fas fa-file me-2"></i>{{ $page->page }}
              </a>
            </li>
          @empty
            <li><a class="dropdown-item disabled"><i class="fas fa-exclamation-triangle me-2"></i>{{ __('No theme pages') }}</a></li>
          @endforelse
          <li><hr class="dropdown-divider border-light"></li>
          <li><a class="dropdown-item" href="{{ route('admin.pages.index') }}"><i class="fas fa-list me-2"></i>{{ __('Manage Pages') }}</a></li>
        </ul>
      </div>

      <span class="separator">|</span>

      {{-- 5. Menus Quick Access --}}
      <div class="dropdown me-3">
        <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-bars me-1"></i>{{ __('Menus') }}
        </a>
        <ul class="dropdown-menu dropdown-menu-dark">
            <li><h6 class="dropdown-header">{{ __('Quick Edit') }}</h6></li>

            {{-- Use the helper to get menus for the current theme --}}
            @forelse (get_menus_list() as $menu)
                <li>
                    <a class="dropdown-item" href="{{ route('admin.menu.edit', $menu) }}">
                        <i class="fas fa-angle-right me-2"></i>{{ $menu->title }}
                    </a>
                </li>
            @empty
                <li><a class="dropdown-item disabled">{{ __('No menus defined') }}</a></li>
            @endforelse

            <li><hr class="dropdown-divider border-light"></li>
            
            <li>
                <a class="dropdown-item" href="{{ route('admin.menu.index', ['theme_key' => $activeTheme->theme_key ?? '']) }}">
                    <i class="fas fa-list-alt me-2"></i>{{ __('Manage All Menus') }}
                </a>
            </li>
        </ul>
      </div>

    </div>
    
    {{-- Right Side: Utility Actions --}}
    <div class="admin-bar-right d-flex align-items-center">
      <a href="{{ route('admin.settings.index') }}" class="me-3">
        <i class="fas fa-cog me-1"></i>{{ __('Settings') }}
      </a>
      
      <span class="separator">|</span>
      
      <a href="{{ route('logout') }}" class="text-danger fw-semibold" id="admin-logout-link">
        <i class="fas fa-sign-out-alt me-1"></i>{{ __('Logout') }}
      </a>
      <form id="admin-logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
        @csrf
      </form>

    </div>
    
  </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const logoutLink = document.getElementById('admin-logout-link');
        const logoutForm = document.getElementById('admin-logout-form');
        if (logoutLink && logoutForm) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                logoutForm.submit();
            });
        }
    });
</script>
