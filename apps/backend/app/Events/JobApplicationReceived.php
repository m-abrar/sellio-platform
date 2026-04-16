<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Listing; // Assumed model for the job listing

class JobApplicationReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public $employer; // The user who posted the job
    public $jobListing; // The listing model (job title)
    public $applicationLink; // Direct URL for the employer to view the application

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\User $employer The user who posted the job listing.
     * @param  \App\Models\Listing $jobListing The job listing record.
     * @param  string $applicationLink A URL where the employer can review the application details.
     */
    public function __construct(User $employer, Listing $jobListing, string $applicationLink)
    {
        $this->employer = $employer;
        $this->jobListing = $jobListing;
        $this->applicationLink = $applicationLink;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            //
        ];
    }
}
