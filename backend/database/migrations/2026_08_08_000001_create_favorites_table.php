<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->comment('Espacios guardados como favoritos por un usuario');
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('space_id')->constrained('spaces')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'space_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
