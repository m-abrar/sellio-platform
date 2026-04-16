<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Location;
use App\Models\Amenity;
use App\Models\Tag;

// Import all primary models that participate in relationships
use App\Models\Property;
use App\Models\Event;
use App\Models\Auto;
use App\Models\JobListing;
use App\Models\Service;
use App\Models\Classified;
use App\Models\Product;
use App\Models\Blog;

/**
 * Class RelationSeeder
 *
 * This seeder is responsible for populating the intermediate tables and foreign keys
 * that establish relationships between the core listing modules (Property, Auto, Event, etc.)
 * and their supporting data tables (Location, Amenity, Tag). It ensures the seeded data
 * is fully interconnected for demonstration purposes.
 */
class RelationSeeder extends Seeder
{
    /**
     * Array mapping model names to their fully qualified class names.
     * These are the modules that receive location/tag links.
     *
     * @var array<string, string>
     */
    protected $models = [
        'Property' => Property::class,
        'Auto' => Auto::class,
        'Event' => Event::class,
        'Service' => Service::class,
        'JobListing' => JobListing::class,
        'Classified' => Classified::class,
        'Product' => Product::class,
        'Blog' => Blog::class,
    ];

    /**
     * Run the database seeds.
     *
     * Executes the specific linking methods to establish all required relationships.
     *
     * @return void
     */
    public function run(): void
    {
        $this->command->newLine();
        $this->command->info('🔗 Starting **Relation Seeder**...');
        $this->command->line('This seeder links primary models to their supporting tables (Locations, Amenities, Tags).');
        $this->command->newLine();
        
        $this->linkLocations();
        $this->command->newLine();

        $this->linkAmenities(); // Specific to Property module
        $this->command->newLine();
        
        $this->linkTags(); // Applies to all 6 modules
        
        $this->command->newLine();
        $this->command->info('✅ Relation Seeder finished successfully!');
        $this->command->newLine();
    }

    // -------------------------------------------------------------------
    // 1. LOCATION LINKING (One-to-Many: Listings -> Location)
    // -------------------------------------------------------------------

    /**
     * Links a random location_id to every record in all primary listing modules.
     * This creates the One-to-Many relationship (each listing belongs to one location).
     *
     * @return void
     */
    protected function linkLocations(): void
    {
        $this->command->info('🗺️ **1. Linking Locations (One-to-Many)**');

        // Get all available location IDs for random assignment
        $locationIds = Location::pluck('id')->toArray();

        if (empty($locationIds)) {
            $this->command->error("❌ Locations not found. Did LocationSeeder run?");
            return;
        }
        
        $totalLinked = 0;

        foreach ($this->models as $name => $modelClass) {
            $records = $modelClass::all();
            $count = $records->count();

            if ($count === 0) {
                $this->command->line("- Skipping {$name}: No records found.");
                continue;
            }

            try {
                // Iterate through all records of the current model
                $records->each(function ($model) use ($locationIds) {
                    $randomLocationId = $locationIds[array_rand($locationIds)];
                    // Assign the foreign key directly to the model
                    $model->update(['location_id' => $randomLocationId]);
                });
                $this->command->info("✓ {$name}: **{$count}** records updated with a random location_id.");
                $totalLinked += $count;
            } catch (\Exception $e) {
                // Catch exceptions typically caused by a missing 'location_id' column in the model's table
                $this->command->line("⚠️ Skipping location link for {$name}. Missing 'location_id' column or another error.");
                // Optionally display the error message for debugging
                // $this->command->line("Error: " . $e->getMessage()); 
            }
        }
        $this->command->line("Total records linked to Locations: {$totalLinked}");
    }

    // -------------------------------------------------------------------
    // 2. AMENITY LINKING (Many-to-Many - Properties only)
    // -------------------------------------------------------------------

    /**
     * Links a random subset of Amenity records to Property listings.
     * This establishes the Many-to-Many relationship (e.g., property_amenity pivot table).
     *
     * @return void
     */
    protected function linkAmenities(): void
    {
        $this->command->info('🏠 **2. Linking Amenities (Many-to-Many to Property only)**');

        // Get all available amenity IDs
        $amenityIds = Amenity::pluck('id')->toArray();
        $minItems = 1;
        $maxItems = 5;

        if (empty($amenityIds)) {
            $this->command->error("❌ Amenities not found. Did AmenitySeeder run?");
            return;
        }
        
        $totalAttachments = 0;
        $properties = Property::all();
        $propertyCount = $properties->count();

        if ($propertyCount === 0) {
            $this->command->line("- Skipping: No Property records found.");
            return;
        }

        try {
            // Amenities are only linked to Property listings based on business logic
            $properties->each(function (Property $property) use ($amenityIds, $minItems, $maxItems, &$totalAttachments) {
                $count = rand($minItems, $maxItems);
                // Get a random unique subset of amenity IDs using Laravel Collections
                $randomIds = collect($amenityIds)->shuffle()->take($count)->all();
                
                // Attach the random set of IDs to the property using the 'amenities' relationship.
                // syncWithoutDetaching is used to safely attach IDs without affecting existing attachments
                $property->amenities()->syncWithoutDetaching($randomIds); 
                $totalAttachments += count($randomIds);
            });

            $this->command->info("✓ **{$propertyCount}** Property listings linked.");
            $this->command->line("Total Amenity links created: {$totalAttachments}");
        } catch (\Exception $e) {
            $this->command->error("❌ Error linking amenities to Property. Please check the 'amenities()' relationship and pivot table.");
            // $this->command->line("Error: " . $e->getMessage()); 
        }
    }

    // -------------------------------------------------------------------
    // 3. TAG LINKING (Polymorphic Many-to-Many - All modules)
    // -------------------------------------------------------------------

    /**
     * Links a random subset of Tag records to all primary listing modules polymorphically.
     * This establishes the Polymorphic Many-to-Many relationship (e.g., taggables pivot table).
     *
     * @return void
     */
    protected function linkTags(): void
    {
        $this->command->info('🏷️ **3. Linking Tags (Polymorphic Many-to-Many)**');

        // Get all available tag IDs
        $tagIds = Tag::pluck('id')->toArray();
        $minItems = 1;
        $maxItems = 3;

        if (empty($tagIds)) {
            $this->command->error("❌ Tags not found. Did TagSeeder run?");
            return;
        }
        
        $totalAttachments = 0;

        // Loop through all six primary modules defined in $this->models
        foreach ($this->models as $name => $modelClass) {
            $records = $modelClass::all();
            $count = $records->count();

            if ($count === 0) {
                $this->command->line("- Skipping {$name}: No records found.");
                continue;
            }

            try {
                $records->each(function ($model) use ($tagIds, $minItems, $maxItems, &$totalAttachments) {
                    $numTags = rand($minItems, $maxItems);
                    
                    // Get a random unique subset of tag IDs for the current model instance
                    $randomIds = collect($tagIds)->shuffle()->take($numTags)->all();
                    
                    // Attach the tags using the polymorphic 'tags()' relationship method.
                    $model->tags()->syncWithoutDetaching($randomIds);
                    $totalAttachments += count($randomIds);
                });
                $this->command->info("✓ {$name}: **{$count}** records linked to Tags.");
            } catch (\Exception $e) {
                // Catch exceptions typically caused by a missing 'tags()' relationship method on the model
                $this->command->line("⚠️ Skipping tag link for {$name}. Missing 'tags()' relationship or polymorphic column.");
                // $this->command->line("Error: " . $e->getMessage());
            }
        }
        $this->command->line("Total Tag links created across all modules: {$totalAttachments}");
    }
}