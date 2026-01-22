<?php

namespace App\Http\Controllers;
use App\Models\PayementMethod;
use Illuminate\Http\Request;

class PayementMethodController extends Controller
{
    
 public function index(){

    $methods = PayementMethod::all();

    return $methods;
 }


}
