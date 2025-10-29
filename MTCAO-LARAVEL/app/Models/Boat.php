<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Boat extends Model
{
    protected $fillable = [
        'boat_name',
        'registration_number',
        'boat_type',
        'capacity',
        'operator_name',
        'operator_contact',
        'captain_name',
        'captain_license',
        'home_port',
        'engine_type',
        'engine_horsepower',
        'year_built',
        'status',
        'current_cycle',
        'cycle_position',
        'has_trip_in_cycle',
        'last_trip_date',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'year_built' => 'integer',
        'current_cycle' => 'integer',
        'cycle_position' => 'integer',
        'has_trip_in_cycle' => 'boolean',
        'last_trip_date' => 'datetime',
    ];

    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }
}
