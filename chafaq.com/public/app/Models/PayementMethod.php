<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayementMethod extends Model
{
    use HasFactory;
    protected $fillable=['name','body','media_type','media_path'];
}
