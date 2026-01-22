<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\Customer;
use App\Models\PackageBundle;
use App\Models\UserPackageBundle;
use App\Models\Tours;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\IpUtils;
use App\Events\AgentCommandDispatched;
class PackageController extends Controller
{
    
    public function index(Request $request)
    {
        return Package::With('bundles')->get();


    }

    public function packageBundles(Request $request, $id){
    

          return Package::Where('id',$id)->With('bundles')->get()->first();
    }
    
     public function packageBundle(Request $request, $id){

          return PackageBundle::Where('id',$id)->get();
    }

      

    public function subscribe(Request $request){

      $user=  $request->user();
    
      $bundle = $request->get('bundle_id');
      $city = $request->get('city_id');
      $area = $request->get('area_id');
      $street = $request->get('street_id');
      $package= PackageBundle::find($bundle);
      $limit_bytes=$request->get('limit_bytes');
      $expires_at=$request->get('expires_at');
     $tour=Tours::where([
    ['city_id', '=', $city],
    ['area_id', '=', $area],
  //  ['street_id', '=', $street],
   ])->get()->first();
      
   $ip=$this->getAvailableIPForTour($tour->id);
   if (!$ip) {
    return response()->json(['error' => 'No available IP in this range'], 422);
}
if($tour &&  $package){
 UserPackageBundle::create([
      'customer_id'=>$user->id,
      'bundle_id'=>$bundle,
      'tour_id'=>$tour->id,
     'limit_bytes'=>$limit_bytes,
     'expires_at'=>$expires_at ,

      'ip'=>$ip,
      'status'=>'notstarted'


   ]);

}
  
  $profile=PackageBundle::findOrFail($bundle)->mikrotikProfile;

/*
    event(new AgentCommandDispatched([
        'command' => 'create_secret',
        'params' => [
            'username' => $user->id.'_'.$user->phone.'_'.$city.'_'.$area,
            'password' => $user->phone,
            'profile'=>$profile->name

        ],
    ]));*/
/*
     event(new AgentCommandDispatched([
        'command' => 'create_user',
        'params' => [
            'username' => $user->id.'_'.$user->phone.'_'.$city.'_'.$area,
            'password' => $user->phone,
        ],
    ]));*/



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








    }

    public function user_mobile_packages(Request $request){
       $user=  $request->user();
     
        $results = UserPackageBundle::where('customer_id',$user->id)->whereHas('bundle.mikrotikService', function ($query) {
    $query->where('type', 'hotspot');
           })->get();
           return $results;
    }

      public function user_router_packages(Request $request){
     $user=  $request->user();
     
        $results = UserPackageBundle::with('bundle')->where('status','active')->where('customer_id',$user->id)->whereHas('bundle.mikrotikService', function ($query) {
    $query->where('type', 'pppoe');
           })->get();
           return $results;
    }

  public function user_router_packages_payement(Request $request){
     $phone = $request->get('phone');

     $results = UserPackageBundle::whereHas('customer', function ($query) use ($phone) {
    $query->where('phone', $phone); // replace with the desired phone number
})->whereHas('bundle.mikrotikService', function ($query) {
    $query->where('type', 'pppoe');
           })->with('bundle')->where('status','active')->get();

return $results;
       
    }
 public function mobile_packages(Request $request){

 $results = Package::whereHas('bundles.mikrotikService', function ($query) {
    $query->where('type', 'hotspot');
           })->get();
           return $results;
    }
/*public function router_packages(Request $request){

 $results = Package::whereHas('bundles.mikrotikService', function ($query) {
    $query->where('type', 'pppoe');
           })->get();
           return $results;
    }*/

public function router_packages(Request $request){

 $results = Package::where('type','router')->get();
           return $results;
    }


    public function phone_router_packages(Request $request){

         $validator = Validator::make($request->all(), [
            'phone'    => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }


         $customer = Customer::where('phone', $request->phone)->first();
        
        if (!$customer) {
            return response()->json([
                'status'  => false,
                'message' => 'Invalid phone',
            ], 401);
        }


   
     
        $results = UserPackageBundle::where('customer_id',$customer->id)->whereHas('bundle.mikrotikService', function ($query) {
    $query->where('type', 'pppoe');
           })->get();
           return $results;

    }
/*
    public function getAvailableIPForTour($tourId)
{
    $tour = Tours::findOrFail($tourId);

    // Convert IPs to long integers
    $start = ip2long($tour->start_ip);
    $end   = ip2long($tour->end_ip);

    // Get all used IPs in this range
    $usedIps = UserPackageBundle::whereNotNull('ip')
        ->pluck('ip')
        ->map(function ($ip) {
            return ip2long($ip);
        })->toArray();

    for ($ip = $start; $ip <= $end; $ip++) {
        if (!in_array($ip, $usedIps)) {
            return long2ip($ip); // ✅ Found available IP
        }
    }

    return null; // ❌ No available IPs
}*/
public function getAvailableIPForTour($tourId) 
{
    $tour = Tours::findOrFail($tourId);

    // Make sure ip_ranges exists and is an array
    $ipRanges = is_array($tour->ip_ranges) ? $tour->ip_ranges : json_decode($tour->ip_ranges, true);

    // Get all used IPs (convert to long for easier comparison)
    $usedIps = UserPackageBundle::whereNotNull('ip')
        ->pluck('ip')
        ->map(fn($ip) => ip2long($ip))
        ->toArray();

    foreach ($ipRanges as $range) {
        $start = ip2long($range['start_ip']);
        $end   = ip2long($range['end_ip']);

        for ($ip = $start; $ip <= $end; $ip++) {
            if (!in_array($ip, $usedIps)) {
                return long2ip($ip); // ✅ Return first available IP
            }
        }
    }

    return null; // ❌ No available IPs in any range
}






/** radius */

 public function radius_user_router_packages(Request $request){
     $user=  $request->user();
     
        $results = UserPackageBundle::with('bundle')->where('status','active')->where('customer_id',$user->id)->whereHas('bundle.mikrotikService', function ($query) {
    $query->where('type', 'pppoe');
           })->get();
           return $results;
    }

}
