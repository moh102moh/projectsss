<?php
use App\Events\AgentCommandDispatched;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RouterController;
use App\Http\Controllers\CompanyController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-command', function () {
    event(new AgentCommandDispatched([
        'command' => 'create_user',
        'params' => [
            'username' => 'khldon',
            'password' => '123456',
        ],
    ]));

    return 'Command sent!';
});

Route::get('/list_ips', function () {
    event(new AgentCommandDispatched([
        'command' => 'list_ip',
        'params' => [
           
        ],
    ]));
    

    return 'Command sent!';
});

//Route::get('/download-script/{router}', [RouterController::class, 'download']);
Route::get('/download-script/{company}', [CompanyController::class, 'download']);
//Route::get('/download-script/{company}', [CompanyController::class, 'download']);