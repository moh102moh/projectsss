<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string("name");
           // $table->string("location");
            $table->string("description");
              $table->decimal('latitude', 10, 8);   // خط العرض
            $table->decimal('longitude', 11, 8);  // خط الطول
            $table->enum('media_type',['image','video'])->nullable();           // 'image' or 'video'
           $table->string('media_path')->nullable(); 
           $table->json('services')->nullable();
           $table->json('gallery')->nullable();
           $table->tinyInteger('stars')->default(3);
           $table->string('phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
