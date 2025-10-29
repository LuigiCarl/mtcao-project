<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('boats', function (Blueprint $table) {
            $table->id();
            $table->string('boat_name');
            $table->string('registration_number')->unique();
            $table->enum('boat_type', ['ferry', 'speedboat', 'yacht', 'bangka', 'other']);
            $table->integer('capacity');
            $table->string('operator_name');
            $table->string('operator_contact');
            $table->string('captain_name');
            $table->string('captain_license');
            $table->string('home_port');
            $table->string('engine_type');
            $table->string('engine_horsepower');
            $table->year('year_built');
            $table->enum('status', ['active', 'maintenance', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('boats');
    }
};
