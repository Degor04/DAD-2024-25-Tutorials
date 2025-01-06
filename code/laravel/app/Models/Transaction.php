<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public $timestamps = false;
    use HasFactory;
    protected $fillable = ['transaction_datetime',
    'user_id',
    'game_id',
    'type',
    'euros',
    'brain_coins',
    'payment_type',
    'payment_reference'];

    public function games():HasOne
    {
        return $this->hasOne(Game::class, 'game_id', 'id')->withTrashed();
    }

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->withTrashed();
    }
}
