<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Property;
use App\Models\Event;
use App\Models\Auto;
use App\Models\Service;
use App\Models\Joblisting;
use App\Models\Classified;
use App\Models\Product;
use App\Models\Blog;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

class MediaSeeder extends Seeder
{
    /**
     * Processes REAL media for EVERY record in the database.
     */
    public function run(): void
    {
        $this->command->warn('🔗 Ensuring storage link exists...');
        Artisan::call('storage:link', [], $this->command->getOutput());

        $faker = Faker::create();
        $this->command->info('🚀 Starting Full Media Seeder (Processing all records)...');
        
        $totalAttachments = 0;
        $seedGalleryMedia = true; // Set to true if you want to seed galleries

        $modelClasses = [
            'Property'   => Property::class,
            'Blog'       => Blog::class,
            'Event'      => Event::class,
            'Auto'       => Auto::class,
            'Service'    => Service::class,
            'Joblisting' => Joblisting::class,
            'Classified' => Classified::class,
            'Product'    => Product::class,
        ];

        $this->command->warn('🗑️ Truncating media table...');
        DB::table('media')->delete();

        $baseImagesPath = database_path("seeders/images/"); 
        $supportedExtensions = '*.{jpg,jpeg,png,gif,webp,bmp,tiff,svg}';
        
        foreach ($modelClasses as $modelName => $modelClass) {
            
            $totalRecords = $modelClass::count();
            if ($totalRecords === 0) {
                $this->command->info(" ⏩ Skipping {$modelName} (0 records found).");
                continue;
            }

            // Spatie Collection Constants from your Models
            $primaryCollection = defined("$modelClass::PRIMARY_MEDIA") ? $modelClass::PRIMARY_MEDIA : 'images';
            $galleryCollection = defined("$modelClass::GALLERY_MEDIA") ? $modelClass::GALLERY_MEDIA : 'gallery';

            // Path logic: /database/seeders/images/blog/...
            $primaryFolderPath = $baseImagesPath . strtolower($modelName); 
            $primaryFiles = glob($primaryFolderPath . '/' . $supportedExtensions, GLOB_BRACE);
            $galleryFiles = glob($primaryFolderPath . '/'.$galleryCollection.'/' . $supportedExtensions, GLOB_BRACE);

            if (empty($primaryFiles)) {
                $this->command->warn("⚠️ No images found for {$modelName}");
            }

            $this->command->line("\n--- Processing {$modelName} ({$totalRecords} records) ---");
            
            $bar = $this->command->getOutput()->createProgressBar($totalRecords);
            $bar->start();

            $modelClass::chunk(100, function ($records) use ($faker, $primaryFiles, $galleryFiles, $primaryCollection, $galleryCollection, $seedGalleryMedia, &$totalAttachments, $bar) {
                foreach ($records as $record) {
                    
                    // 1. Assign Primary Image (Featured Image)
                    $primaryImagePath = !empty($primaryFiles) ? $faker->randomElement($primaryFiles) : null; 

                    if ($primaryImagePath && File::exists($primaryImagePath)) {
                        $record->addMedia($primaryImagePath)
                            ->preservingOriginal()
                            ->toMediaCollection($primaryCollection);
                        
                        // 2. Assign Gallery Images (Post Gallery)
                        if ($seedGalleryMedia && !empty($galleryFiles)) {
                            $numGalleryItems = $faker->numberBetween(1, min(3, count($galleryFiles)));
                            for ($i = 0; $i < $numGalleryItems; $i++) {
                                $record->addMedia($faker->randomElement($galleryFiles))
                                    ->preservingOriginal()
                                    ->toMediaCollection($galleryCollection);
                            }
                        }
                        $totalAttachments++;
                    }
                    $bar->advance();
                }
            });

            $bar->finish();
            $this->command->line(""); 
        }

        $this->command->info("\n🎉 Total media files attached: {$totalAttachments}.");
        $this->command->info("--- 🏁 Media Seeding Complete ---");
    }
}