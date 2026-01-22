<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MikrotikService extends Model
{
    use HasFactory;
     protected $fillable=['type','interface','default_profile'];

         public function routers()
{
    return $this->belongsToMany(Router::class);
}

}
