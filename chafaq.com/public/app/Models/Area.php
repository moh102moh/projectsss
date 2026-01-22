<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Area extends Model
{
    use HasFactory;
     protected $fillable = ['name','city_id'];
    public function tours():HasMany
    {

        return $this->hasMany(tours::class);
    }
     public function agents():HasMany
    {
        return $this->hasMany(agents::class);


    }

     public function streets():HasMany
    {
        return $this->hasMany(Street::class);


    }
    public function city():BelongsTo{
        return $this->belongsTo(City::class);
    }
}

