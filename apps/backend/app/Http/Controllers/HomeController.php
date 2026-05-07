<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class HomeController
 * Serves as the primary entry point for the marketplace, 
 * delegating requests to the UnifiedHomeController for multi-theme routing.
 */
class HomeController extends Controller
{
    /**
     * Invoke the primary landing logic via proxy.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function __invoke(Request $request): Response
    {
        /** @var UnifiedHomeController $controller */
        $controller = app(UnifiedHomeController::class);
        return $controller->index($request);
    }

    /**
     * Handle vertical-specific landing requests.
     *
     * @param  string  $group
     * @param  string  $type
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function landing(string $group, string $type): Response
    {
        return $this->__invoke(request());
    }

    /**
     * General homepage entry point.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request): Response
    {
        return $this->__invoke($request);
    }
}
