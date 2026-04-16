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
            // ID 1: Header Template
            [
                'title' => 'Main Header',
                'slug' => 'main-header',
                'type' => 'header', // Identifies this as a reusable header component.
                'header_id' => null,
                'footer_id' => null,
                'meta_description' => null,
                'meta_keywords' => null,
                // Simple, functional HTML structure for the header.
                'html' => '<nav><h1>Site Logo</h1><ul><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav>',
                // Minimal CSS for basic styling.
                'css' => 'nav{display:flex;justify-content:space-between;align-items:center;padding:15px 30px;background:#333;color:white;}ul{list-style:none;display:flex;}li{margin-left:20px;}a{color:white;text-decoration:none;}',
                'is_published' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // ID 2: Footer Template
            [
                'title' => 'Main Footer',
                'slug' => 'main-footer',
                'type' => 'footer', // Identifies this as a reusable footer component.
                'header_id' => null,
                'footer_id' => null,
                'meta_description' => null,
                'meta_keywords' => null,
                // Use a dynamic setting lookup for the site title in the copyright.
                'html' => '<footer><p>&copy; ' . date('Y') . ' ' . setting('site_name', env('APP_NAME')) . ' . All rights reserved.</p></footer>',
                // Minimal CSS for basic styling.
                'css' => 'footer{padding:20px 30px;background:#222;color:#ccc;text-align:center;}',
                'is_published' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        $structuralCount = count($structuralPages);
        $this->command->line("--- 🏗️ Seeding {$structuralCount} Structural Components (Header/Footer) ---");
        
        // Disable foreign key checks temporarily because we are inserting records with explicit internal IDs.
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        // Use insert() for efficiency and get the inserted IDs (1 and 2)
        DB::table('pages')->insert($structuralPages);
        // Re-enable foreign key checks.
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->command->info("  ✅ Structural components (Header, Footer) seeded successfully.");

        // Assuming IDs are 1 and 2 for Header and Footer, respectively (adjust if necessary)
        // These hardcoded IDs rely on the table being empty before seeding, which is guaranteed by truncate().
        $headerId = 1;
        $footerId = 2;

        // 3. Define the content pages and link them to the structural IDs
        $contentPages = [
            // Home Page (The most important page)
            [
                'title' => 'Welcome Home',
                'slug' => 'home',
                'type' => 'page', // Standard content page type.
                'header_id' => $headerId, // Links to ID 1 (Header)
                'footer_id' => $footerId, // Links to ID 2 (Footer)
                'meta_description' => 'The premier starting point for finding modern web solutions and development services.',
                'meta_keywords' => 'home, landing page, web solutions, development, services',
                // Includes a placeholder tag (`[[section-testimonials-dynamic]]`) for dynamic content injection later by the CMS.
                'html' => '<main><section><h2>Welcome!</h2><p>This is the main landing page content. It features key service highlights.</p><div class="dynamic-content">[[section-testimonials-dynamic]]</div></section></main>',
                'css' => 'main{padding: 50px;} h2{color:#4a90e2;} p{line-height:1.6;} .dynamic-content{margin-top:40px;border-top:1px solid #eee;padding-top:20px;}',
                'is_published' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // About Page
            [
                'title' => 'About Us',
                'slug' => 'about',
                'type' => 'page',
                'header_id' => $headerId, // Links to ID 1 (Header)
                'footer_id' => $footerId, // Links to ID 2 (Footer)
                'meta_description' => 'Learn about our company mission, team, and history of delivering quality software.',
                'meta_keywords' => 'about us, company history, mission, team',
                'html' => '<main><h2>Our Mission</h2><p>We are dedicated to building innovative tools that empower businesses to grow.</p><ul><li>Founded in 2024</li><li>10+ Team Members</li><li>Globally Distributed</li></ul></main>',
                // Use addHours(1) to ensure the created_at/updated_at timestamps are distinct from the Home page.
                'css' => 'main{padding: 50px;} h2{color:#d0021b;} ul{margin-top:20px;}',
                'is_published' => 1,
                'created_at' => Carbon::now()->addHours(1),
                'updated_at' => Carbon::now()->addHours(1),
            ],
            // Contact Page
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'type' => 'page',
                'header_id' => $headerId, // Links to ID 1 (Header)
                'footer_id' => $footerId, // Links to ID 2 (Footer)
                'meta_description' => 'Get in touch with our support team or sales department via form, email, or phone.',
                'meta_keywords' => 'contact, support, sales, email, phone number',
                // Uses a placeholder `[Form Embed]` to indicate where a dynamic contact form will be rendered.
                'html' => '<main><h2>Send a Message</h2><p>Use the form below or email us at info@appname.com.</p><div class="contact-form">[Form Embed]</div></main>',
                // Use addHours(2) to ensure the created_at/updated_at timestamps are distinct from other pages.
                'css' => 'main{padding: 50px;} h2{color:#007bff;} .contact-form{border:1px dashed #ccc;padding:20px;}',
                'is_published' => 1,
                'created_at' => Carbon::now()->addHours(2),
                'updated_at' => Carbon::now()->addHours(2),
            ],
        ];

        $contentCount = count($contentPages);
        $this->command->line("\n--- 📝 Seeding {$contentCount} Content Pages ---");
        
        // 4. Insert content pages
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('pages')->insert($contentPages);
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $totalCount = $structuralCount + $contentCount;
        $this->command->info("  ✅ Content pages (Home, About, Contact) seeded successfully.");

        // Final Summary Footer
        $this->command->info("\n--- 🏁 CMS Page Seeding Complete ---");
        $this->command->info("🎉 Total Pages Created: {$totalCount}");
    }
}