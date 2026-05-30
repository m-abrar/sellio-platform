<?php

namespace Tests\Feature\Admin;

use Tests\Concerns\InteractsWithAdmin;
use Tests\TestCase;

class AdminLogGateTest extends TestCase
{
    use InteractsWithAdmin;

    private static ?int $logSizeAtStart = null;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        $logPath = storage_path('logs/laravel.log');
        self::$logSizeAtStart = file_exists($logPath) ? filesize($logPath) : 0;
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedAdminContext();
    }

    public function test_admin_suite_does_not_write_error_entries_to_laravel_log(): void
    {
        $logPath = storage_path('logs/laravel.log');

        if (! file_exists($logPath)) {
            $this->assertTrue(true);

            return;
        }

        $newContent = $this->readNewLogContent($logPath);

        $this->assertStringNotContainsString('SQLSTATE', $newContent);
        $this->assertStringNotContainsString('Undefined variable', $newContent);
        $this->assertStringNotContainsString('View [', $newContent);
        $this->assertDoesNotMatchRegularExpression('/\.ERROR:/', $newContent);
    }

    private function readNewLogContent(string $logPath): string
    {
        $handle = fopen($logPath, 'rb');
        fseek($handle, self::$logSizeAtStart ?? 0);

        $content = stream_get_contents($handle) ?: '';
        fclose($handle);

        return $content;
    }
}
