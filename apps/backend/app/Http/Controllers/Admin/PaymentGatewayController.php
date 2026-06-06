<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use App\Models\GatewayCredential;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

/**
 * Class PaymentGatewayController
 * Orchestrates the administrative configuration of financial gateways, 
 * managing dynamic credential blueprints and environment-specific (Sandbox/Live) security parameters.
 */
class PaymentGatewayController extends Controller
{
    /**
     * Display a listing of all registered payment gateways sorted by priority.
     *
     * @return \Illuminate\View\View
     */
    public function index(): View
    {
        $gateways = PaymentGateway::orderBy('sort_order', 'asc')->get();
        
        return view('admin.payment-gateways.index', compact('gateways'));
    }

    /**
     * Show the configuration interface for a specific payment gateway.
     *
     * @param  \App\Models\PaymentGateway  $gateway
     * @return \Illuminate\View\View
     */
    public function edit(PaymentGateway $gateway): View
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

    /**
     * Update the gateway configuration and securely synchronize credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PaymentGateway  $gateway
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, PaymentGateway $gateway): RedirectResponse
    {
        $mode = $request->input('mode', 'sandbox');
        $validationRules = $this->buildValidationRules($gateway, $mode);
        $request->validate($validationRules);

        $credentials = $gateway->credentials ?? new GatewayCredential(['payment_gateway_id' => $gateway->id]);
        
        $existingLive = $credentials->live_config ?? [];
        $existingSandbox = $credentials->sandbox_config ?? [];
        
        $newLiveConfig = $request->input('live_config', []);
        $newSandboxConfig = $request->input('sandbox_config', []);

        // Atomic Merge Strategy: Preserve existing sensitive keys if new values are not provided.
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
                         ->with('success', __(':title configuration updated and secured successfully!', [
                             'title' => $gateway->title
                         ]));
    }
    
    /**
     * Dynamically build validation rules based on the gateway's blueprint requirements.
     *
     * @param  \App\Models\PaymentGateway  $gateway
     * @return array
     */
    protected function buildValidationRules(PaymentGateway $gateway, string $mode): array
    {
        $rules = [
            'is_active' => ['nullable', 'boolean'],
            'mode'      => ['required', Rule::in(['sandbox', 'live'])],
        ];

        $requiredKeys = $gateway->blueprints()
            ->where('is_required', true)
            ->pluck('key')
            ->toArray();

        $configPrefix = $mode === PaymentGateway::MODE_LIVE ? 'live_config' : 'sandbox_config';
        $existingConfig = $mode === PaymentGateway::MODE_LIVE
            ? ($gateway->credentials->live_config ?? [])
            : ($gateway->credentials->sandbox_config ?? []);

        foreach ($requiredKeys as $key) {
            $rules["{$configPrefix}.{$key}"] = [
                'nullable',
                function ($attribute, $value, $fail) use ($key, $existingConfig, $mode) {
                    if (!empty($value) || !empty($existingConfig[$key] ?? null)) {
                        return;
                    }

                    $environment = $mode === PaymentGateway::MODE_LIVE ? 'live' : 'sandbox';
                    $fail(__('The :environment configuration field for :key is required.', [
                        'environment' => $environment,
                        'key' => $key,
                    ]));
                },
            ];
        }

        return $rules;
    }
}
