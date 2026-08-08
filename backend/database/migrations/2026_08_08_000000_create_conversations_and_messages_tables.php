<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->comment('Conversación 1 a 1 entre un inquilino y un anfitrión sobre un espacio');
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('space_id')->nullable()->constrained('spaces')->nullOnDelete();
            $table->foreignId('renter_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('host_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            // Una sola conversación por par de usuarios y espacio.
            $table->unique(['space_id', 'renter_id', 'host_id']);
            $table->index('last_message_at');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->comment('Mensajes de una conversación');
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
    }
};
