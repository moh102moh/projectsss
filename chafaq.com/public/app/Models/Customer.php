<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

use Laravel\Sanctum\HasApiTokens;
class Customer extends Authenticatable
{
        use HasApiTokens, HasFactory;
    protected $fillable=['name','phone','email','password','country'];
 protected $hidden = [
        'password', 'remember_token',
    ];
    public function packages():HasMany
    {

    return $this->hasMany(user_package_bundle::class);
    }
    public function getPhoneNumber(): string
    {
        return $this->phone;
    }
}
