<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Mockery\Matcher\HasValue;

class Multiplayer extends Model{
    use HasFactory;

    protected $table = 'multiplayer_games_played';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'game_id',
        'player_won',
        'pairs_discovered',
    ];

    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function game():BelongsTo
    {
        return $this->belongsTo(Game::class, 'game_id', 'id');
    }
}
