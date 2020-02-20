<?php
namespace App;
use Illuminate\Database\Eloquent\Model;

class Cert extends Model
{
    //
    protected $table = 'cert';
    protected $fillable = ['number','course','startDate', 'endDate', 'city', 'user_id'];
}
