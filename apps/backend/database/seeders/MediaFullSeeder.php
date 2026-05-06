<?php

// File: database/seeders/MediaFullSeeder.php
// Purpose: Seeds media (images) for various models (e.g., Property, Event, Classified) using the Spatie Media Library package.

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Event;
use App\Models\Auto;
use App\Models\Service;
use App\Models\JobListing;
use App\Models\Classified;
use App\Models\Product;
use App\Models\Blog;
use App\Models\User;
use App\Models\Category;
use App\Models\Type;
use App\Models\Brand;
use App\Models\Location;
use App\Models\Feature;
use App\Models\Tag;
use App\Models\Advertisement;
use App\Models\Amenity;
use App\Models\Plan;
use App\Models\PropertyAddon;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

/**
 * Class MediaFullSeeder
 *
 * Attaches sample media files to various seeded records.
 *
 * FIXES:
 * 1. Performance: Uses chunking (->chunk(50, ...)) to prevent memory exhaustion by fetching all records at once.
 * 2. Feature: Implements a configuration switch (config('app.seed_gallery_media')) to enable/disable gallery media seeding.
 */
class MediaFullSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        // ----------------------------------------------------
        // 🚀 SHARED HOSTING OPTIMIZATIONS
        // ----------------------------------------------------
        set_time_limit(600); // 10 minutes
        ini_set('memory_limit', '1G');
        
        // Custom flag to skip resource-heavy conversions in HasImageAccess trait.
        config(['app.skip_media_conversions' => true]);

        $this->command->warn('🔗 Ensuring storage link exists (php artisan storage:link)...');
        Artisan::call('storage:link', [], $this->command->getOutput());
        // ----------------------------------------------------
        
        $faker = Faker::create();
        $this->command->info('🖼️ Starting Optimized Media Seeder...');
        $this->command->line('Notice: Image conversions are disabled for speed during seeding.');
        $totalAttachments = 0;
        
        // --- Gallery On/Off Switch ---
        // Reads from config/app.php or a custom config file. Defaults to true.
        $seedGalleryMedia = false; // config('app.seed_gallery_media', true);
        if (!$seedGalleryMedia) {
            $this->command->warn('⚠️ Gallery media seeding is disabled by configuration.');
        }
        // -----------------------------

        // Define models by their fully-qualified class name, NOT by fetching all records.
        $modelClasses = [
            'Property' => Property::class,
            'Event' => Event::class,
            'Auto' => Auto::class,
            'Service' => Service::class,
            'JobListing' => JobListing::class,
            'Classified' => Classified::class,
            'Product' => Product::class,
            'Blog' => Blog::class,
            // Supporting Models
            'User' => User::class,
            // 'Category' => Category::class,
            // 'Type' => Type::class,
            // 'Brand' => Brand::class,
            // 'Location' => Location::class,
            // 'Feature' => Feature::class,
            // 'Tag' => Tag::class,
            // 'Advertisement' => Advertisement::class,
            // 'Amenity' => Amenity::class,
            // 'Plan' => Plan::class,
            // 'PropertyAddon' => PropertyAddon::class,
        ];
        
        // Base path where model-specific image folders are located.
        $baseImagesPath = database_path("seeders/images/"); 

        // Define all supported image extensions for glob searching.
        $supportedExtensions = '*.{jpg,jpeg,png,gif,webp,bmp,tiff,svg}';

        // ----------------------------------------------------------------------
        // Loop through all defined models
        // ----------------------------------------------------------------------
        foreach ($modelClasses as $modelName => $modelClass) {
            
            // --- Determine Collection Names ---
            $primaryCollection = defined("{$modelClass}::PRIMARY_MEDIA") 
                                 ? constant("{$modelClass}::PRIMARY_MEDIA") 
                                 : 'images';
                                 
            $galleryCollection = defined("{$modelClass}::GALLERY_MEDIA") 
                                 ? constant("{$modelClass}::GALLERY_MEDIA") 
                                 : null;
            // --- End Collection Names ---

            $modelBaseFolderPath = $baseImagesPath . strtolower($modelName); 
            $primaryFolderPath = $modelBaseFolderPath; 
            
            // Define the gallery path using the gallery collection name as the subfolder
            $galleryFolderPath = $galleryCollection ? $modelBaseFolderPath . '/' . $galleryCollection : null; 

            // 1. Find Primary Images (in the main model folder)
            $primaryFiles = glob($primaryFolderPath . '/' . $supportedExtensions, GLOB_BRACE);
            $primaryCount = count($primaryFiles);

            // 2. Find Gallery Images (in the subfolder)
            $galleryFiles = $galleryCollection ? glob($galleryFolderPath . '/' . $supportedExtensions, GLOB_BRACE) : [];
            $galleryCount = count($galleryFiles);
            
            $totalRecords = $modelClass::count();

            $this->command->line("\n--- Attaching Media to {$modelName} Records ({$totalRecords} total) ---");
            $this->command->line(" Primary Collection: '{$primaryCollection}'" . ($galleryCollection ? ", Gallery Collection: '{$galleryCollection}'" : ""));

            if ($totalRecords === 0) {
                 $this->command->line(" (No {$modelName} records found to attach media to.)");
                 continue;
            }
            
            if (empty($primaryFiles)) {
                $this->command->error("❌ No primary image files found in {$primaryFolderPath}. Skipping {$modelName} model.");
                continue; 
            }

            $this->command->line(" Found {$primaryCount} primary images and {$galleryCount} gallery images.");
            
            // ----------------------------------------------------------------------
            // FIX: Process records in chunks (e.g., 50 at a time) to prevent memory exhaustion
            // ----------------------------------------------------------------------
            $modelClass::chunk(50, function ($records) use ($faker, $modelName, $primaryFolderPath, $primaryCollection, $primaryFiles, $galleryCollection, $galleryCount, $galleryFiles, &$totalAttachments, $seedGalleryMedia) {
            
                // Iterate through each chunk of database records.
                foreach ($records as $record) {
                    
                    // --- Find Specific Primary Image Path (Priority 1 & 2) ---
                    $specificImagePath = null;
                    $foundFile = null;
                    $primaryImagePath = null;
                    $source = '';

                    // Check by ID (e.g., '1.jpg')
                    foreach (['jpg', 'png', 'webp'] as $ext) { 
                        $path = "{$primaryFolderPath}/{$record->id}.{$ext}";
                        if (File::exists($path)) {
                            $foundFile = $path;
                            break;
                        }
                    }

                    // Check by Name (if applicable)
                    if (!$foundFile && isset($record->title)) {
                        $normalizedName = str_replace(' ', '-', strtolower($record->title));
                        foreach (['jpg', 'png', 'webp'] as $ext) { 
                            $path = "{$primaryFolderPath}/{$normalizedName}.{$ext}";
                            if (File::exists($path)) {
                                $foundFile = $path;
                                break;
                            }
                        }
                    }
                    
                    $specificImagePath = $foundFile;

                    // --- Determine Final Primary Image Path (Specific or Fallback) ---
                    if ($specificImagePath) {
                        $primaryImagePath = $specificImagePath;
                        $source = 'specific (ID/Name)';
                    } else {
                        // Use a random fallback image
                        $primaryImagePath = $faker->randomElement($primaryFiles);
                        $source = 'random fallback';
                    }

                    // ----------------------------------------------------------
                    // 3. ATTACH PRIMARY MEDIA
                    // ----------------------------------------------------------
                    if ($primaryImagePath && File::exists($primaryImagePath)) {
                        
                        $record->addMedia($primaryImagePath)
                            ->preservingOriginal()
                            ->toMediaCollection($primaryCollection);

                        $this->command->line(" [OK] {$modelName} ID: {$record->id} attached {$source} image to '{$primaryCollection}': " . basename($primaryImagePath));
                        $totalAttachments++;
                    } else {
                        $this->command->line(" [FAIL] Could not find specific image or fallback for {$modelName} ID: {$record->id}.");
                    }
                    
                    // ----------------------------------------------------------
                    // 4. ATTACH GALLERY MEDIA (If applicable and files exist)
                    // ----------------------------------------------------------
                    if ($seedGalleryMedia && $galleryCollection && $galleryCount > 0) {
                        
                        // Attach 1 to 3 random images (MAXIMUM LIMIT IS 3)
                        $numGalleryItems = $faker->numberBetween(1, min(3, $galleryCount));
                        
                        for ($i = 0; $i < $numGalleryItems; $i++) {
                            $galleryImagePath = $faker->randomElement($galleryFiles);
                            
                            // Skip if the primary image path is identical to the selected gallery path
                            if ($galleryImagePath === $primaryImagePath && $primaryImagePath !== null) {
                                continue;
                            }
                            
                            $record->addMedia($galleryImagePath)
                                ->preservingOriginal()
                                ->toMediaCollection($galleryCollection);

                            $this->command->line(" [OK] Gallery attached to '{$galleryCollection}': " . basename($galleryImagePath));
                            $totalAttachments++;
                        }
                    } elseif ($galleryCollection && $galleryCount === 0) {
                        // Optionally provide a message if gallery is enabled but no files are found
                        // $this->command->line(" [SKIP] No images found in gallery folder '{$galleryFolderPath}'.");
                    }
                }
                // Memory management: Clear references and collect garbage after each chunk
                unset($records);
                gc_collect_cycles();
            }); // End of chunk function
        } // End of model loop

        $this->command->info("\n--- 🏁 Media Seeding Complete ---");
        $this->command->info("🎉 Total media files attached: {$totalAttachments}.");
    }
}