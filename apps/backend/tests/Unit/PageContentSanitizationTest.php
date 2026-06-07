<?php

namespace Tests\Unit;

use App\Models\PageContent;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageContentSanitizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_text_fields_strip_scripts_but_keep_inline_formatting(): void
    {
        $content = PageContent::create([
            'theme_key' => 'laravel_blade',
            'page' => 'home',
            'section' => 'hero',
            'content_key' => 'title',
            'input_type' => 'text',
            'value' => 'Find <span class="text-primary">More</span><script>alert(1)</script>',
        ]);

        $this->assertStringContainsString('<span class="text-primary">More</span>', $content->value);
        $this->assertStringNotContainsString('<script', $content->value);
    }

    public function test_editor_fields_allow_layout_tags_and_sanitize_handlers(): void
    {
        $content = PageContent::create([
            'theme_key' => 'laravel_blade',
            'page' => 'home',
            'section' => 'body',
            'content_key' => 'block',
            'input_type' => 'editor',
            'value' => '<section><p>Hello</p><img src="/x.jpg" onerror="alert(1)"></section>',
        ]);

        $this->assertStringContainsString('<section>', $content->value);
        $this->assertStringContainsString('<p>Hello</p>', $content->value);
        $this->assertStringNotContainsString('onerror', $content->value);
    }

    public function test_update_re_sanitizes_when_input_type_is_editor(): void
    {
        $content = PageContent::create([
            'theme_key' => 'laravel_blade',
            'page' => 'home',
            'section' => 'body',
            'content_key' => 'block',
            'input_type' => 'text',
            'value' => '<p>Safe</p>',
        ]);

        $content->input_type = 'editor';
        $content->value = '<div><a href="javascript:alert(1)">Click</a></div>';
        $content->save();

        $content->refresh();

        $this->assertStringContainsString('<div>', $content->value);
        $this->assertSame('<div><a href="#">Click</a></div>', $content->value);
    }
}
