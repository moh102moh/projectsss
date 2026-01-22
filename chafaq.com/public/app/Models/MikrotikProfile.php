<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Events\AgentCommandDispatched;
class MikrotikProfile extends Model
{
    use HasFactory;
      protected $fillable=['name','rate_limit','address_pool','company_id','shared_users','default'];
      protected $casts = [
        'default' => 'boolean',
        
    ];

    protected static function booted()
{
    static::created(function ($profile) {
    /*    event(new AgentCommandDispatched([
            'command' => 'create_profile',
            'params' => [
                'name' => $profile->name,
                'rate_limit' => $profile->rate_limit.'M/'.$profile->rate_limit.'M',
                'shared_users' => $profile->shared_users,
            
            ],
        ]));*/
/*
         event(new AgentCommandDispatched([
            'command' => 'create_secret_profile',
            'params' => [
                'name' => $profile->name,
                'rate_limit' => $profile->rate_limit.'M/'.$profile->rate_limit.'M',
          
            
            ],
        ]));*/

     /*   event(new AgentCommandDispatched([
    'command' => 'create_profile',
    'params' => [
        'name' => 'BasicUser',
        'rate_limit' => '2M/2M',
        'shared_users' => 1,
        'keepalive_timeout' => '30s',
    ],
]));*/

    });
}

public function routers()
{
    return $this->belongsToMany(Router::class);
}



}
