<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Company extends Model
{
    use HasFactory;
    protected $fillable=['name'];
    public function routers()
{
    return $this->hasMany(Router::class);
}


public function towers() {
    return $this->hasMany(Tours::class);
}

public function cities()
{
    return $this->belongsToMany(City::class);
}
protected static function booted()
{
    static::creating(function ($company) {
        $company->api_key = Str::uuid(); // أو use bin2hex(random_bytes(32))
    });
}
}
