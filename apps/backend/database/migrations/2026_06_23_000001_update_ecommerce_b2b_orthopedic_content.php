<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('page_contents')) {
            $this->replaceThemeContent([
                ['header', 'brand_label', 'SupplyDesk', 'OrthoForge Instruments'],
                ['hero', 'eyebrow', 'B2B catalog and procurement', 'ISO 13485-aligned orthopedic instrument manufacturing'],
                ['hero', 'title', "Wholesale catalog\nbuilt for RFQs.", "Orthopedic instruments\nfor global distributors."],
                ['hero', 'description', 'A catalog-first storefront for distributors, manufacturers, and wholesale suppliers where buyers request quotes instead of checking out instantly.', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.'],
                ['hero', 'primary_cta_label', 'Browse catalog', 'Browse instruments'],
                ['hero', 'secondary_cta_label', 'Create RFQ', 'Request export quote'],
                ['collection', 'title', 'Featured catalog', 'Featured orthopedic instruments'],
                ['collection', 'description', 'Products stay easy to scan, compare, and qualify before a buyer starts a quote request.', 'A selection of orthopedic instruments and procedure sets. Each shipment can include material traceability, packing lists, inspection records, and export documentation.'],
                ['empty', 'title', 'No catalog products are published yet.', 'No orthopedic instruments are published yet.'],
                ['rfq', 'title', 'RFQ intake for serious buyers', 'Request an orthopedic export quotation'],
                ['rfq', 'description', 'Capture company profile, requested quantities, destination, timeline, files, and internal notes before routing the request to the seller.', 'Submit item codes, quantities, stainless-steel grade, finish, private-label needs, destination port, and delivery timeline. Our export team responds within 48 business hours with pricing, lead time, and document options.'],
                ['footer', 'brand_label', 'SupplyDesk', 'OrthoForge Instruments'],
                ['footer', 'description', 'A B2B catalog storefront for wholesale buyers, procurement teams, quote requests, and specification-led product discovery.', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers. Browse the catalog and request pricing directly from the factory.'],
                ['footer', 'copyright', '(c) 2026 SupplyDesk. All rights reserved.', '(c) 2026 OrthoForge Instruments. All rights reserved.'],
            ]);
        }

        if (Schema::hasTable('menus') && Schema::hasTable('menu_items')) {
            $this->replaceMenuItems([
                ['main_header', 'Catalog', '/explore', 'Instruments', '/explore'],
                ['main_header', 'Industries', '/explore', 'OEM Supply', '/quote'],
                ['main_header', 'RFQ Flow', '/#b2b-rfq', 'Export RFQ', '/quote'],
                ['main_header', 'Procurement', '/explore', 'Quality', '/about'],
                ['utility_header', 'Request Quote', '/#b2b-rfq', 'Request Quote', '/quote'],
                ['utility_header', 'Supplier Login', '#', 'Export Support', '/contact'],
                ['action_buttons', 'Create RFQ', '/#b2b-rfq', 'Export RFQ', '/quote'],
                ['footer_column_1', 'All Products', '/explore', 'All Instruments', '/explore'],
                ['footer_column_1', 'Technical Specs', '/explore', 'Trauma Sets', '/explore'],
                ['footer_column_1', 'Bulk Pricing', '/explore', 'Spine Instruments', '/explore'],
                ['footer_column_2', 'RFQ Requests', '/#b2b-rfq', 'Request RFQ', '/quote'],
                ['footer_column_2', 'Lead Times', '/explore', 'Lead Times', '/quote'],
                ['footer_column_2', 'Buyer Support', '/explore', 'Distributor Support', '/contact'],
                ['footer_column_3', 'Vendor Portal', '#', 'OEM Instruments', '/quote'],
                ['footer_column_3', 'Compliance', '/explore', 'Private Label', '/contact'],
                ['footer_column_3', 'Private Catalogs', '/explore', 'Quality Documents', '/about'],
            ]);
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('page_contents')) {
            $this->replaceThemeContent([
                ['header', 'brand_label', 'OrthoForge Instruments', 'SupplyDesk'],
                ['hero', 'eyebrow', 'ISO 13485-aligned orthopedic instrument manufacturing', 'B2B catalog and procurement'],
                ['hero', 'title', "Orthopedic instruments\nfor global distributors.", "Wholesale catalog\nbuilt for RFQs."],
                ['hero', 'description', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.', 'A catalog-first storefront for distributors, manufacturers, and wholesale suppliers where buyers request quotes instead of checking out instantly.'],
                ['hero', 'primary_cta_label', 'Browse instruments', 'Browse catalog'],
                ['hero', 'secondary_cta_label', 'Request export quote', 'Create RFQ'],
                ['collection', 'title', 'Featured orthopedic instruments', 'Featured catalog'],
                ['collection', 'description', 'A selection of orthopedic instruments and procedure sets. Each shipment can include material traceability, packing lists, inspection records, and export documentation.', 'Products stay easy to scan, compare, and qualify before a buyer starts a quote request.'],
                ['empty', 'title', 'No orthopedic instruments are published yet.', 'No catalog products are published yet.'],
                ['rfq', 'title', 'Request an orthopedic export quotation', 'RFQ intake for serious buyers'],
                ['rfq', 'description', 'Submit item codes, quantities, stainless-steel grade, finish, private-label needs, destination port, and delivery timeline. Our export team responds within 48 business hours with pricing, lead time, and document options.', 'Capture company profile, requested quantities, destination, timeline, files, and internal notes before routing the request to the seller.'],
                ['footer', 'brand_label', 'OrthoForge Instruments', 'SupplyDesk'],
                ['footer', 'description', 'We manufacture and export reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers. Browse the catalog and request pricing directly from the factory.', 'A B2B catalog storefront for wholesale buyers, procurement teams, quote requests, and specification-led product discovery.'],
                ['footer', 'copyright', '(c) 2026 OrthoForge Instruments. All rights reserved.', '(c) 2026 SupplyDesk. All rights reserved.'],
            ]);
        }

        if (Schema::hasTable('menus') && Schema::hasTable('menu_items')) {
            $this->replaceMenuItems([
                ['main_header', 'Instruments', '/explore', 'Catalog', '/explore'],
                ['main_header', 'OEM Supply', '/quote', 'Industries', '/explore'],
                ['main_header', 'Export RFQ', '/quote', 'RFQ Flow', '/#b2b-rfq'],
                ['main_header', 'Quality', '/about', 'Procurement', '/explore'],
                ['utility_header', 'Request Quote', '/quote', 'Request Quote', '/#b2b-rfq'],
                ['utility_header', 'Export Support', '/contact', 'Supplier Login', '#'],
                ['action_buttons', 'Export RFQ', '/quote', 'Create RFQ', '/#b2b-rfq'],
                ['footer_column_1', 'All Instruments', '/explore', 'All Products', '/explore'],
                ['footer_column_1', 'Trauma Sets', '/explore', 'Technical Specs', '/explore'],
                ['footer_column_1', 'Spine Instruments', '/explore', 'Bulk Pricing', '/explore'],
                ['footer_column_2', 'Request RFQ', '/quote', 'RFQ Requests', '/#b2b-rfq'],
                ['footer_column_2', 'Lead Times', '/quote', 'Lead Times', '/explore'],
                ['footer_column_2', 'Distributor Support', '/contact', 'Buyer Support', '/explore'],
                ['footer_column_3', 'OEM Instruments', '/quote', 'Vendor Portal', '#'],
                ['footer_column_3', 'Private Label', '/contact', 'Compliance', '/explore'],
                ['footer_column_3', 'Quality Documents', '/about', 'Private Catalogs', '/explore'],
            ]);
        }
    }

    private function replaceThemeContent(array $replacements): void
    {
        foreach ($replacements as [$section, $key, $from, $to]) {
            DB::table('page_contents')
                ->where('theme_key', 'ecommerce_b2b')
                ->where('page', 'home')
                ->where('section', $section)
                ->where('content_key', $key)
                ->where('value', $from)
                ->update([
                    'value' => $to,
                    'updated_at' => now(),
                ]);
        }
    }

    private function replaceMenuItems(array $replacements): void
    {
        foreach ($replacements as [$location, $fromTitle, $fromUrl, $toTitle, $toUrl]) {
            DB::table('menu_items')
                ->join('menus', 'menus.id', '=', 'menu_items.menu_id')
                ->where('menus.theme_key', 'ecommerce_b2b')
                ->where('menus.location_key', $location)
                ->where('menu_items.title', $fromTitle)
                ->where('menu_items.url', $fromUrl)
                ->update([
                    'menu_items.title' => $toTitle,
                    'menu_items.url' => $toUrl,
                    'menu_items.updated_at' => now(),
                ]);
        }
    }
};
