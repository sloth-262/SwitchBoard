<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = ['room_id', 'name', 'type', 'status', 'power_watts', 'kwh_today', 'last_changed'];

    protected $casts = [
        'status' => 'boolean',
        'kwh_today' => 'decimal:4',
        'last_changed' => 'datetime',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function stateLogs()
    {
        return $this->hasMany(StateLog::class);
    }
}
