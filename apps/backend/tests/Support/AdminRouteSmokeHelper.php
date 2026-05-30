<?php

namespace Tests\Support;

use App\Models\Auto;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Event;
use App\Models\EventBooking;
use App\Models\JobListing;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Page;
use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\Subscription;
use App\Models\Theme;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as RouteFacade;
use Illuminate\Support\Str;

class AdminRouteSmokeHelper
{
    /** @var array<string, mixed> */
    private array $fixtures = [];

    public function __construct()
    {
        $this->fixtures = [
            'user' => User::first(),
            'auto' => Auto::first(),
            'event' => Event::first(),
            'job' => JobListing::first(),
            'service' => Service::first(),
            'classified' => Classified::first(),
            'property' => Property::first(),
            'product' => Product::first(),
            'category' => Category::first(),
            'blog' => Blog::first(),
            'page' => Page::first(),
            'plan' => Plan::first(),
            'subscription' => Subscription::first(),
            'ticket' => Ticket::first(),
            'theme' => Theme::first(),
            'menu' => Menu::first(),
            'item' => MenuItem::first(),
            'gateway' => PaymentGateway::first(),
            'event_booking' => EventBooking::first(),
            'listing_type' => 'product',
            'listing_id' => Product::first()?->id,
            'type' => 'property',
            'id' => Property::first()?->id,
            'status' => 'pending',
            'section' => 'general',
            'theme_key' => Theme::first()?->theme_key ?? 'unifieds_default',
        ];
    }

    /**
     * @return array<int, array{name: string, uri: string, url: string|null, skip_reason: string|null}>
     */
    public function smokeTargets(): array
    {
        $targets = [];

        foreach (RouteFacade::getRoutes() as $route) {
            $name = $route->getName();
            if (!$name || !str_starts_with($name, 'admin.')) {
                continue;
            }

            if (!in_array('GET', $route->methods(), true)) {
                continue;
            }

            if (in_array($name, ['admin.', 'admin.users.stop-impersonating'], true)) {
                continue;
            }

            $resolved = $this->resolveUrl($route, $name);
            $targets[] = [
                'name' => $name,
                'uri' => '/' . $route->uri(),
                'url' => $resolved['url'],
                'skip_reason' => $resolved['skip_reason'],
            ];
        }

        usort($targets, fn ($a, $b) => $a['name'] <=> $b['name']);

        return $targets;
    }

    /**
     * @return array{url: string|null, skip_reason: string|null}
     */
    private function resolveUrl(Route $route, string $name): array
    {
        try {
            $params = $this->buildParameters($route);
            if ($params === null) {
                return ['url' => null, 'skip_reason' => 'missing fixture for route parameters'];
            }

            return ['url' => route($name, $params), 'skip_reason' => null];
        } catch (\Throwable $e) {
            return ['url' => null, 'skip_reason' => $e->getMessage()];
        }
    }

    /**
     * @return array<string, mixed>|null
     */
    private function buildParameters(Route $route): ?array
    {
        $params = [];

        foreach ($route->parameterNames() as $param) {
            if ($route->parameter($param)?->isOptional()) {
                continue;
            }

            if (array_key_exists($param, $this->fixtures) && $this->fixtures[$param] !== null) {
                $value = $this->fixtures[$param];
                $params[$param] = is_object($value) ? $value->getRouteKey() : $value;
                continue;
            }

            $guessed = $this->guessFixture($param);
            if ($guessed === null) {
                return null;
            }

            $params[$param] = is_object($guessed) ? $guessed->getRouteKey() : $guessed;
        }

        return $params;
    }

    private function guessFixture(string $param): mixed
    {
        $singular = Str::singular(str_replace('_', '-', $param));
        $candidates = [$param, $singular, Str::snake($param)];

        foreach ($candidates as $key) {
            if (isset($this->fixtures[$key]) && $this->fixtures[$key] !== null) {
                return $this->fixtures[$key];
            }
        }

        $modelClass = 'App\\Models\\' . Str::studly($singular);
        if (class_exists($modelClass)) {
            return $modelClass::query()->first();
        }

        return null;
    }

    /**
     * @return array<int, string>
     */
    public static function forbiddenResponseFragments(): array
    {
        return [
            'Undefined variable',
            'Trying to access',
            'SQLSTATE',
            'MethodNotAllowed',
            'Whoops, looks like something went wrong',
            'Server Error',
            'Symfony\\Component\\Routing\\Exception',
        ];
    }
}
