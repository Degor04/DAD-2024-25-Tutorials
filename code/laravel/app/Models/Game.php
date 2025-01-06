<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{

    use HasFactory;
    protected $fillable = ['created_user_id',
    'winner_user_id',
    'game_id',
    'type',
    'status',
    'began_at', // not sure se este devia estar
    'ended_at', // not sure se este devia estar
    'total_time', // not sure se este devia estar
    'board_id'];

    public function transactions():HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function board():BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

        public function createdUser():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_user_id', 'id')->withTrashed();
    }


        public function user_winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_user_id', 'id')->withTrashed();
    }


        public function multiplayer_games_played(): HasMany
    {
        return $this->hasMany(Multiplayer::class, 'game_id', 'id')->withTrashed();
    }

}
