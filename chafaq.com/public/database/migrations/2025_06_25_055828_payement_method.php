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
        Schema::create('payement_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('body')->nullable();       // Text or description
            $table->enum('media_type',['image','video'])->nullable();           // 'image' or 'video'
           $table->string('media_path')->nullable();   
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payement_methods');
    }
};
