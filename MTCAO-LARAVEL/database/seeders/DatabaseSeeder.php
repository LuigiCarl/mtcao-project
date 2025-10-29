<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Boat;
use App\Models\Tourist;
use App\Models\Trip;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create sample boats
        $boats = [
            [
                'boat_name' => 'Ocean Explorer',
                'registration_number' => 'PH-123456',
                'boat_type' => 'ferry',
                'capacity' => 50,
                'operator_name' => 'Island Tours Inc.',
                'operator_contact' => '09123456789',
                'captain_name' => 'Juan Dela Cruz',
                'captain_license' => 'CPT-001234',
                'home_port' => 'Port of Manila',
                'engine_type' => 'Diesel',
                'engine_horsepower' => '250 HP',
                'year_built' => 2020,
                'status' => 'active',
            ],
            [
                'boat_name' => 'Island Hopper',
                'registration_number' => 'PH-789012',
                'boat_type' => 'speedboat',
                'capacity' => 12,
                'operator_name' => 'Fast Travel Co.',
                'operator_contact' => '09234567890',
                'captain_name' => 'Maria Santos',
                'captain_license' => 'CPT-005678',
                'home_port' => 'Cebu Port',
                'engine_type' => 'Gasoline',
                'engine_horsepower' => '150 HP',
                'year_built' => 2021,
                'status' => 'active',
            ],
            [
                'boat_name' => 'Sunset Cruiser',
                'registration_number' => 'PH-345678',
                'boat_type' => 'yacht',
                'capacity' => 25,
                'operator_name' => 'Luxury Cruises Ltd.',
                'operator_contact' => '09345678901',
                'captain_name' => 'Pedro Garcia',
                'captain_license' => 'CPT-009012',
                'home_port' => 'Boracay Marina',
                'engine_type' => 'Diesel',
                'engine_horsepower' => '300 HP',
                'year_built' => 2019,
                'status' => 'active',
            ],
        ];

        foreach ($boats as $boatData) {
            Boat::create($boatData);
        }

        // Create sample tourists
        $nationalities = ['Philippines', 'Korea', 'USA', 'Japan', 'China'];
        $purposes = ['leisure', 'business', 'education', 'official', 'others'];
        $accommodations = ['day_tour', 'overnight', 'staycation'];

        for ($i = 0; $i < 100; $i++) {
            $nationality = $nationalities[array_rand($nationalities)];
            Tourist::create([
                'first_name' => 'Tourist' . $i,
                'last_name' => 'Name' . $i,
                'nationality' => $nationality,
                'type' => $nationality === 'Philippines' ? 'domestic' : 'foreign',
                'purpose' => $purposes[array_rand($purposes)],
                'accommodation_type' => $accommodations[array_rand($accommodations)],
                'arrival_date' => now()->subDays(rand(1, 180)),
                'departure_date' => now()->subDays(rand(0, 90)),
                'duration_days' => rand(1, 7),
                'contact_number' => '09' . rand(100000000, 999999999),
                'email' => 'tourist' . $i . '@example.com',
            ]);
        }

        // Create sample trips
        $boatIds = Boat::pluck('id')->toArray();
        $destinations = ['Juag Lagoon', 'Cave', 'Beach', 'Island Tour', 'Diving Spot'];

        for ($i = 0; $i < 50; $i++) {
            Trip::create([
                'boat_id' => $boatIds[array_rand($boatIds)],
                'trip_date' => now()->subDays(rand(1, 180)),
                'departure_time' => sprintf('%02d:00:00', rand(6, 18)),
                'arrival_time' => sprintf('%02d:00:00', rand(10, 20)),
                'destination' => $destinations[array_rand($destinations)],
                'passengers_count' => rand(5, 40),
                'trip_type' => ['tour', 'transfer', 'charter'][array_rand(['tour', 'transfer', 'charter'])],
                'status' => 'completed',
                'revenue' => rand(5000, 25000),
            ]);
        }

        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}

