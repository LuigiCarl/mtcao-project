<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tourist extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'nationality',
        'type',
        'purpose',
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
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
