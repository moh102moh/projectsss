<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;
    protected $fillable=["hotel_id","identifier","type","price","capacity","status"];
    public function hotel(){
         return $this->belongsToMany(Hotel::class);
    }
}
