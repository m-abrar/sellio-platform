<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\GatewayCredential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PaymentGatewayController extends Controller
{
    public function index()
    {
        $gateways = PaymentGateway::orderBy('sort_order', 'asc')->get();
        
        return view('admin.payment-gateways.index', compact('gateways'));
    }

    public function edit(PaymentGateway $gateway)
    {
        $blueprints = $gateway->blueprints()->orderBy('sort_order')->get();

        $credentials = $gateway->credentials ?? new GatewayCredential();
        
        $liveConfig = $credentials->live_config ?? [];
        $sandboxConfig = $credentials->sandbox_config ?? [];
        
        return view('admin.payment-gateways.form', compact(
            'gateway', 
            'blueprints', 
            'liveConfig', 
            'sandboxConfig'
        ));
    }

    public function update(Request $request, PaymentGateway $gateway)
    {
        $validationRules = $this->buildValidationRules($gateway);
        $request->validate($validationRules);

        $credentials = $gateway->credentials ?? new GatewayCredential(['payment_gateway_id' => $gateway->id]);
        
        $existingLive = $credentials->live_config ?? [];
        $existingSandbox = $credentials->sandbox_config ?? [];
        
        $newLiveConfig = $request->input('live_config', []);
        $newSandboxConfig = $request->input('sandbox_config', []);

        $credentials->live_config = array_merge(
            $existingLive,
            array_filter($newLiveConfig, fn($value) => $value !== null && $value !== '')
        );

        $credentials->sandbox_config = array_merge(
            $existingSandbox,
            array_filter($newSandboxConfig, fn($value) => $value !== null && $value !== '')
        );

        $gateway->is_active = $request->boolean('is_active');
        $gateway->mode = $request->input('mode', 'sandbox');
        $gateway->save();
        
        $credentials->save();

        return redirect()->route('admin.payment-gateways.index')
                         ->with('success', $gateway->title . ' configuration updated and secured!');
    }
    
    protected function buildValidationRules(PaymentGateway $gateway): array
    {
        $rules = [
            'is_active' => ['nullable', 'boolean'],
            'mode' => ['required', Rule::in(['sandbox', 'live'])],
        ];

        $requiredKeys = $gateway->blueprints()
                                 ->where('is_required', true)
                                 ->pluck('key')
                                 ->toArray();

        foreach ($requiredKeys as $key) {
            $rules["live_config.{$key}"] = [
                'nullable', 
                function ($attribute, $value, $fail) use ($key, $gateway) {
                    if (empty($value) && empty($gateway->credentials->live_config[$key] ?? null)) {
                        $fail("The live configuration field for '{$key}' is required.");
                    }
                }
            ];
            $rules["sandbox_config.{$key}"] = [
                'nullable', 
                function ($attribute, $value, $fail) use ($key, $gateway) {
                    if (empty($value) && empty($gateway->credentials->sandbox_config[$key] ?? null)) {
                        $fail("The sandbox configuration field for '{$key}' is required.");
                    }
                }
            ];
        }

        return $rules;
    }
}
