<?php

namespace App\Http\Controllers;

use App\Services\HomeDataService;
use Illuminate\Http\Request;
use Illuminate\Contracts\View\View;

/**
 * Class UnifiedHomeController
 *
 * Displays the landing page designed from mutliple modules.
 */
class UnifiedHomeController extends Controller
{
    /**
     * @var HomeDataService
     */
    protected $homeService;

    /**
     * UnifiedHomeController constructor.
     *
     * @param HomeDataService $homeService
     */
    public function __construct(HomeDataService $homeService)
    {
        $this->homeService = $homeService;
    }

    /**
     * Handle the incoming request for the unified home page.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request): View
    {
        $data         = $this->homeService->getHomeData();

        return view("frontend.unifieds.index", $data);
    }
}
