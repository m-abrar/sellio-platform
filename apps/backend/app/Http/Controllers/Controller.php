<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponseTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

/**
 * Class Controller
 * Base administrative controller for the Sellio platform.
 * Provides a centralized foundation for request validation, authorization, and standardized API responses.
 */
abstract class Controller
{
    use ApiResponseTrait, AuthorizesRequests, ValidatesRequests;
}
