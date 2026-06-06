<?php

namespace App\Providers;

use App\Services\CartService;
use App\DTOs\ContentResult; // Import the DTO
use App\Events\JobApplicationReceived;
use App\Events\NewMessageSent;
use App\Events\Partner\PartnerLeadCreated;
use App\Events\ReviewReceived;
use App\Listeners\Partner\SendPartnerDatabaseNotification;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\{View, Auth, Gate, Event, Session, Storage, Cache, Blade, Schema};
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

        // 1. Super Admin Privilege Escalation (Global Interceptor)
        Gate::before(function ($user, $ability) {
            return $user->hasRole('super-admin') ? true : null;
        });

        // 1. Dynamic Config for Admin Branding
        if (!$this->app->runningInConsole()) {
            $siteName = setting_string('site_name', config('app.name'));
            $faviconPath = setting('site_favicon');
            $logoPath = setting('site_logo');

            // Keep the sidebar brand mark faithful to the uploaded logo file.
            $brandMarkUrl = $logoPath ? Storage::url($logoPath) : ($faviconPath ? Storage::url($faviconPath) : config('adminlte.logo_img'));

            config([
                'adminlte.logo' => $siteName,
                'adminlte.logo_img' => $brandMarkUrl,
                'adminlte.logo_img_class' => 'brand-image elevation-2',
                'adminlte.logo_img_alt' => $siteName,
                'adminlte.preloader.img.path' => $brandMarkUrl,
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

        Event::listen([
            PartnerLeadCreated::class,
            ReviewReceived::class,
            JobApplicationReceived::class,
            NewMessageSent::class,
        ], SendPartnerDatabaseNotification::class);

        // 2.1 Register CartItem Observer
        \App\Models\CartItem::observe(\App\Observers\CartItemObserver::class);

        // 2.2 Wire Core Platform Event-to-Email Listener Mappings
        Event::listen(\App\Events\UserRegistered::class, \App\Listeners\SendWelcomeEmail::class);
        Event::listen(\App\Events\PropertyBookingConfirmed::class, \App\Listeners\SendBookingConfirmedEmail::class);
        Event::listen(\App\Events\BookingCancelled::class, \App\Listeners\SendBookingCancelledEmail::class);
        Event::listen(\App\Events\EventTicketPurchased::class, \App\Listeners\SendEventTicketEmail::class);
        Event::listen(\App\Events\JobApplicationReceived::class, \App\Listeners\SendJobApplicationReceivedEmail::class);
        Event::listen(\App\Events\ReviewReceived::class, \App\Listeners\SendReviewReceivedEmail::class);
        Event::listen(\App\Events\ReviewRequested::class, \App\Listeners\SendReviewRequestEmail::class);
        Event::listen(\App\Events\ListingApproved::class, \App\Listeners\SendListingApprovedEmail::class);
        Event::listen(\App\Events\ListingRejected::class, \App\Listeners\SendListingRejectedEmail::class);
        Event::listen(\App\Events\NewListingLead::class, \App\Listeners\SendNewListingLeadEmail::class);
        Event::listen(\App\Events\PaymentFailed::class, \App\Listeners\SendPaymentFailedEmail::class);
        Event::listen(\App\Events\PlanAboutToExpire::class, \App\Listeners\SendRenewalReminderEmail::class);
        Event::listen(\App\Events\PlanDowngraded::class, \App\Listeners\SendPlanDowngradedEmail::class);
        Event::listen(\App\Events\PlanExpired::class, \App\Listeners\SendPlanExpiredEmail::class);
        Event::listen(\App\Events\PlanSubscribed::class, \App\Listeners\SendPlanSubscribedEmail::class);
        Event::listen(\App\Events\PlanUpgraded::class, \App\Listeners\SendPlanUpgradedEmail::class);
        Event::listen(\App\Events\NewsletterOptinAttempted::class, \App\Listeners\SendOptinConfirmationEmail::class);
        Event::listen(\App\Events\NewsletterSubscriptionConfirmed::class, \App\Listeners\SendNewsletterWelcomeEmail::class);

        // 3. Global View Composer (Common Branding)
        View::composer(['frontend._layouts._app', 'frontend._layouts._guest'], function ($view) use ($cartService) {
            $faviconPath = setting('site_favicon');
            $logoPath = setting('site_logo');
            $view->with([
                'cartCount'         => $cartService->getCount(),
                'notificationCount' => $this->getNotificationCount(),
                'siteName'          => Cache::rememberForever('site_name', fn() => setting_string('site_name', config('app.name'))),
                'siteFavicon'       => $faviconPath ? Storage::url($faviconPath) : ($logoPath ? Storage::url($logoPath) : asset('images/app-logo.webp')),
                'bladeContentScope' => config('content.blade_scope', 'laravel_blade'),
                'bladePages'        => Schema::hasTable('page_contents')
                    ? \App\Models\PageContent::where('theme_key', config('content.blade_scope', 'laravel_blade'))
                    ->select('page', 'theme_key')
                    ->groupBy('page', 'theme_key')
                    ->get()
                    : collect(),
            ]);
        });

        // 3. Aligned Blade Directive (Matching your CSS)
        Blade::directive('editable', function ($expression) {
            return "<?php 
                \$data = page_content($expression);
                
                if (\$data instanceof \App\DTOs\ContentResult) {
                    \$editUrl = route('admin.content.edit.item', ['id' => \$data->id]);
                    echo '<span class=\"editable-group d-inline-flex align-items-center\">';
                        echo '<span class=\"editable-text\">' . e(content_display(\$data->value, '')) . '</span>';
                        echo '<a href=\"' . \$editUrl . '\" class=\"edit-link\" target=\"_blank\">';
                            echo '<i class=\"fa-solid fa-pencil edit-icon\"></i>';
                        echo '</a>';
                    echo '</span>';
                } else {
                    echo e(content_display(\$data, ''));
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
