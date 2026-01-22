<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agents;
class AgentsCotroller extends Controller
{



public function get_agents(Request $request)
{
    $query = Agents::query();

    // Apply filters dynamically
    if ($request->filled('city')) {
        $query->where('city_id', $request->city);
    }

    if ($request->filled('area')) {
        $query->where('area_id', $request->area);
    }

    if ($request->filled('street')) {
        $query->where('street_id', $request->street);
    }

    $agents = $query->get();

    if ($agents->isEmpty()) {
        return response()->json([
            'status' => false,
            'message' => 'No agent found for your location. You can contact a nearby agent.',
        ], 404);
    }

    return response()->json([
        'status' => true,
        'agents' => $agents,
    ]);
}

}
