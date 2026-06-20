<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

/**
 * Seeds home-page editable content slots for the default Laravel Blade scope.
 * These values fill the @editable() / @editableHtml() directives on the
 * unified home page (frontend.unifieds.index) and the shared global partials.
 *
 * Run-safe: uses updateOrCreate, so re-seeding is idempotent.
 */
class HomePageContentSeeder extends Seeder
{
    private const SCOPE = 'laravel_blade';

    public function run(): void
    {
        $slots = [
            // ── Hero ─────────────────────────────────────────────────────────
            // Badge above the headline (plain text — rendered via @editable)
            ['section' => 'hero', 'content_key' => 'badge',       'input_type' => 'text',     'value' => 'New listings every day'],

            // Main headline (HTML allowed — rendered via @editableHtml)
            ['section' => 'hero', 'content_key' => 'title',       'input_type' => 'html',     'value' => 'Buy, Sell &amp; Discover <span class="text-primary">Locally &amp; Online.</span>'],

            // Subheading (plain text)
            ['section' => 'hero', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Properties, vehicles, products, services, jobs, and events — all from verified sellers in one trusted place.'],

            // ── Discovery grid ───────────────────────────────────────────────
            ['section' => 'discovery', 'content_key' => 'heading',     'input_type' => 'text',     'value' => 'What Are You Looking For?'],
            ['section' => 'discovery', 'content_key' => 'description', 'input_type' => 'textarea', 'value' => 'Browse by category or search for exactly what you need.'],

            // ── Global footer ────────────────────────────────────────────────
            ['section' => 'footer', 'content_key' => 'paragraph',             'input_type' => 'textarea', 'value' => 'Your trusted multi-category marketplace — connecting buyers and sellers across properties, vehicles, services, and more.'],
            ['section' => 'footer', 'content_key' => 'newsletter_title',      'input_type' => 'text',     'value' => 'Stay in the loop'],
            ['section' => 'footer', 'content_key' => 'newsletter_description','input_type' => 'textarea', 'value' => 'Get new listing alerts, seller tips, and marketplace updates straight to your inbox.'],
        ];

        $cacheKeysToForget = [];

        foreach ($slots as $slot) {
            PageContent::updateOrCreate(
                [
                    'theme_key'   => self::SCOPE,
                    'page'        => 'home',
                    'section'     => $slot['section'],
                    'content_key' => $slot['content_key'],
                ],
                [
                    'value'      => $slot['value'],
                    'input_type' => $slot['input_type'],
                ],
            );

            $cacheKeysToForget[] = "page_content." . self::SCOPE . ".home.{$slot['section']}.{$slot['content_key']}";
        }

        // Also seed global.* keys that the shared header/footer partials use
        $globalSlots = [
            ['section' => 'header', 'content_key' => 'brand_text', 'input_type' => 'text', 'value' => ''],
        ];

        foreach ($globalSlots as $slot) {
            // Only create if not already set (don't overwrite admin customisations to site name)
            PageContent::firstOrCreate(
                [
                    'theme_key'   => self::SCOPE,
                    'page'        => 'global',
                    'section'     => $slot['section'],
                    'content_key' => $slot['content_key'],
                ],
                [
                    'value'      => $slot['value'],
                    'input_type' => $slot['input_type'],
                ],
            );

            $cacheKeysToForget[] = "page_content." . self::SCOPE . ".global.{$slot['section']}.{$slot['content_key']}";
        }

        // Clear stale cache so fresh values are served immediately
        foreach ($cacheKeysToForget as $key) {
            Cache::forget($key);
        }

        $this->command->info('   > Home page content slots seeded (' . count($slots) . ' hero/discovery/footer keys).');
    }
}
