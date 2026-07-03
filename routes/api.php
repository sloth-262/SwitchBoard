<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\UsageController;
use App\Http\Controllers\Api\AlertController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::prefix('v1')->group(function () {
    Route::get('/status', [StatusController::class, 'index']);
    Route::get('/rooms/{id}', [RoomController::class, 'show']);
    Route::get('/usage', [UsageController::class, 'index']);
    Route::get('/alerts', [AlertController::class, 'index']);
});
