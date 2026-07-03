<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index()
    {
        $alerts = Alert::where('resolved', false)
            ->with('room')
            ->orderBy('triggered_at', 'desc')
            ->get();

        return response()->json([
            'alerts' => $alerts
        ]);
    }
}
