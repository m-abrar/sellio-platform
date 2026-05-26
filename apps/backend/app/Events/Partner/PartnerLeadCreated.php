<?php

namespace App\Events\Partner;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PartnerLeadCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public Model $record)
    {
    }
}
