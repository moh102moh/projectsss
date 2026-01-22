<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CahrgingController extends Controller
{
   public function chargeUser(Request $request)
{
    $request->validate([
        'customer_id' => 'required|exists:customers,id',
        'amount' => 'required|numeric|min:0.01',
    ]);

    $customer = Customer::findOrFail($request->customer_id);
    $agent = Auth::guard('agent')->user(); // if agents are authenticated separately

    // Increase balance
    $customer->increment('balance', $request->amount);

    // Log transaction
    BalanceTransaction::create([
        'customer_id' => $customer->id,
        'agent_id'    => $agent->id,
        'amount'      => $request->amount,
        'type'        => 'charge',
        'note'        => 'Charged by agent: ' . $agent->name,
    ]);

    return response()->json(['status' => true, 'message' => 'Balance charged']);
}

public function selfCharge(Request $request)
{
    $request->validate([
        'amount' => 'required|numeric|min:0.01',
    ]);

    $customer = Auth::guard('customer')->user();

    $customer->increment('balance', $request->amount);

    BalanceTransaction::create([
        'customer_id' => $customer->id,
        'amount'      => $request->amount,
        'type'        => 'charge',
        'note'        => 'Manual self-charge',
    ]);

    return response()->json(['status' => true, 'message' => 'Balance added']);
}


}
