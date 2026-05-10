<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Wallet Table Names
    |--------------------------------------------------------------------------
    |
    | These are the names of the tables that the wallet package will use to 
    | store transactions and transfers. We keep them standard but ensure 
    | they are defined for architectural stability.
    |
    */

    'wallet' => [
        'table' => 'wallets',
        'model' => \Bavix\Wallet\Models\Wallet::class,
    ],

    'transaction' => [
        'table' => 'transactions',
        'model' => \Bavix\Wallet\Models\Transaction::class,
    ],

    'transfer' => [
        'table' => 'transfers',
        'model' => \Bavix\Wallet\Models\Transfer::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Decimal Precision
    |--------------------------------------------------------------------------
    |
    | For marketplace operations, we enforce a high level of precision to 
    | handle fractional currency units without floating point errors.
    |
    */

    'math' => [
        'scale' => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | Lock Mechanism
    |--------------------------------------------------------------------------
    |
    | We use atomic locks to prevent double-spending or race conditions 
    | during high-concurrency marketplace transactions.
    |
    */

    'lock' => [
        'enabled' => true,
        'seconds' => 1,
    ],

];
