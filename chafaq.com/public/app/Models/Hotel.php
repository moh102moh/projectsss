<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class Hotel extends Model
{
    use HasFactory;
    protected $fillable=["name","latitude","longitude","services","gallery","description","media_type","media_path","phone","stars",'country_id','city_id'];
   protected $casts = [
    'services' => 'array',
    'gallery' => 'array',
];

 protected $appends = ['media_url', 'gallery_urls'];

    public function getMediaUrlAttribute()
    {
        return $this->media_path 
            ? Storage::url($this->media_path) 
            : null;
    }

    public function getGalleryUrlsAttribute()
    {
        return collect($this->gallery)->map(function ($item) {
            return [
                'gallery_item' => Storage::url($item['gallery_item']),
            ];
        });
    }
    public function rooms(){

         return $this->hasMany(Room::class);
    }
}
