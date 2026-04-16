<?php

namespace App\DTOs;

use Stringable;

class ContentResult implements Stringable
{
    public function __construct(
        public int $id,
        public mixed $value
    ) {}

    /**
     * Prevents TypeError in @section('title') or HTML attributes.
     */
    public function __toString(): string
    {
        return (string) ($this->value ?? '');
    }
}
