<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class City extends Model
{
    use HasFactory;
    protected $fillable = ['name','country_id'];

    public function areas(): HasMany
    {
        return $this->hasMany(Area::class);
    }

   
    public function tours():HasMany
    {

        return $this->hasMany(tours::class);
    }
    public function agents():HasMany
    {
        return $this->hasMany(agents::class);


    }
    public function companies()
{
    return $this->belongsToMany(Company::class);
}
public function country()
{
    return $this->belongsTo(Country::class);
}
}
