<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tourists', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('nationality');
            $table->enum('type', ['domestic', 'foreign']);
            $table->enum('purpose', ['leisure', 'business', 'education', 'official', 'others']);
            $table->enum('accommodation_type', ['day_tour', 'overnight', 'staycation']);
            $table->date('arrival_date');
            $table->date('departure_date')->nullable();
            $table->integer('duration_days')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tourists');
    }
};
