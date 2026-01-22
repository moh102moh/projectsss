<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;
      protected $fillable=["customer_id","hotel_id","room_id","is_active","start_at","expires_at"];

     public function hotel()
     {

        return $this->belongsTo(Hotel::class);
     }

      public function room()
     {

        return $this->belongsTo(Room::class);
     }
    }
