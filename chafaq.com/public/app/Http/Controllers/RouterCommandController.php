<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Models\Router;
use App\Models\RouterCommand;

class RouterCommandController extends Controller
{
    public function getCommand(Request $request, $serial)
{
    $company = $request->get('company');

    $router = Router::where('serial_number', $serial)
        ->where('company_id', $company->id)
        ->firstOrFail();

    $commands = $router->commands()->where('executed', false)->limit(10)->get();

    if ($commands->isEmpty()) {
        return response('', 204);
    }

    $script = '';
    $ids = [];
    
    foreach ($commands as $command) { 
        $script .= "# Command: $command->title\n";
        $script .= "$command->script\n\n";
        $ids[] = $command->id;

        $command->update([
            'executed' => true,
            'executed_at' => now(),
        ]);
    }

    // توليد معرفات الأوامر المنفذة ليرسلها الراوتر
    $idsLine = ':local executedCommandIds "' . implode(',', $ids) . '"';
    $script = "$idsLine\n\n$script";
    

    return response( $script  , 200)->header('Content-Type', 'text/plain');
}

   /* public function getCommands(Request $request, $serial)
    {
        $apiKey = $request->header('X-API-Key');

        $router = Router::where('serial_number', $serial)
            ->whereHas('company', fn($q) => $q->where('api_key', $apiKey))
            ->first();

        if (!$router) {
            return response('// Unauthorized or router not found', 403)
                ->header('Content-Type', 'text/plain');
        }

        // جلب الأوامر غير المنفذة
        $commands = RouterCommand::where('router_id', $router->id)
            ->where('executed', false)
            ->orderBy('id')
            ->get();

        if ($commands->isEmpty()) {
            return response('// No commands', 200)
                ->header('Content-Type', 'text/plain');
        }

        $lines = [];

        // إضافة معرفات الأوامر لتأكيد تنفيذها لاحقًا
        $executedIds = $commands->pluck('id')->implode(',');

        $lines[] = ":local executedCommandIds \"$executedIds\"";

        foreach ($commands as $cmd) {
            $lines[] = $cmd->command;
        }

        $script = implode("\n", $lines);

        return Response::make($script)
            ->header('Content-Type', 'text/plain');
    }*/


    public function markCommandsExecuted(Request $request, $serial)
{
    $apiKey = $request->header('X-API-Key');
    $router = \App\Models\Router::where('serial_number', $serial)
        ->whereHas('company', fn($q) => $q->where('api_key', $apiKey))
        ->first();

    if (!$router) {
        return response('// Unauthorized or router not found', 403)
            ->header('Content-Type', 'text/plain');
    }

    $ids = explode(',', $request->input('ids', ''));

    if (empty($ids)) {
        return response('// No IDs provided', 400)
            ->header('Content-Type', 'text/plain');
    }

    \App\Models\RouterCommand::where('router_id', $router->id)
        ->whereIn('id', $ids)
        ->update(['executed' => true]);

    return response('// Commands marked as executed', 200)
        ->header('Content-Type', 'text/plain');
}

}
