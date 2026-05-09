<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'description',
        'is_completed',
        'task_id'
    ];

    public function task(){
        return $this->belongsTo(Task::class);
    }
}
