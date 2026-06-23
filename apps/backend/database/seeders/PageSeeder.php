<?php

// File: database/seeders/PageSeeder.php
// Purpose: Seeds the application's core pages for the Content Management System (CMS).
// This includes structural elements (Header, Footer) and default content pages
// (Home, About, Contact), setting up their initial HTML, CSS, and metadata.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Class PageSeeder
 *
 * Seeds the application's core pages for the Content Management System (CMS).
 * This includes structural elements (Header, Footer) and default content pages
 * (Home, About, Contact).
 */
class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Inserts structural pages first to obtain their IDs (1 and 2), and then inserts
     * content pages, linking them to the structural components via foreign keys.
     *
     * @return void
     */
    public function run(): void
    {
        // Header
        $this->command->info('📄 Starting CMS Page Seeder...');

        // 1. Clear existing data to ensure a clean seed environment
        DB::table('pages')->delete();
        $this->command->line('🗑️ Cleared existing pages table data.');


        // 2. Define the core structural records (Header, Footer) first
        $structuralPages = [
            [
                'title' => 'Main Header',
                'slug' => 'main-header',
                'type' => 'header',
                'status' => 'active',
                'is_system' => true,
                'is_premium' => false,
                'admin_note' => 'System default header template.',
                'html' => '<nav><h1>Site Logo</h1><ul><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav>',
                'css' => 'nav{display:flex;justify-content:space-between;align-items:center;padding:15px 30px;background:#333;color:white;}ul{list-style:none;display:flex;}li{margin-left:20px;}a{color:white;text-decoration:none;}',
                'is_published' => true,
            ],
            [
                'title' => 'Main Footer',
                'slug' => 'main-footer',
                'type' => 'footer',
                'status' => 'active',
                'is_system' => true,
                'is_premium' => false,
                'admin_note' => 'System default footer template.',
                'html' => '<footer><p>&copy; ' . date('Y') . ' ' . setting('site_name', env('APP_NAME')) . ' . All rights reserved.</p></footer>',
                'css' => 'footer{padding:20px 30px;background:#222;color:#ccc;text-align:center;}',
                'is_published' => true,
            ],
        ];

        foreach ($structuralPages as $pageData) {
            DB::table('pages')->updateOrInsert(['slug' => $pageData['slug']], $pageData);
        }

        // Retrieve IDs for linking
        $headerId = DB::table('pages')->where('slug', 'main-header')->value('id');
        $footerId = DB::table('pages')->where('slug', 'main-footer')->value('id');

        // 3. Define the content pages and link them to the structural IDs
        $contentPages = [
            [
                'title' => 'Welcome Home',
                'slug' => 'home',
                'type' => 'page',
                'header_id' => $headerId,
                'footer_id' => $footerId,
                'status' => 'active',
                'is_system' => true,
                'is_premium' => false,
                'admin_note' => 'Primary landing page. Content is rendered by the Blade theme.',
                'meta_description' => "Discover properties, vehicles, events, services, jobs, and more — all in one trusted marketplace.",
                'meta_keywords' => 'marketplace, properties, vehicles, events, services, jobs, classifieds',
                'html' => '<p>This page is rendered by the Blade theme. Edit hero content via Admin &rsaquo; Page Content.</p>',
                'css' => '',
                'is_published' => true,
            ],
            // About Us is a static Blade view (resources/views/frontend/pages/about.blade.php).
            // No DB record needed — PageController falls through to the static view automatically.
        ];

        foreach ($contentPages as $pageData) {
            DB::table('pages')->updateOrInsert(['slug' => $pageData['slug']], $pageData);
        }

        $this->command->info("  ✅ CMS pages seeded successfully.");
    }
}