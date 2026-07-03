<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Device;
use App\Models\StateLog;
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

            $lastTick = clone $now;
            sleep(10);
        }
    }
}
