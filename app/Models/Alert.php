<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = ['type', 'message', 'room_id', 'triggered_at', 'resolved'];

    protected $casts = [
        'resolved' => 'boolean',
        'triggered_at' => 'datetime',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
