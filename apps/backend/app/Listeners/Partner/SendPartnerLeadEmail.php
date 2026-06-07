<?php

namespace App\Listeners\Partner;

use App\Events\NewListingLead;
use App\Events\Partner\PartnerLeadCreated;
use App\Services\Partner\PartnerLeadEmailResolver;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPartnerLeadEmail implements ShouldQueue
{
    public function __construct(private PartnerLeadEmailResolver $resolver)
    {
    }

    public function handle(PartnerLeadCreated $event): void
    {
        $resolved = $this->resolver->resolve($event->record);

        if (!$resolved) {
            return;
        }

        NewListingLead::dispatch(
            $resolved['owner'],
            $resolved['listing'],
            $resolved['leadName'],
            $resolved['leadEmail'],
            $resolved['leadMessage']
        );
    }
}
