<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tourist extends Model
{
    protected $fillable = [
        'trip_id',
        'first_name',
        'last_name',
        'full_name',
        'age',
        'gender',
        'nationality',
        'origin_city',
        'type',
        'purpose',
        'transport_mode',
        'destination',
        'accommodation_type',
        'arrival_date',
        'departure_date',
        'duration_days',
        'contact_number',
        'email',
        'remarks',
    ];

    protected $casts = [
        'arrival_date' => 'date',
        'departure_date' => 'date',
        'duration_days' => 'integer',
        'age' => 'integer',
    ];

    protected $appends = ['full_name_computed'];

    public function getFullNameComputedAttribute(): string
    {
        return $this->full_name ?? "{$this->first_name} {$this->last_name}";
    }

    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
