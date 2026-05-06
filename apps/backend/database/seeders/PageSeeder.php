<?php

// File: database/seeders/PageSeeder.php
// Purpose: Seeds the application's core pages for the Content Management System (CMS).
// This includes structural elements (Header, Footer) and default content pages
// (Home, About, Contact), setting up their initial HTML, CSS, and metadata.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon; // Use Carbon for clean timestamps

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
                'admin_note' => 'Primary landing page.',
                'meta_description' => 'The premier starting point for finding modern web solutions and development services.',
                'meta_keywords' => 'home, landing page, web solutions, development, services',
                'html' => '<main><section><h2>Welcome!</h2><p>This is the main landing page content. It features key service highlights.</p><div class="dynamic-content">[[section-testimonials-dynamic]]</div></section></main>',
                'css' => 'main{padding: 50px;} h2{color:#4a90e2;} p{line-height:1.6;} .dynamic-content{margin-top:40px;border-top:1px solid #eee;padding-top:20px;}',
                'is_published' => true,
            ],
            [
                'title' => 'About Us',
                'slug' => 'about',
                'type' => 'page',
                'header_id' => $headerId,
                'footer_id' => $footerId,
                'status' => 'active',
                'is_system' => false,
                'is_premium' => false,
                'admin_note' => 'Company about page.',
                'meta_description' => 'Learn about our company mission, team, and history of delivering quality software.',
                'meta_keywords' => 'about us, company history, mission, team',
                'html' => '<main><h2>Our Mission</h2><p>We are dedicated to building innovative tools that empower businesses to grow.</p><ul><li>Founded in 2024</li><li>10+ Team Members</li><li>Globally Distributed</li></ul></main>',
                'css' => 'main{padding: 50px;} h2{color:#d0021b;} ul{margin-top:20px;}',
                'is_published' => true,
            ],
        ];

        foreach ($contentPages as $pageData) {
            DB::table('pages')->updateOrInsert(['slug' => $pageData['slug']], $pageData);
        }

        $this->command->info("  ✅ CMS pages seeded successfully.");
    }
}