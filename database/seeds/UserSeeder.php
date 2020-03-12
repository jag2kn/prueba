<?php
use Illuminate\Database\Seeder;
use App\User;

class UserSeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        // Create primary user account for testing.
        User::create([
            'name' => 'Jorge González',
            'email' => 'jag2kn@gmail.com',
            'password' => bcrypt('123456789')
        ]);

        // Create another five user accounts.
        factory(User::class, 5)->create();

        $this->command->info('Users table seeded.');
    }
}
