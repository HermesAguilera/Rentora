<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spaces', function (Blueprint $table) {
            $table->comment('Stores storage listings created by hosts');
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('host_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 100);
            $table->text('description');
            $table->string('type');
            $table->string('status')->default('draft');
            $table->decimal('price_per_month', 10, 2);
            $table->tinyInteger('minimum_months')->default(1);
            $table->tinyInteger('max_months')->nullable();
            $table->decimal('width_meters', 5, 2)->nullable();
            $table->decimal('height_meters', 5, 2)->nullable();
            $table->decimal('depth_meters', 5, 2)->nullable();
            $table->tinyInteger('floor_number')->nullable();
            $table->string('address_line');
            $table->string('neighborhood');
            $table->string('city')->default('Tegucigalpa');
            $table->string('department')->default('Francisco Morazán');
            $table->string('country')->default('HN');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->json('amenities');
            $table->text('rules')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('city');
            $table->index(['latitude', 'longitude']);
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
