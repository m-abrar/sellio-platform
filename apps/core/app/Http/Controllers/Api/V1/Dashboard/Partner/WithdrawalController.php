<?php

// namespace App\Http\Controllers\Api\V1\Dashboard\Partner;

// use App\Models\Withdrawal;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;

// class WithdrawalController extends Controller
// {
//     public function store(Request $request)
//     {
//         dd($request->all());
//         $validated = $request->validate([
//             'amount' => 'required|numeric|min:1',
//             'method' => 'required|string|max:255',
//             'details' => 'nullable|string',
//         ]);

//         dd($validated);

//         $user = Auth::user();

//         // Check balance before request
//         if ($user->balance < $validated['amount']) {
//             return back()->with('error', 'Insufficient balance.');
//         }

//         Withdrawal::create([
//             'user_id' => $user->id,
//             'amount' => $validated['amount'],
//             'method' => $validated['method'],
//             'details' => $validated['details'],
//             'status' => 'pending',
//         ]);

//         return back()->with('success', 'Withdrawal request submitted for approval.');
//     }
// }
