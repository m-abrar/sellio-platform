<?php

namespace App\Http\Middleware;

use App\Services\CorsOriginResolver;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyDynamicCorsOrigins
{
    public function __construct(
        protected CorsOriginResolver $corsOriginResolver,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        config([
            'cors.allowed_origins' => $this->corsOriginResolver->resolve(),
        ]);

        return $next($request);
    }
}
