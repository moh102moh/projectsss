<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
class Tours extends Model
{
    use HasFactory;
    protected $fillable = ['name','country_id','city_id','area_id','street_id','router_id','ip_ranges','type','description','latitude','longitude'];
   protected $casts = [
    'ip_ranges' => 'array',
];
    public function city()
    {

        return $this->belongsTo(City::class);
    }
    public function devices():HasMany
    {
        return $this->hasMany(devices::class);
    }
     
    public function company(){
         return $this->belongsTo(Company::class);

    }

    public function router(){

         return $this->belongsTo(Router::class);
    }
protected static function booted()
{
    static::creating(function ($tour) {
        if (!auth()->user()->hasRole('admin')) {
            $tour->company_id = auth()->user()->company_id;
        }
    });
}
}

