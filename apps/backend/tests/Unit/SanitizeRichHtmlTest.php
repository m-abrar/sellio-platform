<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class SanitizeRichHtmlTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        require_once __DIR__ . '/../../app/helpers.php';
    }

    public function test_it_preserves_allowed_formatting_tags(): void
    {
        $html = '<p>Hello <strong>world</strong></p>';

        $this->assertSame($html, sanitize_rich_html($html));
    }

    public function test_it_strips_script_tags(): void
    {
        $html = '<p>Safe</p><script>alert(1)</script>';
        $sanitized = sanitize_rich_html($html);

        $this->assertStringContainsString('<p>Safe</p>', $sanitized);
        $this->assertStringNotContainsString('<script', $sanitized);
    }

    public function test_it_removes_inline_event_handlers(): void
    {
        $html = '<img src="/x.jpg" onerror="alert(1)">';

        $this->assertStringNotContainsString('onerror', sanitize_rich_html($html));
    }

    public function test_it_blocks_javascript_href_values(): void
    {
        $html = '<a href="javascript:alert(1)">Click</a>';

        $this->assertSame('<a href="#">Click</a>', sanitize_rich_html($html));
    }

    public function test_it_returns_empty_string_for_null_or_blank_input(): void
    {
        $this->assertSame('', sanitize_rich_html(null));
        $this->assertSame('', sanitize_rich_html(''));
    }
}
