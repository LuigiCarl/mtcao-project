<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // MySQL specific: modify the enum to include 'island_tour'
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE tourists MODIFY destination ENUM('island_tour', 'juag_lagoon', 'cave_diving', 'beach') AFTER transport_mode");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum without 'island_tour'
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE tourists MODIFY destination ENUM('island_tour', 'juag_lagoon', 'cave_diving', 'beach') AFTER transport_mode");
        }
    }
};
