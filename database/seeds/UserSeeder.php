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
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('contraseña')
        ]);
        // Create another five user accounts.
        factory(User::class, 5)->create();
        //factory(App\User::class, 5)->make());
        
        $this->command->info('Users table seeded.');
    }
}
