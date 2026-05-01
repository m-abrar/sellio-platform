<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;

class PaymentController extends Controller
{
    // Eager load 'payable' to access the associated model (Subscription)
    public function index(Request $request)
    {
        // 1. Define pagination limit
        $perPage = 15; // You can adjust this value

        // 2. Start the query builder with eager loading
        $paymentsQuery = Payment::with(['user', 'payable']);

        // 3. Apply Filters and Search
        
        // Filter by general search term (ID or Transaction ID)
        if ($search = $request->input('search')) {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('id', $search)
                    ->orWhere('transaction_id', 'like', '%' . $search . '%');
            });
        }

        // Filter by Status (enum: pending, completed, failed, refunded)
        if ($status = $request->input('status')) {
            $paymentsQuery->where('status', $status);
        }
        
        // Filter by Payment Method
        if ($method = $request->input('method')) {
            // Use 'like' for methods that might be longer or less standardized
            $paymentsQuery->where('payment_method', 'like', '%' . $method . '%');
        }
        
        // Note: Filtering by 'user_name' would require a JOIN or a separate subquery, 
        // which is more complex. The provided filters are simpler and more efficient.

        // 4. Finalize sorting and apply pagination
        $payments = $paymentsQuery->orderBy('created_at', 'desc')->paginate($perPage); 
        
        // IMPORTANT: To keep search/filter results on the next page, append the query string
        $payments->appends($request->query());
        
        return view('admin.payments.index', compact('payments'));
    }


    public function failed(Request $request)
    {
        // 1. Define pagination limit
        $perPage = 15; // Consistent pagination size

        // 2. Start the query builder with eager loading
        $paymentsQuery = Payment::with(['user', 'payable']);
        
        // --- KEY CHANGE: Filter exclusively for 'failed' status ---
        $paymentsQuery->where('status', 'failed');

        // 3. Apply secondary Filters and Search (optional for failed view)
        
        // Filter by general search term (ID or Transaction ID)
        if ($search = $request->input('search')) {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('id', $search)
                    ->orWhere('transaction_id', 'like', '%' . $search . '%');
            });
        }

        // Filter by Payment Method
        if ($method = $request->input('method')) {
            $paymentsQuery->where('payment_method', 'like', '%' . $method . '%');
        }
        
        // 4. Finalize sorting and apply pagination
        $payments = $paymentsQuery->orderBy('created_at', 'desc')->paginate($perPage); 
        
        // IMPORTANT: To keep search/filter results on the next page, append the query string
        $payments->appends($request->query());
        
        // Pass a contextual variable to the view for the title/heading
        $pageTitle = 'Failed Payments'; 

        // Reuse the same index view, but pass the new title
        return view('admin.payments.index', compact('payments', 'pageTitle'));
    }

    public function create()
    {
        $payment = new Payment();
        $users = User::all();
        $subscriptions = Subscription::all();
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            // Rename from 'subscription_id' to align with form input, and it will be used to set payable_id
            'payable_id' => 'required|exists:subscriptions,id', 
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3', // Fixed max length to match schema
            // Updated methods to align with common database entries (like the ones in your DUMP)
            'payment_method' => 'required|string|max:255', 
            // Updated status to include 'refunded'
            'status' => 'required|in:pending,completed,failed,refunded', 
            'transaction_id' => 'nullable|string|max:255',
            'paid_at' => 'nullable|date', // Added paid_at for explicit manual payment
        ]);

        // Add Polymorphic fields manually
        $data['payable_type'] = Subscription::class;
        // Rename key for creation
        $data['payable_id'] = $data['payable_id']; 
        $data['payment_method'] = $request->method; // Use 'method' from form/validation if renaming 'payment_method'

        Payment::create($data);

        return redirect()->route('admin.payments.index')->with('success', 'Payment created successfully.');
    }

    public function edit(Payment $payment)
    {
        $users = User::all();
        $subscriptions = Subscription::all();
        return view('admin.payments.form', compact('payment', 'users', 'subscriptions'));
    }

    public function update(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'payable_id' => 'required|exists:subscriptions,id',
            'amount' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'payment_method' => 'required|string|max:255',
            'status' => 'required|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|max:255',
            'paid_at' => 'nullable|date',
        ]);

        // Add/Update Polymorphic fields manually
        $data['payable_type'] = Subscription::class;
        $data['payable_id'] = $data['payable_id'];
        $data['payment_method'] = $request->method;

        $payment->update($data);

        return redirect()->route('admin.payments.index')->with('success', 'Payment updated successfully.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('admin.payments.index')->with('success', 'Payment deleted successfully.');
    }
}
