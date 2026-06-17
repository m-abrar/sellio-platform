<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\JobApplication;

class JobApplicationReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public JobApplication $application) {}

    public function broadcastOn(): array
    {
        // Notify the job poster (listing owner) on their private channel
        $ownerId = $this->application->job?->user_id;
        if (!$ownerId) {
            return [];
        }
        return [new PrivateChannel('App.Models.User.' . $ownerId)];
    }

    public function broadcastAs(): string
    {
        return 'JobApplicationReceived';
    }

    public function broadcastWith(): array
    {
        return [
            'application_id' => $this->application->id,
            'job_title'      => $this->application->job?->title,
            'applicant'      => $this->application->user?->name,
        ];
    }
}
