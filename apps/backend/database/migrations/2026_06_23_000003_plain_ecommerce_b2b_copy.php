<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('page_contents')) {
            return;
        }

        $this->replaceThemeContent([
            ['hero', 'title', "Orthopedic instruments\nfor global distributors.", 'Bone Surgery Instruments'],
            ['hero', 'title', "Bone surgery instruments\nfor export buyers.", 'Bone Surgery Instruments'],
            ['hero', 'title', 'Orthopedic Instruments', 'Bone Surgery Instruments'],
            ['hero', 'description', 'Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.', 'Reusable bone surgery, trauma, spine, and OEM instrument supply for importers, distributors, and hospital purchasing teams.'],
            ['hero', 'description', 'Aadab International manufactures reusable orthopedic instruments, trauma instruments, bone surgery sets, retractors, elevators, and private-label surgical instruments for importers, distributors, and OEM buyers.', 'Reusable bone surgery, trauma, spine, and OEM instrument supply for importers, distributors, and hospital purchasing teams.'],
            ['collection', 'description', 'A selection of orthopedic instruments and procedure sets. Each shipment can include material traceability, packing lists, inspection records, and export documentation.', 'A practical catalog for importers, distributors, OEM buyers, and tender suppliers. For exact sizes, finish, marking, packing, and documents, send an RFQ.'],
            ['rfq', 'description', 'Submit item codes, quantities, stainless-steel grade, finish, private-label needs, destination port, and delivery timeline. Our export team responds within 48 business hours with pricing, lead time, and document options.', 'Send item codes, quantities, finish, branding, destination country, and any required documents. We will review the details and reply with pricing, lead time, and practical export options.'],
            ['footer', 'description', 'Aadab International is a Sialkot, Pakistan based manufacturer and exporter of reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers.', 'Aadab International is a manufacturer and exporter of reusable orthopedic surgical instruments based in Sialkot, Pakistan.'],
        ]);
    }

    public function down(): void
    {
        if (! Schema::hasTable('page_contents')) {
            return;
        }

        $this->replaceThemeContent([
            ['hero', 'title', 'Bone Surgery Instruments', "Orthopedic instruments\nfor global distributors."],
            ['hero', 'description', 'Reusable bone surgery, trauma, spine, and OEM instrument supply for importers, distributors, and hospital purchasing teams.', 'Aadab International manufactures and exports reusable orthopedic surgical instruments from Sialkot, Pakistan for hospitals, distributors, importers, and OEM buyers. Browse the catalog, shortlist items, and request export pricing directly from the factory.'],
            ['collection', 'description', 'A practical catalog for importers, distributors, OEM buyers, and tender suppliers. For exact sizes, finish, marking, packing, and documents, send an RFQ.', 'A selection of orthopedic instruments and procedure sets. Each shipment can include material traceability, packing lists, inspection records, and export documentation.'],
            ['rfq', 'description', 'Send item codes, quantities, finish, branding, destination country, and any required documents. We will review the details and reply with pricing, lead time, and practical export options.', 'Submit item codes, quantities, stainless-steel grade, finish, private-label needs, destination port, and delivery timeline. Our export team responds within 48 business hours with pricing, lead time, and document options.'],
            ['footer', 'description', 'Aadab International is a manufacturer and exporter of reusable orthopedic surgical instruments based in Sialkot, Pakistan.', 'Aadab International is a Sialkot, Pakistan based manufacturer and exporter of reusable orthopedic surgical instruments for hospitals, importers, distributors, and OEM buyers.'],
        ]);
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
};
