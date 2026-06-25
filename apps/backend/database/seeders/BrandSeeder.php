<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class BrandSeeder
 *
 * Seeds the 'brands' table with default names across all modules,
 * including media and corporate brands for the Blog module.
 */
class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // Define brands, associating them with the relevant module column name.
        $moduleBrands = [
            'is_auto' => [
                'Toyota', 'Ford', 'BMW', 'Honda', 'Tesla', 'Mercedes'
            ],
            'is_property' => [
                'RE/MAX', 'Coldwell Banker', 'Keller Williams'
            ],
            'is_job' => [
                'Google', 'Amazon', 'Microsoft', 'Apple'
            ],
            'is_classified' => [
                'Samsung', 'Sony', 'Nike', 'Zara'
            ],
            'is_event' => [
                'Lollapalooza', 'TED Conferences', 'Comic-Con International'
            ],
            'is_service' => [
                'MaidPro', 'H&R Block', 'TutorMe'
            ],
            'is_product' => [
                'Logitech', 'Adidas', 'Nestlé', 'LEGO', 'Dell', 'Canon'
            ],
            // --- NEW: Blog Module Brands (Partners, Sponsors, or Publishers) ---
            'is_blog' => [
                'TechCrunch', 'Forbes', 'Wired', 'Medium', 'The Verge'
            ],
        ];

        // Calculate total count and module count for the header
        $totalBrandsToInsert = array_sum(array_map('count', $moduleBrands));
        $moduleCount = count($moduleBrands);
        
        $this->command->line("🏷️ Seeding Brands (**$totalBrandsToInsert** total across $moduleCount modules)...");
        
        $initialCount = DB::table('brands')->count();
        $brandsToInsert = [];

        foreach ($moduleBrands as $moduleFlag => $brandNames) {
            foreach ($brandNames as $brandName) {
                $brandData = [
                    'title' => $brandName,
                    'slug' => Str::slug($brandName) . '-' . Str::random(5),
                    'description' => 'Brand associated with the ' . str_replace('is_', '', $moduleFlag) . ' module.',

                    // Module Flags (set default to false)
                    'is_property'   => false,
                    'is_event'      => false,
                    'is_job'        => false,
                    'is_auto'       => false,
                    'is_service'    => false,
                    'is_classified' => false,
                    'is_product'    => false,
                    'is_blog'       => false,

                    'status'        => 'active',
                    'admin_note'    => 'System default brand.',
                    'is_premium'    => false,
                    'is_published'  => true,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ];

                // Set the current module flag to true
                $brandData[$moduleFlag] = true;

                $brandsToInsert[] = $brandData;
            }
        }

        // Insert all brands in one batch
        DB::table('brands')->insert($brandsToInsert);

        $finalCount = DB::table('brands')->count();
        $recordsCreated = $finalCount - $initialCount;

        $this->command->info("   > **$recordsCreated** new brands created.");
        $this->command->line('✅ Brand Seeding finished.');
    }
}