<?php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Create Users.
        $this->call(UserSeeder::class);
        $this->call(CompanySeeder::class);
        $this->call(EmployeeSeeder::class);
        //$this->call(EmployeeSeeder::class);
    }
}
