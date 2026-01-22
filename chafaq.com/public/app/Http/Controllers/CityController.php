<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\City;


class CityController extends Controller
{
    
    public function index(Request $request){


          $cities= City::with('areas.streets')->get();
          return $cities;
    }
}
