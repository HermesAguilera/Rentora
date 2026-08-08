<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rentora no procesa pagos en línea: el cobro se acuerda entre las partes.
     * Esta marca es el anfitrión confirmando que ya recibió el dinero.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('payment_confirmed_at')->nullable()->after('confirmed_at');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('payment_confirmed_at');
        });
    }
};
