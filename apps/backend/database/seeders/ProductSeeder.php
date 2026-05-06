<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\Product;

/**
 * Class ProductSeeder
 *
 * Seeds the database with sample Product listings aligned with the 
 * latest products table migration.
 */
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds to create Product records and their pivots.
     *
     * @return void
     */
    public function run(): void
    {
        $faker = Faker::create();
        $totalProductsToCreate = 50;

        // Counters for tracking seeding results
        $totalProductsCreated = 0;
        $totalAttributesAttached = 0;
        $totalSpecsAttached = 0;

        // 🎯 Header Line
        $this->command->line("📦 Seeding Product listings and pivot data (**$totalProductsToCreate** total)...");

        // 1. Fetch Necessary IDs from Related Tables
        $userIds     = DB::table('users')->where('is_partner', true)->pluck('id')->toArray();
        $categoryIds = DB::table('categories')->where('is_product', true)->pluck('id')->toArray();
        $brandIds    = DB::table('brands')->pluck('id')->toArray();
        $typeIds     = DB::table('types')->pluck('id')->toArray(); // Added for the new migration column
        
        // Pivot dependencies
        $attributeIds = DB::table('product_attributes')->pluck('id')->toArray();
        $specIds      = DB::table('features')->where('is_product', true)->pluck('id')->toArray();

        $maxUsers      = count($userIds);
        $maxTypes      = count($typeIds);

        // Fail-safe check
        if ($maxUsers === 0 || empty($categoryIds) || empty($brandIds)) {
            $this->command->error('❌ Skipping ProductSeeder: Missing dependencies (Users, Categories, or Brands).');
            return;
        }

        // 2. Create sample products
        foreach (range(1, $totalProductsToCreate) as $index) {
            
            $name = $faker->words(3, true) . ' ' . $faker->colorName;

            // --- Pricing Logic ---
            $basePrice = $faker->randomFloat(2, 10, 2000);
            $onSale    = $faker->boolean(30); 
            $salePrice = $onSale ? $faker->randomFloat(2, 5, $basePrice - 1) : null;
            $costPrice = $basePrice * 0.6; // Simulating 40% margin
            
            // --- Random dates ---
            $createdAt = $faker->dateTimeThisYear();

            // Video Data (Matches 'video' column in migration)
            $videoUrl = $faker->boolean(40) ? 'https://www.youtube.com/watch?v=' . $faker->bothify('???????????') : null;

            // --- Create Product record mapped to Migration columns ---
            $product = Product::create([
                // Relationships
                'user_id'     => $faker->randomElement($userIds),
                'category_id' => $faker->randomElement($categoryIds),
                'type_id'     => $maxTypes > 0 ? $faker->randomElement($typeIds) : null,
                'brand_id'    => $faker->randomElement($brandIds),

                // Basic Info
                'title'       => ucfirst($name),
                'slug'        => Str::slug($name) . '-' . $faker->unique()->numberBetween(100, 999) . '-' . Str::random(5),
                'sku'         => strtoupper($faker->bothify('??-####-???')),
                'description' => $faker->paragraphs(2, true),
                'short_description' => $faker->sentence(12),

                // Pricing
                'base_price'  => $basePrice,
                'sale_price'  => $salePrice,
                'cost_price'  => $costPrice,
                
                // Inventory Specifics (Renamed to match migration)
                'stock_quantity'      => $faker->numberBetween(0, 500),
                'low_stock_threshold' => 10,
                'manage_stock'        => true,
                'in_stock'            => $faker->boolean(90),

                // Physical Attributes
                'weight'      => $faker->randomFloat(2, 0.1, 20),
                'length'      => $faker->randomFloat(2, 1, 50),
                'width'       => $faker->randomFloat(2, 1, 50),
                'height'      => $faker->randomFloat(2, 1, 50),

                // Media (Column is 'video', not 'video_url')
                'video'       => $videoUrl,
                'main_image'  => null, // Handled later by MediaSeeder or manual upload

                // Hardened Moderation & Status
                'status'                => 'approved',
                'admin_note'            => 'Automatically approved shop product.',
                'is_verified_seller'    => $faker->boolean(60),

                // Status/Flags (Renamed to match migration)
                'is_published' => true,
                'is_featured'  => $faker->boolean(15),
                'on_sale'      => $onSale,
                'is_digital'   => $faker->boolean(10),

                // SEO
                'meta_title'       => $name,
                'meta_description' => $faker->sentence(),

                // Timestamps
                'approved_at' => now(),
                'created_at'  => $createdAt,
                'updated_at'  => $createdAt, 
            ]);

            $totalProductsCreated++;

            // 3. Attach Attributes (Variations)
            if (!empty($attributeIds)) {
                $attrCount = $faker->numberBetween(1, min(4, count($attributeIds)));
                $randomAttrIds = $faker->randomElements($attributeIds, $attrCount);
                
                $attrPivotData = [];
                foreach($randomAttrIds as $id) {
                    $attrPivotData[$id] = [
                        'additional_price' => $faker->randomElement([0, 5, 10, 15]),
                        'is_visible' => true
                    ];
                }
                $product->attributes()->attach($attrPivotData);
                $totalAttributesAttached += count($randomAttrIds);
            }

            // 4. Attach Specifications (Features)
            if (!empty($specIds)) {
                $specsToAttach = [];
                $numSpecs = $faker->numberBetween(2, min(6, count($specIds)));
                $randomSpecIds = $faker->randomElements($specIds, $numSpecs);

                foreach ($randomSpecIds as $specId) {
                    $specsToAttach[$specId] = [
                        'value' => $faker->randomElement(['Premium Grade', '100% Organic', 'Water Resistant', 'Eco-friendly', 'Imported']),
                    ];
                }

                $product->features()->attach($specsToAttach);
                $totalSpecsAttached += count($specsToAttach);
            }
        }
        
        // 5. Seeding Summary
        $this->command->newLine();
        $this->command->info('--- Product Seeding Summary (Aligned with Migration) ---');
        $this->command->info("   > **$totalProductsCreated** Product records created.");
        $this->command->info("   > **$totalAttributesAttached** Variations attached.");
        $this->command->info("   > **$totalSpecsAttached** Specifications attached.");
        $this->command->line('✅ Product Seeder finished.');
    }
}