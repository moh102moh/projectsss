<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Company;
class CheckCompanyApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
   public function handle($request, Closure $next)
{
    $key = $request->header('X-API-Key');
    $company = \App\Models\Company::where('api_key', $key)->first();

    if (!$company) {
        return response('Unauthorized', 401);
    }

    $request->merge(['company' => $company]);

    return $next($request);
}

}
