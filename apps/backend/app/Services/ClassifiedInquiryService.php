<?php

namespace App\Services;

use App\Events\Partner\PartnerLeadCreated;
use App\Models\Classified;
use App\Models\ClassifiedInquiry;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ClassifiedInquiryService
{
    public function createInquiry(Classified $classified, array $data): ClassifiedInquiry
    {
        return DB::transaction(function () use ($classified, $data) {
            $message = $data['message'] ?? null;
            if (!empty($data['offer_price'])) {
                $message = trim(($message ? $message . "\n\n" : '') . __('Offer: :price', [
                    'price' => $data['offer_price'],
                ]));
            }

            $inquiry = ClassifiedInquiry::create([
                'classified_id' => $classified->id,
                'user_id'       => $data['user_id'] ?? Auth::id(),
                'name'          => $data['full_name'],
                'email'         => $data['email'],
                'phone'         => $data['phone'] ?? null,
                'message'       => $message,
                'status'        => ClassifiedInquiry::STATUS_PENDING,
            ]);

            PartnerLeadCreated::dispatch($inquiry);

            return $inquiry;
        });
    }
}
