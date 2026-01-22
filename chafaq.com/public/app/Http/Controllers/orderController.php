<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PackageBundle;
use App\Models\Order;

class orderController extends Controller
{
    
      public function order(Request $request){

      $user=  $request->user();
    
      $bundle = $request->get('bundle_id');
      $city = $request->get('city_id');
      $area = $request->get('area_id');
      $street = $request->get('street_id');
      $package= PackageBundle::find($bundle);
     // $limit_bytes=$request->get('limit_bytes');
    //  $profile_name=$request->get('profile_name');
      $address= $city.'_'. $area.'_'.$street;
      $equipments=$request->get('equipments');
      
   
if( $package){
 Order::create([
      'customer_id'=>$user->id,
      'bundle_id'=>$bundle,
      'address'=>$address,
    // 'limit_bytes'=>$limit_bytes,
    // 'profile_name'=>$profile_name ,
     'equipments'=>$equipments,

    
      'status'=>'pending'


   ]);

}
  /*
  $profile=PackageBundle::findOrFail($bundle)->mikrotikProfile;





$router = Router::findOrFail($routerId);

$username = 'user123';
$password = 'pass123';
$profile = '2M';

RouterCommand::create([
    'router_id' => $router->id,
    'title' => 'Add PPP User',
    'script' => <<<SCRIPT
/ppp secret add name=$username password=$password profile=$profile
SCRIPT,
]);


*/





    }

    public function userorders(){

        
    }
}
