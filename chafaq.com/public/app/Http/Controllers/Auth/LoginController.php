<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
       
        $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        $customer = Customer::where('phone', $request->phone)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid phone or password',
            ]);
        }

        // Create a token using Laravel Sanctum (recommended)
        $token = $customer->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'data' => $customer,
        ]);
    }


    public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'status' => true,
        'message' => 'Logged out successfully',
    ]);
}


public function profile(Request $request)
{
    return response()->json([
        'status' => true,
        'data' => $request->user(),
    ]);
}


}


