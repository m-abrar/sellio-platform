<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class HomeController
 *
 * Acts as a central dispatcher to route requests to theme-specific controllers
 */
class HomeController extends Controller
{
    public function __invoke(Request $request): mixed
    {
        $controller = app(\App\Http\Controllers\UnifiedHomeController::class);
        return $controller->index($request);
    }

    public function landing(string $group, string $type): mixed
    {
        return $this->__invoke(request());
    }

    public function index(Request $request): mixed
    {
        return $this->__invoke($request);
    }
}
