<?php

namespace App\Services\Admin;

use App\Models\Auto;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Class AutoManagementService
 *
 * Orchestrates the business logic for the Automotive vertical, managing 
 * inventory updates, publication lifecycle, and replication workflows.
 */
class AutoManagementService
{
    /**
     * Get all data required for the automotive listing index.
     *
     * @param \Illuminate\Http\Request $request
     * @return array
     */
    public function getListingData(\Illuminate\Http\Request $request): array
    {
        $categories = \App\Models\Category::active()->where('is_auto', 1)->get();
        if ($categories->isEmpty()) $categories = \App\Models\Category::active()->get();

        $brands = \App\Models\Brand::active()->where('is_auto', 1)->get();
        if ($brands->isEmpty()) $brands = \App\Models\Brand::active()->get();

        $locations = \App\Models\Location::active()->where('is_auto', 1)->get();
        if ($locations->isEmpty()) $locations = \App\Models\Location::active()->get();

        $autos = Auto::query()
            ->with(['user', 'category', 'brand', 'location'])
            ->when($request->title, fn($q) => $q->where('title', 'like', '%' . $request->title . '%'))
            ->when($request->brand_id, fn($q) => $q->where('brand_id', $request->brand_id))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->location_id, fn($q) => $q->where('location_id', $request->location_id))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return compact('autos', 'categories', 'brands', 'locations');
    }

    /**
     * Get all taxonomies for the automotive form.
     *
     * @return array
     */
    public function getFormData(): array
    {
        $categories = \App\Models\Category::active()->where('is_auto', 1)->get();
        if ($categories->isEmpty()) $categories = \App\Models\Category::active()->get();

        $brands = \App\Models\Brand::active()->where('is_auto', 1)->get();
        if ($brands->isEmpty()) $brands = \App\Models\Brand::active()->get();

        $locations = \App\Models\Location::active()->where('is_auto', 1)->get();
        if ($locations->isEmpty()) $locations = \App\Models\Location::active()->get();

        return compact('categories', 'brands', 'locations');
    }

    /**
     * Create or update an automotive listing.
     *
     * @param array $data
     * @param Auto|null $auto
     * @return Auto
     */
    public function saveAuto(array $data, ?Auto $auto = null): Auto
    {
        return DB::transaction(function () use ($data, $auto) {
            $data = $this->normalizeAutoData($data);

            $data['is_published'] = isset($data['is_published']) ? (bool)$data['is_published'] : false;
            $data['is_featured']  = isset($data['is_featured']) ? (bool)$data['is_featured'] : false;

            if ($auto) {
                $auto->update($data);
                return $auto;
            }

            if (!isset($data['user_id'])) {
                $data['user_id'] = auth()->id();
            }

            return Auto::create($data);
        });
    }

    /**
     * Normalize admin form values to database-ready attributes.
     */
    protected function normalizeAutoData(array $data): array
    {
        if (empty($data['slug']) && ! empty($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $data['city'] = $data['city'] ?? 'N/A';
        $data['country'] = $data['country'] ?? 'USA';

        $engineMap = [
            'petrol' => 'Gasoline',
            'diesel' => 'Diesel',
            'electric' => 'Electric',
            'hybrid' => 'Hybrid',
            'lpg' => 'LPG',
        ];
        if (isset($data['fuel_economy']) && isset($engineMap[$data['fuel_economy']])) {
            $data['engine_type'] = $engineMap[$data['fuel_economy']];
            unset($data['fuel_economy']);
        }

        $transmissionMap = [
            'automatic' => 'Automatic',
            'manual' => 'Manual',
            'semi-automatic' => 'Semi-Automatic',
            'cvt' => 'CVT',
        ];
        if (isset($data['transmission'])) {
            $key = strtolower($data['transmission']);
            $data['transmission'] = $transmissionMap[$key] ?? $data['transmission'];
        }

        $drivetrainMap = ['fwd' => 'FWD', 'rwd' => 'RWD', 'awd' => 'AWD', '4wd' => '4WD'];
        if (isset($data['drivetrain'])) {
            $key = strtolower($data['drivetrain']);
            $data['drivetrain'] = $drivetrainMap[$key] ?? strtoupper($data['drivetrain']);
        }

        return $data;
    }

    /**
     * Replicate an existing automotive listing as a draft copy.
     *
     * @param Auto $auto
     * @return Auto
     */
    public function duplicateAuto(Auto $auto): Auto
    {
        return DB::transaction(function () use ($auto) {
            $clone = $auto->replicate();
            $clone->is_published = false;
            $clone->approved_at = null;
            $clone->title = $auto->title . ' ' . __('(Copy)');
            $clone->save();

            return $clone;
        });
    }
}
