<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class Cert extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */    
    protected $fillable = ['number','course','startDate', 'endDate', 'city', 'user_id', 'status'];
    
    
    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'user_id' => 'integer',
    ];

    /**
     * A Todo belongs to a User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
