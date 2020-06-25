<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certs', function (Blueprint $table) {
            $table->timestamps();
            $table->increments('id');
            $table->integer('user_id');            
            $table->string('name');
            $table->string('document');
            $table->string('number');
            $table->string('course');
            $table->date('startDate');
            $table->date('endDate');
            $table->string('city');
            $table->string('code');
            $table->enum('status', ['open', 'closed'])->default('open');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('certs');
    }
}
