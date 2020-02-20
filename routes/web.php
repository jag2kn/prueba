<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});


$router->group(['prefix' => 'api/'], function ($app) {
    $app->get('login/','UserController@authenticate');
    
    $app->post('user/','UserController@store');
    $app->get('user/', 'UserController@index');
    $app->get('user/{id}','UserController@show');
    $app->put('user/{id}/', 'UserController@update');
    $app->delete('user/{id}/', 'UserController@destroy');
    
    $app->post('cert/','CertController@store');
    $app->get('cert/', 'CertController@index');
    $app->get('cert/{id}/', 'CertController@show');
    $app->put('cert/{id}/', 'CertController@update');
    $app->delete('cert/{id}/', 'CertController@destroy');
});




