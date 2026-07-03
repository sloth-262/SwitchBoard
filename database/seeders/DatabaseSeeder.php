<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $rooms = [
            'Drawing Room',
            'Work Room 1',
            'Work Room 2'
        ];

        foreach ($rooms as $roomName) {
            $room = \App\Models\Room::create(['name' => $roomName]);

            // 2 fans per room
            for ($i = 1; $i <= 2; $i++) {
                \App\Models\Device::create([
                    'room_id' => $room->id,
                    'name' => "Fan {$i}",
                    'type' => 'fan',
                    'status' => false,
                    'power_watts' => 60,
                ]);
            }

            // 3 lights per room
            for ($i = 1; $i <= 3; $i++) {
                \App\Models\Device::create([
                    'room_id' => $room->id,
                    'name' => "Light {$i}",
                    'type' => 'light',
                    'status' => false,
                    'power_watts' => 15,
                ]);
            }
        }
    }
}
