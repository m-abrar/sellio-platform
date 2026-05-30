<?php

namespace Tests\Feature\Admin;

use Tests\Concerns\InteractsWithAdmin;
use Tests\Support\AdminRouteSmokeHelper;
use Tests\TestCase;

class AdminRoutesSmokeTest extends TestCase
{
    use InteractsWithAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_all_resolvable_admin_get_routes_return_successful_responses(): void
    {
        $helper = new AdminRouteSmokeHelper();
        $failures = [];

        foreach ($helper->smokeTargets() as $target) {
            if ($target['url'] === null) {
                continue;
            }

            $response = $this->actingAsSuperAdmin()->get($target['url']);

            if (!in_array($response->getStatusCode(), [200, 302], true)) {
                $failures[] = "{$target['name']} ({$target['uri']}) returned HTTP {$response->getStatusCode()}";
                continue;
            }

            if ($response->getStatusCode() === 200) {
                $content = $response->getContent() ?: '';
                foreach (AdminRouteSmokeHelper::forbiddenResponseFragments() as $fragment) {
                    if (str_contains($content, $fragment)) {
                        $failures[] = "{$target['name']} ({$target['uri']}) contains error fragment: {$fragment}";
                        break;
                    }
                }
            }
        }

        $this->assertSame(
            [],
            $failures,
            "Admin smoke failures:\n" . implode("\n", $failures)
        );
    }

    public function test_core_admin_dashboard_pages_load(): void
    {
        $routes = [
            'admin.welcome',
            'admin.dashboard.ecommerce',
            'admin.users.index',
            'admin.categories.index',
            'admin.settings.index',
        ];

        foreach ($routes as $routeName) {
            $response = $this->actingAsSuperAdmin()->get(route($routeName));
            $response->assertOk();
        }
    }
}
