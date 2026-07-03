<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Device;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        $rooms = Room::with('devices')->get();
        
        $totalWattage = Device::where('status', true)->sum('power_watts');
        $totalKwh = Device::sum('kwh_today');

        return response()->json([
            'total_wattage' => (int) $totalWattage,
            'total_kwh_today' => (float) $totalKwh,
            'rooms' => $rooms
        ]);
    }
}
