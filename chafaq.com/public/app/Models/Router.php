<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Router extends Model
{
    use HasFactory;
    protected $fillable=['company_id','serial_number','mac_address','ip','version','company_id','stats'];
     protected $casts = [
    'stats' => 'array',
];
    public function company()
{
    return $this->belongsTo(Company::class);
}

public function commands():HasMany
{
    return $this->hasMany(RouterCommand::class);
}

public function tours()
{
    return $this->hasMany(Tours::class);
}
public function mikrotikProfiles()
{
    return $this->belongsToMany(MikrotikProfile::class);
}

public function packages()
{
    return $this->belongsToMany(Package::class);
}

public function services()
{
    return $this->belongsToMany(MikrotikService::class);
}
public function groups(){
return $this->belongsToMany(MikrotikUserGroup::class);

}

}
