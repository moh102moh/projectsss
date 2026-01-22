<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MikrotikUserGroup extends Model
{
    use HasFactory;
    protected $fillable=['name','permissions'];
    protected $casts = [
    'permissions' => 'array',
];

public function routers()
{
    return $this->belongsToMany(Router::class);
}

}
