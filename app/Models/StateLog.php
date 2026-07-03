<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StateLog extends Model
{
    protected $fillable = ['device_id', 'old_status', 'new_status', 'changed_at'];

    protected $casts = [
        'old_status' => 'boolean',
        'new_status' => 'boolean',
        'changed_at' => 'datetime',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
