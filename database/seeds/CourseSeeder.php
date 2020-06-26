<?php
use Illuminate\Database\Seeder;
use App\Course;

class CourseSeeder extends Seeder
{
    /**
     * Generate Users.
     *
     * @return void
     */
    public function run()
    {
        // Create primary user account for testing.
        Course::create([
            'name' => 'CURSO ESPECÍFICO EN TRÁNSITO Y SEGURIDAD VIAL PARA PERSONAL TÉCNICO Y/O AUXILIAR ACOMPAÑANTE DE CARGA EXTRADIMENSIONADA',
            'description' => 'De acuerdo a las Resoluciones 4959/06 y 1724/07 de Mintransporte.',
        ]);
        
        $this->command->info('Course table seeded.');
    }
}
