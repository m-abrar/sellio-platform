<?php

namespace Tests\Unit;

use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageBuilderSanitizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        require_once __DIR__ . '/../../app/helpers.php';
    }

    public function test_page_html_mutator_strips_scripts_and_event_handlers(): void
    {
        $page = Page::create([
            'title' => 'Landing',
            'slug' => 'landing',
            'status' => Page::STATUS_ACTIVE,
            'html' => '<section><p>Hello</p><script>alert(1)</script><img src="/x.jpg" onerror="alert(1)"></section>',
        ]);

        $this->assertStringContainsString('<section>', $page->html);
        $this->assertStringNotContainsString('<script', $page->html);
        $this->assertStringNotContainsString('onerror', $page->html);
    }

    public function test_page_css_mutator_strips_imports_and_expressions(): void
    {
        $page = Page::create([
            'title' => 'Styled',
            'slug' => 'styled',
            'status' => Page::STATUS_ACTIVE,
            'css' => '.hero { color: red; } @import url("http://evil.test/x.css"); width: expression(alert(1));',
        ]);

        $this->assertStringContainsString('.hero { color: red; }', $page->css);
        $this->assertStringNotContainsString('@import', $page->css);
        $this->assertStringNotContainsString('expression', $page->css);
    }

    public function test_sanitize_page_builder_css_helper_returns_empty_for_null(): void
    {
        $this->assertSame('', sanitize_page_builder_css(null));
    }
}
