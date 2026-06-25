<?php

namespace Database\Seeders;

use App\Models\SearchQuery;
use Illuminate\Database\Seeder;

class SearchQuerySeeder extends Seeder
{
    public function run(): void
    {
        SearchQuery::truncate();

        $now = now();

        $entries = [
            // properties
            ['module' => 'properties', 'keyword' => '3-bedroom house with pool',    'filters' => ['property_type' => 'sale',   'bedrooms' => 3, 'max_price' => 500000], 'days' => 0,  'hour' => 9],
            ['module' => 'properties', 'keyword' => 'studio apartment downtown',     'filters' => ['property_type' => 'rental', 'max_price' => 1200],                    'days' => 1,  'hour' => 11],
            ['module' => 'properties', 'keyword' => '2-bed condo near university',  'filters' => ['bedrooms' => 2],                                                      'days' => 2,  'hour' => 14],
            ['module' => 'properties', 'keyword' => 'villa with garden for sale',   'filters' => ['property_type' => 'sale'],                                            'days' => 3,  'hour' => 16],
            ['module' => 'properties', 'keyword' => '3-bedroom house with pool',    'filters' => ['property_type' => 'sale',   'bedrooms' => 3, 'max_price' => 500000], 'days' => 5,  'hour' => 10],
            ['module' => 'properties', 'keyword' => 'beachfront property',          'filters' => ['property_type' => 'sale'],                                            'days' => 7,  'hour' => 8],
            ['module' => 'properties', 'keyword' => 'studio apartment downtown',    'filters' => ['property_type' => 'rental', 'max_price' => 1200],                    'days' => 8,  'hour' => 13],
            ['module' => 'properties', 'keyword' => 'pet-friendly rental',          'filters' => ['property_type' => 'rental'],                                          'days' => 10, 'hour' => 15],

            // autos
            ['module' => 'autos', 'keyword' => 'Toyota Camry',        'filters' => ['transmission' => 'Automatic', 'max_price' => 20000], 'days' => 0,  'hour' => 10],
            ['module' => 'autos', 'keyword' => 'used SUV low mileage', 'filters' => ['type' => 'selling', 'max_price' => 15000],          'days' => 1,  'hour' => 12],
            ['module' => 'autos', 'keyword' => 'Toyota Camry',         'filters' => ['transmission' => 'Automatic', 'max_price' => 20000], 'days' => 3,  'hour' => 9],
            ['module' => 'autos', 'keyword' => 'electric vehicle',     'filters' => ['type' => 'selling'],                                 'days' => 4,  'hour' => 17],
            ['module' => 'autos', 'keyword' => 'BMW lease',            'filters' => ['type' => 'lease'],                                   'days' => 6,  'hour' => 11],
            ['module' => 'autos', 'keyword' => 'pickup truck manual',  'filters' => ['transmission' => 'Manual'],                          'days' => 9,  'hour' => 14],

            // jobs
            ['module' => 'jobs', 'keyword' => 'remote marketing manager',   'filters' => ['workplace_type' => 'remote'],              'days' => 0,  'hour' => 8],
            ['module' => 'jobs', 'keyword' => 'junior developer',           'filters' => ['workplace_type' => 'hybrid'],              'days' => 0,  'hour' => 14],
            ['module' => 'jobs', 'keyword' => 'remote marketing manager',   'filters' => ['workplace_type' => 'remote'],              'days' => 2,  'hour' => 9],
            ['module' => 'jobs', 'keyword' => 'graphic designer part-time', 'filters' => [],                                          'days' => 3,  'hour' => 10],
            ['module' => 'jobs', 'keyword' => 'junior developer',           'filters' => ['workplace_type' => 'hybrid'],              'days' => 5,  'hour' => 16],
            ['module' => 'jobs', 'keyword' => 'accountant on-site',         'filters' => ['workplace_type' => 'on-site'],             'days' => 7,  'hour' => 11],
            ['module' => 'jobs', 'keyword' => 'remote marketing manager',   'filters' => ['workplace_type' => 'remote'],              'days' => 12, 'hour' => 13],

            // events
            ['module' => 'events', 'keyword' => 'cooking class beginner',  'filters' => [],                                           'days' => 0,  'hour' => 11],
            ['module' => 'events', 'keyword' => 'jazz concert weekend',    'filters' => [],                                           'days' => 1,  'hour' => 19],
            ['module' => 'events', 'keyword' => 'tech startup networking', 'filters' => [],                                           'days' => 4,  'hour' => 10],
            ['module' => 'events', 'keyword' => 'yoga workshop',           'filters' => [],                                           'days' => 6,  'hour' => 7],
            ['module' => 'events', 'keyword' => 'cooking class beginner',  'filters' => [],                                           'days' => 8,  'hour' => 12],
            ['module' => 'events', 'keyword' => 'photography masterclass', 'filters' => [],                                           'days' => 11, 'hour' => 15],

            // services
            ['module' => 'services', 'keyword' => 'plumber urgent',          'filters' => ['max_price' => 300],  'days' => 0,  'hour' => 13],
            ['module' => 'services', 'keyword' => 'house cleaning weekly',   'filters' => [],                    'days' => 1,  'hour' => 10],
            ['module' => 'services', 'keyword' => 'electrician same day',    'filters' => [],                    'days' => 2,  'hour' => 8],
            ['module' => 'services', 'keyword' => 'plumber urgent',          'filters' => ['max_price' => 300],  'days' => 3,  'hour' => 14],
            ['module' => 'services', 'keyword' => 'logo design freelancer',  'filters' => ['max_price' => 500],  'days' => 5,  'hour' => 16],
            ['module' => 'services', 'keyword' => 'house cleaning weekly',   'filters' => [],                    'days' => 7,  'hour' => 9],
            ['module' => 'services', 'keyword' => 'AC repair',               'filters' => [],                    'days' => 9,  'hour' => 11],

            // classifieds
            ['module' => 'classifieds', 'keyword' => 'iPhone 14 Pro',       'filters' => ['max_price' => 800],  'days' => 0,  'hour' => 12],
            ['module' => 'classifieds', 'keyword' => 'vintage furniture',   'filters' => [],                    'days' => 2,  'hour' => 15],
            ['module' => 'classifieds', 'keyword' => 'iPhone 14 Pro',       'filters' => ['max_price' => 800],  'days' => 4,  'hour' => 18],
            ['module' => 'classifieds', 'keyword' => 'camera lens 50mm',    'filters' => ['max_price' => 300],  'days' => 6,  'hour' => 10],
            ['module' => 'classifieds', 'keyword' => 'gaming chair',        'filters' => ['max_price' => 200],  'days' => 8,  'hour' => 13],

            // products
            ['module' => 'products', 'keyword' => 'wireless earbuds',  'filters' => ['max_price' => 150],  'days' => 1,  'hour' => 10],
            ['module' => 'products', 'keyword' => 'standing desk',     'filters' => [],                    'days' => 3,  'hour' => 14],
            ['module' => 'products', 'keyword' => 'wireless earbuds',  'filters' => ['max_price' => 150],  'days' => 5,  'hour' => 12],
            ['module' => 'products', 'keyword' => 'coffee machine',    'filters' => ['max_price' => 100],  'days' => 7,  'hour' => 8],

            // smart-search (module = as parsed by AI)
            ['module' => 'properties', 'keyword' => '3-bedroom house near downtown under $500k with a pool', 'filters' => ['bedrooms' => 3, 'max_price' => 500000, 'property_type' => 'sale'], 'days' => 0, 'hour' => 10],
            ['module' => 'jobs',       'keyword' => 'part-time remote marketing job flexible hours',          'filters' => ['workplace_type' => 'remote'],                                     'days' => 1, 'hour' => 9],
            ['module' => 'autos',      'keyword' => 'used SUV under $20k automatic low mileage',             'filters' => ['type' => 'selling', 'transmission' => 'Automatic', 'max_price' => 20000], 'days' => 2, 'hour' => 14],
            ['module' => 'services',   'keyword' => 'plumber available this week for urgent bathroom repair', 'filters' => [],                                                                 'days' => 3, 'hour' => 11],
        ];

        foreach ($entries as $entry) {
            $ts = $now->copy()->subDays($entry['days'])->setHour($entry['hour'])->setMinute(rand(0, 59));
            if ($ts->isFuture()) {
                $ts = $now->copy()->subMinutes(rand(5, 55));
            }

            SearchQuery::create([
                'module'       => $entry['module'],
                'keyword'      => $entry['keyword'],
                'filters'      => $entry['filters'] ?: null,
                'result_count' => null,
                'user_id'      => null,
                'ip_address'   => fake()->ipv4(),
                'created_at'   => $ts,
            ]);
        }
    }
}
