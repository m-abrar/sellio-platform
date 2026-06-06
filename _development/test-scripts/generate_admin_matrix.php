<?php

/**
 * Generates documentation/admin_page_test_matrix.md from registered admin routes.
 * Run: php tests/generate_admin_matrix.php
 */

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/** @var array<string, array{table: string, model: string}> */
$controllerModels = [
    'DashboardController' => ['table' => '— (aggregates)', 'model' => '—'],
    'UserController' => ['table' => 'users', 'model' => 'User'],
    'ProfileController' => ['table' => 'users', 'model' => 'User'],
    'RoleController' => ['table' => 'roles', 'model' => 'Role'],
    'PermissionController' => ['table' => 'permissions', 'model' => 'Permission'],
    'ActivityLogController' => ['table' => 'activity_log', 'model' => 'Activity'],
    'ListingController' => ['table' => 'listings (polymorphic)', 'model' => 'Listing'],
    'AutoController' => ['table' => 'autos', 'model' => 'Auto'],
    'EventController' => ['table' => 'events', 'model' => 'Event'],
    'JobController' => ['table' => 'joblistings', 'model' => 'JobListing'],
    'ServiceController' => ['table' => 'services', 'model' => 'Service'],
    'ClassifiedController' => ['table' => 'classified_ads', 'model' => 'Classified'],
    'PropertyController' => ['table' => 'properties', 'model' => 'Property'],
    'ProductController' => ['table' => 'products', 'model' => 'Product'],
    'OrderController' => ['table' => 'orders', 'model' => 'Order'],
    'BookingController' => ['table' => 'bookings (polymorphic)', 'model' => 'Booking'],
    'PropertyBookingController' => ['table' => 'property_bookings', 'model' => 'PropertyBooking'],
    'AutoInquiryController' => ['table' => 'auto_inquiries', 'model' => 'AutoInquiry'],
    'EventBookingController' => ['table' => 'event_bookings', 'model' => 'EventBooking'],
    'JobApplicationController' => ['table' => 'job_applications', 'model' => 'JobApplication'],
    'ServiceQuoteController' => ['table' => 'service_quotes', 'model' => 'ServiceQuote'],
    'ServiceAppointmentController' => ['table' => 'service_appointments', 'model' => 'ServiceAppointment'],
    'ClassifiedInquiryController' => ['table' => 'classified_inquiries', 'model' => 'ClassifiedInquiry'],
    'TransactionController' => ['table' => 'transactions', 'model' => 'Transaction'],
    'WithdrawalController' => ['table' => 'withdrawals', 'model' => 'Withdrawal'],
    'PlanController' => ['table' => 'plans', 'model' => 'Plan'],
    'SubscriptionController' => ['table' => 'subscriptions', 'model' => 'Subscription'],
    'SubscriptionQuotaController' => ['table' => 'subscription_quotas', 'model' => 'SubscriptionQuota'],
    'PaymentController' => ['table' => 'payments', 'model' => 'Payment'],
    'PaymentGatewayController' => ['table' => 'payment_gateways', 'model' => 'PaymentGateway'],
    'BlogController' => ['table' => 'blogs', 'model' => 'Blog'],
    'PageController' => ['table' => 'pages', 'model' => 'Page'],
    'PageBuilderController' => ['table' => 'pages, page_contents', 'model' => 'Page'],
    'ContentController' => ['table' => 'page_contents', 'model' => 'PageContent'],
    'MenuController' => ['table' => 'menus, menu_items', 'model' => 'Menu'],
    'ThemeController' => ['table' => 'themes', 'model' => 'Theme'],
    'EmailTemplateController' => ['table' => 'email_templates', 'model' => 'EmailTemplate'],
    'AdvertisementController' => ['table' => 'advertisements', 'model' => 'Advertisement'],
    'TestimonialController' => ['table' => 'testimonials', 'model' => 'Testimonial'],
    'NewsletterSubscriberController' => ['table' => 'newsletter_subscribers', 'model' => 'NewsletterSubscriber'],
    'NotificationController' => ['table' => 'notifications', 'model' => 'DatabaseNotification'],
    'ReportController' => ['table' => '— (reports)', 'model' => '—'],
    'TicketController' => ['table' => 'tickets', 'model' => 'Ticket'],
    'SettingController' => ['table' => 'settings', 'model' => 'Setting'],
    'SystemController' => ['table' => '— (system)', 'model' => '—'],
    'GalleryController' => ['table' => 'media', 'model' => 'Media'],
    'LanguageController' => ['table' => 'languages', 'model' => 'Language'],
    'TypeController' => ['table' => 'types', 'model' => 'Type'],
    'CategoryController' => ['table' => 'categories', 'model' => 'Category'],
    'BrandController' => ['table' => 'brands', 'model' => 'Brand'],
    'LocationController' => ['table' => 'locations', 'model' => 'Location'],
    'AmenityController' => ['table' => 'amenities', 'model' => 'Amenity'],
    'FeatureController' => ['table' => 'features', 'model' => 'Feature'],
    'TagController' => ['table' => 'tags', 'model' => 'Tag'],
    'BookingLineItemController' => ['table' => 'booking_line_items', 'model' => 'BookingLineItem'],
    'LineItemController' => ['table' => 'line_items', 'model' => 'LineItem'],
    'AddonController' => ['table' => 'addons', 'model' => 'Addon'],
];

/** @var array<string, string> */
$areaMap = [
    'welcome' => 'Dashboard',
    'dashboard' => 'Dashboard',
    'notifications' => 'Dashboard',
    'activity-log' => 'System',
    'listings' => 'Listings',
    'autos' => 'Autos',
    'events' => 'Events',
    'jobs' => 'Jobs',
    'services' => 'Services',
    'classifieds' => 'Classifieds',
    'properties' => 'Properties',
    'products' => 'Products',
    'product-orders' => 'Products',
    'bookings' => 'Bookings',
    'property-bookings' => 'Bookings',
    'auto-inquiries' => 'Bookings',
    'event-bookings' => 'Bookings',
    'job-applications' => 'Bookings',
    'service-quotes' => 'Bookings',
    'service-appointments' => 'Bookings',
    'classified-inquiries' => 'Bookings',
    'transactions' => 'Transactions',
    'withdrawals' => 'Finance',
    'users' => 'Users',
    'profile' => 'Users',
    'roles' => 'System',
    'permissions' => 'System',
    'settings' => 'System',
    'system' => 'System',
    'gallery' => 'CMS',
    'blogs' => 'CMS',
    'pages' => 'CMS',
    'page-builder' => 'CMS',
    'content' => 'CMS',
    'menu' => 'CMS',
    'email-templates' => 'CMS',
    'advertisements' => 'CMS',
    'testimonials' => 'CMS',
    'newsletter-subscribers' => 'Support',
    'plans' => 'Subscriptions',
    'subscriptions' => 'Subscriptions',
    'payments' => 'Payments',
    'subscription-quotas' => 'Subscriptions',
    'payment-gateways' => 'Payments',
    'reports' => 'Reports',
    'payments-report' => 'Reports',
    'themes' => 'CMS',
    'tickets' => 'Support',
    'languages' => 'System',
    'types' => 'Taxonomy',
    'categories' => 'Taxonomy',
    'brands' => 'Taxonomy',
    'locations' => 'Taxonomy',
    'amenities' => 'Taxonomy',
    'features' => 'Taxonomy',
    'tags' => 'Taxonomy',
    'booking-line-items' => 'Taxonomy',
    'line-items' => 'Taxonomy',
    'addons' => 'Taxonomy',
];

function inferArea(string $uri, string $name): string
{
    global $areaMap;
    $path = trim(Str::after($uri, 'admin/'), '/');
    $segment = explode('/', $path)[0] ?? '';
    if ($segment === '' && str_contains($name, 'welcome')) {
        return 'Dashboard';
    }
    return $areaMap[$segment] ?? 'Other';
}

function inferView(string $controllerShort, string $method, string $uri): string
{
    $resource = Str::before(Str::after($uri, 'admin/'), '/');
    $resource = $resource ?: 'dashboard';

    $viewMap = [
        'index' => "admin/{$resource}/index.blade.php",
        'create' => "admin/{$resource}/form.blade.php",
        'edit' => "admin/{$resource}/form.blade.php",
        'show' => "admin/{$resource}/show.blade.php",
    ];

    if (isset($viewMap[$method])) {
        return $viewMap[$method];
    }

    if ($controllerShort === 'DashboardController') {
        return str_contains($uri, 'ecommerce')
            ? 'admin/dashboard/ecommerce.blade.php'
            : 'admin/dashboard/index.blade.php';
    }

    return "admin/{$resource}/{$method}.blade.php";
}

function inferTests(string $method, string $uri): string
{
    $tests = ['smoke'];
    if ($method === 'index') {
        $tests[] = 'list';
        $tests[] = 'filter';
        $tests[] = 'pagination';
    }
    if ($method === 'create') {
        $tests[] = 'create-form';
    }
    if ($method === 'edit' || str_contains($uri, '/edit')) {
        $tests[] = 'edit-form';
    }
    if ($method === 'show') {
        $tests[] = 'read';
    }

    return implode(', ', $tests);
}

function parseController(?string $action): array
{
    if (!$action || !str_contains($action, '@')) {
        if ($action && str_contains($action, 'Closure')) {
            return ['Closure', 'closure', '—', '—'];
        }
        return ['—', '—', '—', '—'];
    }

    [$class, $method] = explode('@', $action);
    $short = class_basename($class);
    global $controllerModels;
    $meta = $controllerModels[$short] ?? ['table' => '—', 'model' => '—'];

    return [$short, $method, $meta['table'], $meta['model']];
}

$rows = [];
foreach (Route::getRoutes() as $route) {
    $name = $route->getName();
    if (!$name || !str_starts_with($name, 'admin.')) {
        continue;
    }

    $methods = array_filter($route->methods(), fn ($m) => $m !== 'HEAD');
    if (!in_array('GET', $methods, true)) {
        continue;
    }

    $uri = $route->uri();
    $action = $route->getActionName();
    [$controller, $method, $table, $model] = parseController($action);
    $area = inferArea($uri, $name);
    $view = $controller !== '—' && $controller !== 'Closure'
        ? inferView($controller, $method, $uri)
        : '—';

    $rows[] = [
        'area' => $area,
        'uri' => '/' . $uri,
        'name' => $name,
        'controller' => $controller,
        'method' => $method,
        'view' => $view,
        'table' => $table,
        'model' => $model,
        'tests' => inferTests($method, $uri),
        'middleware' => implode(', ', $route->gatherMiddleware()),
    ];
}

usort($rows, fn ($a, $b) => [$a['area'], $a['uri']] <=> [$b['area'], $b['uri']]);

$byArea = [];
foreach ($rows as $row) {
    $byArea[$row['area']][] = $row;
}

$out = [];
$out[] = '# Admin Page Test Matrix';
$out[] = '';
$out[] = 'Auto-generated inventory for admin dashboard E2E testing.';
$out[] = '';
$out[] = 'Regenerate: `php tests/generate_admin_matrix.php`';
$out[] = '';
$out[] = 'Source files:';
$out[] = '- `apps/backend/routes/admin.php`';
$out[] = '- `apps/backend/app/Http/Controllers/Admin/`';
$out[] = '- `apps/backend/resources/views/admin/`';
$out[] = '';
$out[] = '## Summary';
$out[] = '';
$out[] = '| Metric | Count |';
$out[] = '|---|---:|';
$out[] = '| GET admin routes | ' . count($rows) . ' |';
$out[] = '| Areas | ' . count($byArea) . ' |';
$out[] = '';
$out[] = '## Test Levels (per route)';
$out[] = '';
$out[] = '1. **smoke** — page loads (200, no exception text, layout renders)';
$out[] = '2. **list/filter/pagination** — index pages show seeded rows';
$out[] = '3. **create/edit CRUD** — form submit + database assertion';
$out[] = '4. **relationship** — parent/child/pivot tables (Phase 5)';
$out[] = '5. **permissions** — role-gated access (Phase 8)';
$out[] = '';
$out[] = '## Route Matrix By Area';
$out[] = '';

foreach ($byArea as $area => $areaRows) {
    $out[] = "### {$area}";
    $out[] = '';
    $out[] = '| URI | Route Name | Controller@Method | Blade View | Table(s) | Model | Required Tests | Middleware |';
    $out[] = '|---|---|---|---|---|---|---|---|';
    foreach ($areaRows as $row) {
        $controllerAction = $row['controller'] !== '—'
            ? "{$row['controller']}@{$row['method']}"
            : '—';
        $out[] = sprintf(
            '| `%s` | `%s` | %s | `%s` | %s | %s | %s | %s |',
            $row['uri'],
            $row['name'],
            $controllerAction,
            $row['view'],
            $row['table'],
            $row['model'],
            $row['tests'],
            $row['middleware']
        );
    }
    $out[] = '';
}

$out[] = '## POST/PUT/DELETE Routes (CRUD follow-up)';
$out[] = '';
$out[] = 'These routes are covered in Phase 4 CRUD tests after smoke passes.';
$out[] = '';
$out[] = '| URI | Route Name | Methods | Controller |';
$out[] = '|---|---|---|---|';

$mutating = [];
foreach (Route::getRoutes() as $route) {
    $name = $route->getName();
    if (!$name || !str_starts_with($name, 'admin.')) {
        continue;
    }
    $methods = array_values(array_filter($route->methods(), fn ($m) => !in_array($m, ['GET', 'HEAD'], true)));
    if ($methods === []) {
        continue;
    }
    [$controller] = parseController($route->getActionName());
    $mutating[] = [
        'uri' => '/' . $route->uri(),
        'name' => $name,
        'methods' => implode('|', $methods),
        'controller' => $controller,
    ];
}

usort($mutating, fn ($a, $b) => $a['uri'] <=> $b['uri']);
foreach ($mutating as $row) {
    $out[] = sprintf('| `%s` | `%s` | %s | %s |', $row['uri'], $row['name'], $row['methods'], $row['controller']);
}

$out[] = '';
$out[] = '## Seeded Admin Credentials (dev/test)';
$out[] = '';
$out[] = '| User | Password | Role |';
$out[] = '|---|---|---|';
$out[] = '| admin@sellio-platform.test | admin123 | super-admin (via UserSeeder + RolesAndPermissionsSeeder) |';
$out[] = '';

$target = dirname(__DIR__, 3) . '/documentation/admin_page_test_matrix.md';
file_put_contents($target, implode(PHP_EOL, $out) . PHP_EOL);

echo "Wrote {$target} (" . count($rows) . " GET routes, " . count($mutating) . " mutating routes)\n";
