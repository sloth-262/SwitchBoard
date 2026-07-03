<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;

class UsageController extends Controller
{
    public function index()
    {
        $currentWattage = Device::where('status', true)->sum('power_watts');
        $kwhToday = Device::sum('kwh_today');

        return response()->json([
            'current_wattage' => (int) $currentWattage,
            'kwh_today' => (float) $kwhToday
        ]);
    }
}
