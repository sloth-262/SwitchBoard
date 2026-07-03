<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show($id)
    {
        $room = Room::with('devices')->findOrFail($id);
        
        return response()->json($room);
    }
}
