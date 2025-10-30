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
        // Add missing fields to tourists table
        Schema::table('tourists', function (Blueprint $table) {
            if (!Schema::hasColumn('tourists', 'trip_id')) {
                $table->foreignId('trip_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            }
            if (!Schema::hasColumn('tourists', 'full_name')) {
                $table->string('full_name')->nullable()->after('last_name');
            }
            if (!Schema::hasColumn('tourists', 'age')) {
                $table->integer('age')->nullable()->after('full_name');
            }
            if (!Schema::hasColumn('tourists', 'gender')) {
                $table->enum('gender', ['male', 'female'])->nullable()->after('age');
            }
            if (!Schema::hasColumn('tourists', 'origin_city')) {
                $table->string('origin_city')->nullable()->after('nationality');
            }
            if (!Schema::hasColumn('tourists', 'transport_mode')) {
                $table->enum('transport_mode', ['land', 'air', 'sea'])->nullable()->after('purpose');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tourists', function (Blueprint $table) {
            $columns = ['trip_id', 'full_name', 'age', 'gender', 'origin_city', 'transport_mode'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('tourists', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
