<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchBlogRequest;
use App\Models\Blog;
use App\Services\BlogService;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;

/**
 * Class BlogController
 *
 * Handles blog listings, searching, and article display.
 *
 * @package App\Http\Controllers
 */
class BlogController extends Controller
{
    /**
     * @var BlogService
     */
    protected BlogService $blogService;

    /**
     * BlogController constructor.
     *
     * @param BlogService $blogService
     */
    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    /**
     * Display the blog listing index.
     *
     * @param SearchBlogRequest $request
     * @return View
     */
    public function index(SearchBlogRequest $request): View
    {
        return $this->search($request);
    }

    /**
     * Perform blog search/filtering.
     *
     * @param SearchBlogRequest $request
     * @return View
     */
    public function search(SearchBlogRequest $request): View
    {
        $filters = $request->validated();
        $perPage = $request->query('per_page', 3);
        // We use the service to handle complex queries (tags, categories, etc.)
        $data = $this->blogService->getBlogListPageData($filters, $perPage);

        return view("frontend.blogs.index", $data);
    }

    /**
     * Display a specific blog post.
     *
     * @param Request $request
     * @param string $slug
     * @return View
     */
    public function show(Request $request, string $slug): View
    {
        $blog = Blog::where('slug', $slug)
            ->active() // Using the scope from our Model
            ->with([
                'user', 'category', 'tags', 'reviews.user', 'media'
            ])
            ->firstOrFail();

        // Get related posts or sidebar data via Service
        $viewData = $this->blogService->getBlogDetailsData($blog);
        
        // Log the view for analytics (HasAnalytics trait)
        $this->blogService->logBlogView($blog);

        return view("frontend.blogs.show.show", $viewData);
    }

    /**
     * Optional: Handle category-specific listings
     * * @param string $categorySlug
     * @return View
     */
    public function category(string $categorySlug): View
    {
        $data = $this->blogService->getCategoryPageData($categorySlug);
        
        return view("frontend.blogs.index", $data);
    }
}
