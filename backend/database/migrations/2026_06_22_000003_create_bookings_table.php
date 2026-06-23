<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->comment('Stores reservations/bookings of spaces');
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('space_id')->constrained('spaces')->restrictOnDelete();
            $table->foreignId('renter_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('host_id')->constrained('users')->restrictOnDelete();
            $table->string('status')->default('pending');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->tinyInteger('months_duration');
            $table->decimal('price_per_month', 10, 2);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('platform_fee_amount', 10, 2);
            $table->decimal('host_payout_amount', 10, 2);
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('renter_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
