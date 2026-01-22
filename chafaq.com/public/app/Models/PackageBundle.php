<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class PackageBundle extends Model
{
    use HasFactory;
// protected $fillable=['name','description','price','duration_days','expires_at','package_id','mikrotik_profile_id','mikrotik_user_group_id','mikrotik_service_id'];
protected $fillable=['name','description','package_id','speeds'];
 protected $casts = [
    'speeds' => 'array',
];

     public function package():BelongsTo
    {

        return $this->belongsTo(Package::class);
    }
   /* public function mikrotikProfile():belongsTo
    {

        return $this->belongsTo(MikrotikProfile::class);
    }
   public function mikrotikService()
{
    return $this->belongsTo(MikrotikService::class, 'mikrotik_service_id');
}
*/

protected static function booted()
{
    static::creating(function ($package_bundle) {
       
        $routers = $package_bundle->package->routers;
        foreach($routers as $router){
            
     $des_router = Router::findOrfail($router->id);

     if($des_router){
 $speeds = $package_bundle->speeds;
        foreach($speeds as $speed){

           $profile_name=$package_bundle->name."".$speed['speed'];
          $rate_limit=$speed['speed']."M";
  $is_exists = RouterCommand::where('router_id', $des_router->id)
    ->where('title', 'Add New Package Profile' . $profile_name)
    ->exists();
    if(!$is_exists){
              RouterCommand::create([
    'router_id' => $des_router->id,
    'title' => 'Add New Package Profile'.$profile_name,
    'script' => <<<SCRIPT
/ppp profile add name=$profile_name rate-limit=$rate_limit 
SCRIPT,
]);  
    }
       

        }
            
  

     }
      


        }

       



    });
}
}
