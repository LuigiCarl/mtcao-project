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
        Schema::table('boats', function (Blueprint $table) {
            $table->integer('current_cycle')->default(0)->after('status');
            $table->integer('cycle_position')->default(0)->after('current_cycle');
            $table->boolean('has_trip_in_cycle')->default(false)->after('cycle_position');
            $table->timestamp('last_trip_date')->nullable()->after('has_trip_in_cycle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boats', function (Blueprint $table) {
            $table->dropColumn(['current_cycle', 'cycle_position', 'has_trip_in_cycle', 'last_trip_date']);
        });
    }
};
