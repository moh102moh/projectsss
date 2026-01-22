<?php

namespace App\Http\Controllers;

use App\Events\CommandCreated;
use App\Models\Command;

 function store(Request $request)
{
    $validated = $request->validate([
        'agent_id' => 'required|string',
        'command' => 'required|string',
        'params' => 'nullable|array',
    ]);

    // إلغاء الأوامر السابقة غير المنفذة لهذا الجهاز
    Command::where('agent_id', $validated['agent_id'])
        ->where('status', 'pending')
        ->update(['status' => 'cancelled']);

    $command = Command::create([
        'agent_id' => $validated['agent_id'],
        'command' => $validated['command'],
        'params' => $validated['params'],
        'status' => 'pending',
    ]);

    // بث الأمر إلى الجهاز عبر WebSocket
    broadcast(new CommandCreated($command))->toOthers();

    return response()->json(['status' => 'sent', 'command' => $command]);
}
