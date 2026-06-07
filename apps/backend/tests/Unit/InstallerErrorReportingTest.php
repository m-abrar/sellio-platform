<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class InstallerErrorReportingTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        require_once __DIR__ . '/../../public/install/support/error_reporting.php';
    }

    public function test_display_errors_disabled_when_install_lock_exists(): void
    {
        $this->assertFalse(should_installer_display_errors(true, true));
        $this->assertFalse(should_installer_display_errors(true, false));
    }

    public function test_display_errors_follows_debug_flag_during_active_install(): void
    {
        $this->assertTrue(should_installer_display_errors(false, true));
        $this->assertFalse(should_installer_display_errors(false, false));
    }

    public function test_installer_debug_defaults_to_local_context_without_env(): void
    {
        $this->assertTrue(installer_debug_requested([], true));
        $this->assertFalse(installer_debug_requested([], false));
    }

    public function test_installer_debug_reads_env_flag_when_present(): void
    {
        $this->assertTrue(installer_debug_requested(['INSTALLER_DEBUG' => 'true'], false));
        $this->assertFalse(installer_debug_requested(['INSTALLER_DEBUG' => 'false'], true));
    }
}
