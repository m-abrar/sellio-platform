<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;
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
     * @return \Illuminate\Contracts\View\View|\Symfony\Component\HttpFoundation\Response
     */
    public function __invoke(Request $request)
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
     * @return \Illuminate\Contracts\View\View|\Symfony\Component\HttpFoundation\Response
     */
    public function landing(string $group, string $type)
    {
        return $this->__invoke(request());
    }

    /**
     * General homepage entry point.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Contracts\View\View|\Symfony\Component\HttpFoundation\Response
     */
    public function index(Request $request)
    {
        return $this->__invoke($request);
    }
}
