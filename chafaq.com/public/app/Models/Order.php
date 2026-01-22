<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable=['customer_id','bundle_id','equipments','status','address'];
    protected $casts = [
    'equipments' => 'array',
];
}
