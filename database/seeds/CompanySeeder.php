<?php
use Illuminate\Database\Seeder;
use App\Company;

class CompanySeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        //Generate Companies and employees
        factory(App\Company::class, 10)->create();

        $this->command->info('Company table seeded.');
    }
}
