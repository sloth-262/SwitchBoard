<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Authenticated account routes.
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::prefix('v1')->group(function () {
    // Public feature routes go here.

    Route::middleware('auth:sanctum')->group(function () {
        // Protected feature routes go here.
    });
});
