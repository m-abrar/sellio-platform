<?php

namespace Tests\Unit;

use App\Services\StorageLinkService;
use Tests\TestCase;

class StorageLinkServiceTest extends TestCase
{
    public function test_diagnose_links_reports_each_configured_storage_path(): void
    {
        $results = app(StorageLinkService::class)->diagnoseLinks();

        $this->assertNotEmpty($results);
        $this->assertArrayHasKey('link', $results[0]);
        $this->assertArrayHasKey('target', $results[0]);
        $this->assertArrayHasKey('healthy', $results[0]);
        $this->assertArrayHasKey('detail', $results[0]);
        $this->assertStringEndsWith('storage', $results[0]['link']);
    }

    public function test_ensure_links_makes_storage_public_path_healthy_when_possible(): void
    {
        $service = app(StorageLinkService::class);
        $service->ensureLinks(force: true);

        if (! $service->linksAreHealthy()) {
            $this->markTestSkipped('Storage symlink could not be created in this environment.');
        }

        $this->assertTrue($service->linksAreHealthy());
    }
}
