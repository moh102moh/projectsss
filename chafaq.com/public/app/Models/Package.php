<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Package extends Model
{
    use HasFactory;
     protected $fillable = ['name','company_id','type','router'];

    public function bundles():HasMany
    {

        return $this->hasMany(PackageBundle::class);
    }

    public function routers()
{
    return $this->belongsToMany(Router::class);
}
}
