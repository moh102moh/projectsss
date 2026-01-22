<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPackageBundle extends Model
{
    use HasFactory;
  protected $fillable=['customer_id','bundle_id','ip','tour_id','device_id'];

public function bundle()
{
    return $this->belongsTo(PackageBundle::class, 'bundle_id');
}
public function customer() {
  return $this->belongsTo(Customer::class, 'customer_id');
}

}
