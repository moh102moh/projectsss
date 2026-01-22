<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\AgentsCotroller;
use App\Http\Controllers\PayementMethodController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\RouterController;
use App\Http\Controllers\RouterCommandController;
use App\Http\Controllers\UtilController;
use App\Http\Controllers\orderController;
use App\Http\Controllers\RadiusController;
use App\Http\Controllers\HotelController;

use \Illuminate\Middleware\CheckCompanyApiKey;
use App\Models\Router;
use App\Models\RouterCommand;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use GuzzleHttp\Cookie\CookieJar;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/connect', function (Request $request) {
    // تحقق من الطلب
    $ip = $request->input('ip');
    $username = $request->input('username');
    $password = $request->input('password');

    // إرسال الطلب إلى الـ Local Agent
    $response = Http::post('http://192.168.88.100:5000/connect', [
        'ip' => $ip,
        'username' => $username,
        'password' => $password,
    ]);

    return $response->json();
});

Route::post('/commands', [CommandController::class, 'store']);
Route::post('/calc', [UtilController::class,'calculateDistance']);












