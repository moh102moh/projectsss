<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RouterCommand extends Model
{
    use HasFactory;

    protected $fillable = ['router_id', 'title', 'script', 'executed', 'executed_at'];

    public function router()
    {
        return $this->belongsTo(Router::class);
    }
}

