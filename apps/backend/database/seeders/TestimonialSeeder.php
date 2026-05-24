<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\Theme;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seeds testimonials extracted from storefront theme Page.tsx files.
 */
class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $records = $this->getThemeTestimonials();
        $total = count($records);

        $this->command->line("💬 Seeding Testimonials (**{$total}** total)...");

        DB::table('testimonial_theme')->delete();
        DB::table('testimonials')->delete();

        $themeIds = Theme::query()->pluck('id', 'theme_key');

        foreach ($records as $index => $record) {
            $themeKey = $record['theme_key'];
            unset($record['theme_key']);

            if (! $themeIds->has($themeKey)) {
                $this->command->warn("Skipping testimonial for missing theme: {$themeKey}");

                continue;
            }

            $testimonial = Testimonial::create([
                'author_name' => $record['author_name'],
                'author_title' => $record['author_title'] ?? null,
                'company' => $record['company'] ?? null,
                'quote' => $record['quote'],
                'rating' => $record['rating'] ?? 5,
                'status' => Testimonial::STATUS_PUBLISHED,
                'sort_order' => $record['sort_order'] ?? $index,
            ]);

            $testimonial->themes()->sync([
                $themeIds[$themeKey] => [
                    'priority' => $record['sort_order'] ?? $index,
                    'is_featured' => (bool) ($record['is_featured'] ?? false),
                ],
            ]);
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function getThemeTestimonials(): array
    {
        return [
            // services/corporate/Page.tsx
            [
                'theme_key' => 'services_corporate',
                'author_name' => 'Jane Doe',
                'author_title' => 'CEO',
                'company' => 'Global Solutions Inc.',
                'quote' => 'Partnering with Corporate Services was a game-changer for our business. Their strategic insights and dedicated team helped us navigate complex market shifts and achieve unprecedented growth.',
                'sort_order' => 0,
                'is_featured' => true,
            ],
            [
                'theme_key' => 'services_corporate',
                'author_name' => 'John Smith',
                'author_title' => 'CFO',
                'company' => 'Tech Innovations',
                'quote' => 'The team at Corporate Services provided invaluable support in optimizing our financial strategies. Their expertise directly led to significant cost savings and improved our overall financial health.',
                'sort_order' => 1,
            ],
            [
                'theme_key' => 'services_corporate',
                'author_name' => 'Emily White',
                'author_title' => 'COO',
                'company' => 'Apex Ventures',
                'quote' => 'We were thoroughly impressed by their commitment to understanding our unique challenges and delivering tailored solutions. The results speak for themselves - a stronger team and a clearer path forward.',
                'sort_order' => 2,
            ],

            // autos/luxury/Page.tsx
            [
                'theme_key' => 'autos_luxury',
                'author_name' => 'Julian D.',
                'author_title' => 'Collector',
                'quote' => 'The service was impeccable and discreet. Found my dream classic car with ease. Truly a five-star experience from start to finish.',
                'sort_order' => 0,
                'is_featured' => true,
            ],
            [
                'theme_key' => 'autos_luxury',
                'author_name' => 'Sarah K.',
                'author_title' => 'Entrepreneur',
                'quote' => 'Seamless, professional, and unparalleled inventory. They connected me with the perfect new SUV before it was even publicly listed.',
                'sort_order' => 1,
            ],
            [
                'theme_key' => 'autos_luxury',
                'author_name' => 'Marcus T.',
                'author_title' => 'Investor',
                'quote' => 'Beyond expectations. The attention to detail and personalized guidance made the acquisition of my Rolls Royce a pleasure.',
                'sort_order' => 2,
            ],

            // properties/classic/Page.tsx
            [
                'theme_key' => 'properties_classic',
                'author_name' => 'A. Bennett',
                'author_title' => 'Estate Patron',
                'quote' => 'Estate & Heritage turned a daunting task into a delightful journey. Their market knowledge is unmatched.',
                'sort_order' => 0,
                'is_featured' => true,
            ],
            [
                'theme_key' => 'properties_classic',
                'author_name' => 'M. Chen',
                'author_title' => 'Institutional Lead',
                'quote' => 'Personalized service and fantastic negotiation. Highly recommend for classic property sales.',
                'sort_order' => 1,
            ],
            [
                'theme_key' => 'properties_classic',
                'author_name' => 'T. Davis',
                'author_title' => 'Heritage Collector',
                'quote' => 'They understand the nuances of classic architecture and helped us secure a property of historical significance.',
                'sort_order' => 2,
            ],

            // services/marketplace/Page.tsx
            [
                'theme_key' => 'services_marketplace',
                'author_name' => 'John D.',
                'author_title' => 'Client',
                'company' => 'Plumbing Repairs',
                'quote' => 'Hiring a plumber was seamless and fast! Mark T. fixed our leak within an hour. Highly recommend this platform for reliable services.',
                'sort_order' => 0,
                'is_featured' => true,
            ],

            // services/local/Page.tsx
            [
                'theme_key' => 'services_local',
                'author_name' => 'Jessica L.',
                'author_title' => 'Home Cleaning Client',
                'quote' => 'The easiest way I\'ve ever found a reliable cleaner! Sarah K. was punctual, professional, and my house sparkled. Highly recommend HomeFix to my neighbors.',
                'sort_order' => 0,
                'is_featured' => true,
            ],

            // services/creative/Page.tsx
            [
                'theme_key' => 'services_creative',
                'author_name' => 'Josh T.',
                'author_title' => 'Client',
                'company' => 'Hired a UX Designer',
                'quote' => 'I found my dream design job here! The platform made it incredibly easy to showcase my UI/UX work and connect with top-tier clients globally. Highly recommended for any serious creative.',
                'sort_order' => 0,
                'is_featured' => true,
            ],
        ];
    }
}
