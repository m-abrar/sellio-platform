<?php

namespace App\Providers;

use App\DTOs\ContentResult;
use App\Events\BookingCancelled;
use App\Events\EventTicketPurchased;
use App\Events\JobApplicationReceived;
use App\Events\ListingApproved;
use App\Events\ListingRejected;
use App\Events\NewListingLead;
use App\Events\NewMessageSent;
use App\Events\NewsletterOptinAttempted;
use App\Events\NewsletterSubscriptionConfirmed;
use App\Events\Partner\PartnerLeadCreated;
use App\Events\PaymentFailed;
use App\Events\PlanAboutToExpire;
use App\Events\PlanDowngraded;
use App\Events\PlanExpired;
use App\Events\PlanSubscribed;
use App\Events\PlanUpgraded;
use App\Events\PropertyBookingConfirmed;
use App\Events\ReviewReceived;
use App\Events\ReviewRequested;
use App\Events\UserRegistered;
use App\Listeners\Partner\SendPartnerDatabaseNotification;
use App\Listeners\Partner\SendPartnerLeadEmail;
use App\Listeners\RequestPostPurchaseReview;
use App\Listeners\SendBookingCancelledEmail;
use App\Listeners\SendBookingConfirmedEmail;
use App\Listeners\SendEventTicketEmail;
use App\Listeners\SendJobApplicationReceivedEmail;
use App\Listeners\SendListingApprovedEmail;
use App\Listeners\SendListingRejectedEmail;
use App\Listeners\SendNewListingLeadEmail;
use App\Listeners\SendNewsletterWelcomeEmail;
use App\Listeners\SendOptinConfirmationEmail;
use App\Listeners\SendPaymentFailedEmail;
use App\Listeners\SendPlanDowngradedEmail;
use App\Listeners\SendPlanExpiredEmail;
use App\Listeners\SendPlanSubscribedEmail;
use App\Listeners\SendPlanUpgradedEmail;
use App\Listeners\SendRenewalReminderEmail;
use App\Listeners\SendReviewReceivedEmail;
use App\Listeners\SendReviewRequestEmail;
use App\Listeners\SendWelcomeEmail;
use App\Models\CartItem;
use App\Models\PageContent;
use App\Observers\CartItemObserver;
use App\Services\CartService;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(CartService::class, fn() => new CartService());
    }

    public function boot(CartService $cartService): void
    {
        $this->configureRateLimiting();

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

        Event::listen(PartnerLeadCreated::class, SendPartnerDatabaseNotification::class);
        Event::listen(PartnerLeadCreated::class, SendPartnerLeadEmail::class);
        Event::listen([
            ReviewReceived::class,
            JobApplicationReceived::class,
            NewMessageSent::class,
        ], SendPartnerDatabaseNotification::class);

        // 2.1 Register CartItem Observer
        CartItem::observe(CartItemObserver::class);

        // 2.2 Wire Core Platform Event-to-Email Listener Mappings
        Event::listen(UserRegistered::class, SendWelcomeEmail::class);
        Event::listen(PropertyBookingConfirmed::class, SendBookingConfirmedEmail::class);
        Event::listen(PropertyBookingConfirmed::class, RequestPostPurchaseReview::class);
        Event::listen(BookingCancelled::class, SendBookingCancelledEmail::class);
        Event::listen(EventTicketPurchased::class, SendEventTicketEmail::class);
        Event::listen(EventTicketPurchased::class, RequestPostPurchaseReview::class);
        Event::listen(JobApplicationReceived::class, SendJobApplicationReceivedEmail::class);
        Event::listen(ReviewReceived::class, SendReviewReceivedEmail::class);
        Event::listen(ReviewRequested::class, SendReviewRequestEmail::class);
        Event::listen(ListingApproved::class, SendListingApprovedEmail::class);
        Event::listen(ListingRejected::class, SendListingRejectedEmail::class);
        Event::listen(NewListingLead::class, SendNewListingLeadEmail::class);
        Event::listen(PaymentFailed::class, SendPaymentFailedEmail::class);
        Event::listen(PlanAboutToExpire::class, SendRenewalReminderEmail::class);
        Event::listen(PlanDowngraded::class, SendPlanDowngradedEmail::class);
        Event::listen(PlanExpired::class, SendPlanExpiredEmail::class);
        Event::listen(PlanSubscribed::class, SendPlanSubscribedEmail::class);
        Event::listen(PlanUpgraded::class, SendPlanUpgradedEmail::class);
        Event::listen(NewsletterOptinAttempted::class, SendOptinConfirmationEmail::class);
        Event::listen(NewsletterSubscriptionConfirmed::class, SendNewsletterWelcomeEmail::class);

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
                    ? PageContent::where('theme_key', config('content.blade_scope', 'laravel_blade'))
                    ->select('page', 'theme_key')
                    ->groupBy('page', 'theme_key')
                    ->get()
                    : collect(),
            ]);
        });

        // 3. Aligned Blade Directive (Matching editable-ui.css)
        Blade::directive('editable', function ($expression) {
            $contentResultClass = ContentResult::class;

            return "<?php 
                \$data = page_content($expression);
                
                if (\$data instanceof {$contentResultClass}) {
                    \$editUrl = route('admin.content.edit.item', ['id' => \$data->id]);
                    echo '<span class=\"editable-group d-inline-flex align-items-center\">';
                        echo '<span class=\"editable-text\">' . e(content_display(\$data->value, '')) . '</span>';
                        echo '<a href=\"' . \$editUrl . '\" class=\"edit-link\" target=\"_blank\" title=\"' . e(__('Edit content')) . '\">';
                            echo '<i class=\"fa-solid fa-pencil edit-icon\"></i>';
                        echo '</a>';
                    echo '</span>';
                } else {
                    echo e(content_display(\$data, ''));
                }
            ?>";
        });

        Blade::directive('editableHtml', function ($expression) {
            $contentResultClass = ContentResult::class;

            return "<?php 
                \$data = page_content($expression);
                \$allowedTags = page_content_editor_allowed_tags();
                
                if (\$data instanceof {$contentResultClass}) {
                    \$editUrl = route('admin.content.edit.item', ['id' => \$data->id]);
                    \$display = sanitize_rich_html(content_display(\$data->value, ''), \$allowedTags);
                    echo '<span class=\"editable-group d-inline-flex align-items-center\">';
                        echo '<span class=\"editable-text\">' . \$display . '</span>';
                        echo '<a href=\"' . \$editUrl . '\" class=\"edit-link\" target=\"_blank\" title=\"' . e(__('Edit content')) . '\">';
                            echo '<i class=\"fa-solid fa-pencil edit-icon\"></i>';
                        echo '</a>';
                    echo '</span>';
                } else {
                    echo sanitize_rich_html(content_display(\$data, ''), \$allowedTags);
                }
            ?>";
        });
    }

    protected function getNotificationCount(): int
    {
        if (!Auth::check()) return 0;
        return Cache::remember('user_notif_count_' . Auth::id(), 60, fn() => Auth::user()->unreadNotifications()->count());
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(60)->by($request->ip());
        });

        RateLimiter::for('api-auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('api-write', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(30)->by($request->user()->id)
                : Limit::perMinute(20)->by($request->ip());
        });
    }
}
