<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class agents extends Model
{
    use HasFactory;
    protected $fillable=['name','phone','city_id','area_id','street_id','details'];

    public function city(){

        return $this->belongsTo(City::class);
    }

    public function area(){

        return $this->belongsTo(Area::class);
    }
}
