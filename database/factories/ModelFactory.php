<?php

use Faker\Generator as Faker;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory contains each of the model factory definitions for
| our application. Factories provide a convenient way to generate new
| model instances for testing / seeding the application's database.
|
*/

//https://github.com/fzaninotto/Faker

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'name' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'password' => bcrypt($faker->password),
    ];
});


$factory->define(App\Company::class, function (Faker $faker) {
    return [
        'name' => $faker->company,
        'email' => $faker->unique()->safeEmail,
        'logo' => $faker->imageUrl(100, 100, 'cats'),
        'website' => $faker->url,
    ];
});


$factory->define(App\Employee::class, function (Faker $faker) {
    return [
        'name' => $faker->firstName,
        'lastName' => $faker->lastName,
        'email' => $faker->unique()->safeEmail,
        'phone' => $faker->e164PhoneNumber,
        'company_id' => 1+$faker->randomDigit,
    ];
});

