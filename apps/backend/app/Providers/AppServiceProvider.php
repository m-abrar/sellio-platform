<?php

namespace App\Providers;

use App\Services\CartService;
use App\DTOs\ContentResult; // Import the DTO
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\{View, Auth, Gate, Event, Session, Storage, Cache, Blade};
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Pagination\Paginator;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CartService::class, fn() => new CartService());
    }

    public function boot(CartService $cartService): void
    {
        Paginator::useBootstrapFive();

        // 0. API Documentation Hardening
        Gate::define('viewApiDocs', function ($user = null) {
            return $user?->hasRole(['admin', 'super-admin']) || app()->isLocal();
        });

        // 1. Dynamic Config for Admin Branding
        if (!$this->app->runningInConsole()) {
            $siteName = setting('site_name', config('app.name'));
            $faviconPath = setting('site_favicon');
            $logoPath = setting('site_logo');

            // Determine the URL for the brand mark (Favicon Preferred, then Logo, then Static Config)
            $faviconUrl = $faviconPath ? Storage::url($faviconPath) : ($logoPath ? Storage::url($logoPath) : config('adminlte.logo_img'));

            config([
                'adminlte.logo' => $siteName,
                'adminlte.logo_img' => $faviconUrl, // Sidebar Icon
                'adminlte.logo_img_alt' => $siteName,
                'adminlte.preloader.img.path' => $faviconUrl,
                'adminlte.use_full_favicon' => false,
                'adminlte.use_ico_only' => true,
            ]);
        }

        // 2. Cart Logic & Global Branding for Frontend
        Event::listen(Authenticated::class, function ($event) use ($cartService) {
            if (!Session::has('cart_merging_processed')) {
                $cartService->mergeGuestCart($event->user->id);
                Session::put('cart_merging_processed', true);
            }
        });

        // 3. Global View Composer (Common Branding)
        View::composer(['frontend._layouts._app', 'frontend._layouts._guest'], function ($view) use ($cartService) {
            $faviconPath = setting('site_favicon');
            $logoPath = setting('site_logo');
            $activeTheme = Cache::rememberForever('active_theme_model', fn() => \App\Models\Theme::where('is_active', 1)->first());

            $view->with([
                'cartCount'         => $cartService->getCount(),
                'notificationCount' => $this->getNotificationCount(),
                'siteName'          => Cache::rememberForever('site_name', fn() => setting('site_name', config('app.name'))),
                'siteFavicon'       => $faviconPath ? Storage::url($faviconPath) : ($logoPath ? Storage::url($logoPath) : asset('images/app-logo.webp')),
                'activeTheme'       => $activeTheme,
            ]);
        });

        // 3. Aligned Blade Directive (Matching your CSS)
        Blade::directive('editable', function ($expression) {
            return "<?php 
                \$data = page_content($expression);
                
                if (\$data instanceof \App\DTOs\ContentResult) {
                    \$editUrl = route('admin.content.edit.item', ['id' => \$data->id]);
                    // Added d-inline-flex and align-items-center to help with vertical alignment
                    echo '<span class=\"editable-group d-inline-flex align-items-center\">';
                        echo '<span class=\"editable-text\">' . e(\$data->value) . '</span>';
                        echo '<a href=\"' . \$editUrl . '\" class=\"edit-link\" target=\"_blank\">';
                            echo '<i class=\"fa-solid fa-pencil edit-icon\"></i>';
                        echo '</a>';
                    echo '</span>';
                } else {
                    echo e(\$data);
                }
            ?>";
        });
    }

    protected function getNotificationCount(): int
    {
        if (!Auth::check()) return 0;
        return Cache::remember('user_notif_count_' . Auth::id(), 60, fn() => Auth::user()->unreadNotifications()->count());
    }
}
