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
        $this->call(CourseSeeder::class);

        // Create Todo data.
        //$this->call(TodoSeeder::class);
    }
}
