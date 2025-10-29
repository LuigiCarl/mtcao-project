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
    ];

    protected $casts = [
        'capacity' => 'integer',
        'year_built' => 'integer',
    ];

    public function trips(): HasMany
    {
        return $this->hasMany(Trip::class);
    }
}
