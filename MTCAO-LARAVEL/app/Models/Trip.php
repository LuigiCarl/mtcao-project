<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Trip extends Model
{
    protected $fillable = [
        'boat_id',
        'trip_date',
        'departure_time',
        'arrival_time',
        'destination',
        'passengers_count',
        'trip_type',
        'status',
        'revenue',
        'remarks',
    ];

    protected $casts = [
        'trip_date' => 'date',
        'passengers_count' => 'integer',
        'revenue' => 'decimal:2',
    ];

    public function boat(): BelongsTo
    {
        return $this->belongsTo(Boat::class);
    }
}
