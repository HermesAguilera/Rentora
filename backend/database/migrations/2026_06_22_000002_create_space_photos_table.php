<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('space_photos', function (Blueprint $table) {
            $table->comment('Stores photo S3 keys for spaces');
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('space_id')->constrained('spaces')->cascadeOnDelete();
            $table->string('path');
            $table->tinyInteger('order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('space_photos');
    }
};
