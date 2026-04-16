<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class RegenerateMediaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds the job can run before timing out.
     */
    public $timeout = 600; // 10 minutes

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Log::info("RegenerateMediaJob - Starting media library regeneration...");
            
            // This command regenerates all missing conversions
            Artisan::call('media-library:regenerate', ['--force' => true]);
            
            Log::info("RegenerateMediaJob - Successfully completed media library regeneration!");
        } catch (\Exception $e) {
            Log::error("RegenerateMediaJob - FAILED: " . $e->getMessage());
            throw $e;
        }
    }
}
