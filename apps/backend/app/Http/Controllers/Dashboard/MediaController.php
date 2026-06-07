<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\Amenity;
use App\Models\Auto;
use App\Models\Blog;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Classified;
use App\Models\Event;
use App\Models\Feature;
use App\Models\JobListing;
use App\Models\LineItem;
use App\Models\Location;
use App\Models\Page;
use App\Models\PageContent;
use App\Models\Plan;
use App\Models\Product;
use App\Models\ProductAddon;
use App\Models\Property;
use App\Models\Service;
use App\Models\Tag;
use App\Models\Testimonial;
use App\Models\Transaction;
use App\Models\Type;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\HasMedia;

class MediaController extends Controller
{
    /**
     * Map of allowed model identifiers to their respective classes.
     */
    /**
     * Map of allowed model identifiers to their respective classes.
     */
    public static array $modelMap = [
        'auto'          => Auto::class,
        'property'      => Property::class,
        'event'         => Event::class,
        'job'           => JobListing::class,
        'service'       => Service::class,
        'product'       => Product::class,
        'classified'    => Classified::class,
        'blog'          => Blog::class,
        'user'          => User::class,
        'advertisement' => Advertisement::class,
        'testimonial'   => Testimonial::class,
        'location'      => Location::class,
        'addon'         => ProductAddon::class,
        'category'      => Category::class,
        'brand'         => Brand::class,
        'tag'           => Tag::class,
        'type'          => Type::class,
        'amenity'       => Amenity::class,
        'feature'       => Feature::class,
        'plan'          => Plan::class,
        'page'          => Page::class,
        'transaction'   => Transaction::class,
        'line-item'     => LineItem::class,
        'classified'    => Classified::class,
        'auto'          => Auto::class,
        'page-content'  => PageContent::class,
    ];

    /**
     * Get the class name for a given alias.
     */
    public static function getClass(string $alias): ?string
    {
        return self::$modelMap[strtolower($alias)] ?? null;
    }

    /**
     * Handle AJAX image uploads.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image'    => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'model'    => 'required|string',
            'id'       => 'required|integer', // Made required to prevent auto-creation
            'name'     => 'nullable|string',
            'multiple' => 'nullable|boolean',
        ]);

        $modelClass = self::getClass($request->model);
        
        if (!$modelClass) {
            return response()->json(['success' => false, 'message' => "Unauthorized model access."], 403);
        }

        $model = $modelClass::find($request->id);

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Target resource not found.'], 404);
        }

        // Authorization check: User must own the resource or be an admin
        $isAuthorized = false;
        if (auth()->user()->hasRole(['admin', 'super-admin'])) {
            $isAuthorized = true;
        } elseif ($model instanceof User) {
            $isAuthorized = $model->id === auth()->id();
        } elseif (isset($model->user_id)) {
            $isAuthorized = $model->user_id === auth()->id();
        } elseif (method_exists($model, 'user')) {
            $isAuthorized = $model->user()->where('id', auth()->id())->exists();
        }

        if (!$isAuthorized) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access to this resource.'], 403);
        }

        $isMultiple = $request->boolean('multiple');
        $collection = $isMultiple ? 'images' : 'featured_image';

        if ($request->filled('name')) {
            $collection = ($request->name === 'image') ? 'featured_image' : $request->name;
        }

        if (in_array($collection, ['featured_image', 'avatar'], true)) {
            $model->clearMediaCollection($collection);
        }

        $media = $model->addMediaFromRequest('image')->toMediaCollection($collection);

        return response()->json([
            'success'    => true,
            'media_id'   => $media->id,
            'url'        => $media->getUrl(),
            'name'       => $media->name,
            'collection' => $collection,
        ]);
    }

    /**
     * Handle AJAX image deletion.
     */
    public function delete(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|string',
            'model' => 'required|string',
            'id'    => 'required|integer',
            'name'  => 'required|string',
        ]);

        $modelClass = self::getClass($request->model);
        
        if (!$modelClass) {
            return response()->json(['success' => false, 'message' => "Unauthorized model access."], 403);
        }

        $model = $modelClass::find($request->id);

        if (!$model) {
            return response()->json(['success' => false, 'message' => 'Resource not found.'], 404);
        }

        // Authorization check: User must own the resource or be an admin
        $isAuthorized = false;
        if (auth()->user()->hasRole(['admin', 'super-admin'])) {
            $isAuthorized = true;
        } elseif ($model instanceof User) {
            $isAuthorized = $model->id === auth()->id();
        } elseif (isset($model->user_id)) {
            $isAuthorized = $model->user_id === auth()->id();
        } elseif (method_exists($model, 'user')) {
            $isAuthorized = $model->user()->where('id', auth()->id())->exists();
        }

        if (!$isAuthorized) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $mediaItems = $model->getMedia($request->name);
        foreach ($mediaItems as $media) {
            if ($media->getUrl() === $request->image) {
                $media->delete();
                return response()->json(['success' => true]);
            }
        }

        return response()->json(['success' => false, 'message' => 'Image not found.']);
    }
}
