{{--
    Standard Navigation Back Button
    
    Provides a consistent return navigation path in administrative forms.
    Supports dynamic route redirection and custom labeling.
    
    @param string $route (Optional) The route name to return to. Default: admin.welcome
    @param string $label (Optional) The button text. Default: DASHBOARD
--}}
<a href="{{ route($route ?? 'admin.welcome') }}" class="btn btn-back">
    <i class="fas fa-chevron-left"></i>
    <span>{{ $label ?? 'DASHBOARD' }}</span>
</a>

                