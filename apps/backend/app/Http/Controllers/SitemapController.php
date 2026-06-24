<?php

namespace App\Http\Controllers;

use App\Models\Auto;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Event;
use App\Models\JobListing;
use App\Models\Product;
use App\Models\Property;
use App\Models\Service;
use App\Models\Tag;
use App\Models\Type;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = collect();

        // Static pages
        $urls->push(['loc' => url('/'),                  'priority' => '1.0', 'freq' => 'daily',   'mod' => null]);
        $urls->push(['loc' => route('about'),            'priority' => '0.5', 'freq' => 'monthly', 'mod' => null]);
        $urls->push(['loc' => route('contact'),          'priority' => '0.5', 'freq' => 'monthly', 'mod' => null]);
        $urls->push(['loc' => route('faq'),              'priority' => '0.5', 'freq' => 'monthly', 'mod' => null]);
        $urls->push(['loc' => route('privacy-policy'),   'priority' => '0.3', 'freq' => 'yearly',  'mod' => null]);
        $urls->push(['loc' => route('terms'),            'priority' => '0.3', 'freq' => 'yearly',  'mod' => null]);

        // Module index + detail pages
        $this->addModule($urls, Blog::class,       'blogs.index',      'blogs.show',      '0.8', '0.7', 'daily',  'weekly');
        $this->addModule($urls, Product::class,    'products.index',   'product.show',    '0.8', '0.7', 'daily',  'weekly');
        $this->addModule($urls, Property::class,   'properties.index', 'properties.show', '0.8', '0.7', 'daily',  'weekly');
        $this->addModule($urls, Event::class,      'events.index',     'events.show',     '0.8', '0.7', 'daily',  'weekly');
        $this->addModule($urls, JobListing::class, 'jobs.index',       'jobs.show',       '0.7', '0.6', 'daily',  'weekly');
        $this->addModule($urls, Service::class,    'services.index',   'services.show',   '0.8', '0.7', 'daily',  'weekly');
        $this->addModule($urls, Auto::class,       'autos.index',      'autos.show',      '0.7', '0.6', 'daily',  'weekly');
        $this->addModule($urls, Classified::class, 'classifieds.index','classifieds.show','0.7', '0.6', 'daily',  'weekly');

        // Taxonomy pages
        $this->addTaxonomy($urls, Category::class, 'categories.show', '0.5');
        $this->addTaxonomy($urls, Brand::class,    'brands.show',     '0.5');
        $this->addTaxonomy($urls, Tag::class,      'tags.show',       '0.4');
        $this->addTaxonomy($urls, Type::class,     'types.show',      '0.4');

        // Partner profiles
        User::select(['username', 'updated_at'])
            ->whereNotNull('username')
            ->where('username', '!=', '')
            ->each(function (User $user) use ($urls) {
                $urls->push(['loc' => route('partner.profile', $user->username), 'priority' => '0.5', 'freq' => 'monthly', 'mod' => $user->updated_at]);
            });

        $content = view('sitemap', compact('urls'))->render();

        return response($content, 200)->header('Content-Type', 'application/xml; charset=utf-8');
    }

    private function addModule(Collection $urls, string $model, string $indexRoute, string $showRoute, string $indexPriority, string $detailPriority, string $indexFreq, string $detailFreq): void
    {
        $items = $model::active()->select(['slug', 'updated_at'])->orderByDesc('updated_at')->get();

        if ($items->isEmpty()) {
            return;
        }

        $urls->push(['loc' => route($indexRoute), 'priority' => $indexPriority, 'freq' => $indexFreq, 'mod' => $items->max('updated_at')]);

        foreach ($items as $item) {
            $urls->push(['loc' => route($showRoute, $item->slug), 'priority' => $detailPriority, 'freq' => $detailFreq, 'mod' => $item->updated_at]);
        }
    }

    private function addTaxonomy(Collection $urls, string $model, string $showRoute, string $priority): void
    {
        $model::active()->select(['slug', 'updated_at'])->each(function ($item) use ($urls, $showRoute, $priority) {
            $urls->push(['loc' => route($showRoute, $item->slug), 'priority' => $priority, 'freq' => 'weekly', 'mod' => $item->updated_at]);
        });
    }
}
