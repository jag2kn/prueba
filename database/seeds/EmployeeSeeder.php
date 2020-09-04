<?php
use Illuminate\Database\Seeder;
use App\Employee;

class EmployeeSeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        //Generate employees
        factory(App\Employee::class, 50)->create();

        $this->command->info('Employee table seeded.');
    }
}
