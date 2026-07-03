<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Device;
use App\Models\StateLog;
use App\Models\Alert;
use App\Models\Room;
use Carbon\Carbon;

class SimulateDevices extends Command
{
    protected $signature = 'devices:simulate';
    protected $description = 'Simulate device state changes and accumulate kWh usage';

    public function handle()
    {
        $this->info('Starting device simulator. Press Ctrl+C to stop.');

        $lastTick = Carbon::now();

        while (true) {
            $now = Carbon::now();
            $hoursElapsed = $now->diffInSeconds($lastTick) / 3600.0;

            $devices = Device::all();

            foreach ($devices as $device) {
                // Accumulate kWh for devices that are ON
                if ($device->status) {
                    $addedKwh = ($device->power_watts * $hoursElapsed) / 1000.0;
                    $device->kwh_today += $addedKwh;
                }

                // 10% chance to flip state
                if (rand(1, 100) <= 10) {
                    $oldStatus = $device->status;
                    $device->status = !$oldStatus;
                    $device->last_changed = $now;

                    StateLog::create([
                        'device_id' => $device->id,
                        'old_status' => $oldStatus,
                        'new_status' => $device->status,
                        'changed_at' => $now,
                    ]);

                    $this->info("Flipped {$device->name} in Room {$device->room_id} to " . ($device->status ? 'ON' : 'OFF'));
                }

                $device->save();
            }

            $this->checkAlerts($now);

            $lastTick = clone $now;
            sleep(10);
        }
    }

    private function checkAlerts(Carbon $now)
    {
        $officeStart = 9;
        $officeEnd = 17;
        $isAfterHours = $now->hour < $officeStart || $now->hour >= $officeEnd;

        // Check 1: individual devices ON after hours
        if ($isAfterHours) {
            $onDevices = Device::where('status', true)->get();

            foreach ($onDevices as $device) {
                $exists = Alert::where('type', 'after-hours')
                    ->where('room_id', $device->room_id)
                    ->where('message', 'like', "%{$device->name}%")
                    ->where('resolved', false)
                    ->exists();

                if (!$exists) {
                    Alert::create([
                        'type' => 'after-hours',
                        'message' => "{$device->name} is ON after office hours",
                        'room_id' => $device->room_id,
                        'triggered_at' => $now,
                        'resolved' => false,
                    ]);
                    $this->info("Alert created: {$device->name} after-hours");
                }
            }
        }

        // Check 2: entire room ON continuously for 2+ hours
        $rooms = Room::with('devices')->get();

        foreach ($rooms as $room) {
            $allOn = $room->devices->every(fn ($d) => $d->status);

            if ($allOn && $room->devices->isNotEmpty()) {
                $oldestChange = $room->devices->min('last_changed');

                if ($oldestChange && Carbon::parse($oldestChange)->diffInHours($now) >= 2) {
                    $exists = Alert::where('type', 'continuous')
                        ->where('room_id', $room->id)
                        ->where('resolved', false)
                        ->exists();

                    if (!$exists) {
                        Alert::create([
                            'type' => 'continuous',
                            'message' => "{$room->name} has had all devices ON for 2+ hours",
                            'room_id' => $room->id,
                            'triggered_at' => $now,
                            'resolved' => false,
                        ]);
                        $this->info("Alert created: {$room->name} continuous 2hr+");
                    }
                }
            }
        }

        // Auto-resolve after-hours alerts once the device turns off
        $activeAlerts = Alert::where('resolved', false)->where('type', 'after-hours')->get();
        foreach ($activeAlerts as $alert) {
            $stillOn = Device::where('room_id', $alert->room_id)
                ->where('status', true)
                ->whereRaw("? LIKE CONCAT('%', name, '%')", [$alert->message])
                ->exists();
            if (!$stillOn) {
                $alert->update(['resolved' => true]);
            }
        }
    }
}