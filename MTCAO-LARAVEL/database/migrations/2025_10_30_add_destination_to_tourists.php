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
        Schema::table('tourists', function (Blueprint $table) {
            if (!Schema::hasColumn('tourists', 'destination')) {
                $table->enum('destination', ['island_tour', 'juag_lagoon', 'cave_diving', 'beach'])
                    ->nullable()
                    ->after('transport_mode');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tourists', function (Blueprint $table) {
            if (Schema::hasColumn('tourists', 'destination')) {
                $table->dropColumn('destination');
            }
        });
    }
};
