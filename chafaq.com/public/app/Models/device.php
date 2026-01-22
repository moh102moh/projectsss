<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class device extends Model
{
    use HasFactory;
    protected $fillable = ['device_type_id','ip'];
    public function tour():BelongsTo
    {

        return $this->belongsTo(tour::class);
    }
 
public function deviceType()
{
    return $this->belongsTo(DeviceType::class);
}

}
