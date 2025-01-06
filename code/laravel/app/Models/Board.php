<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Mockery\Matcher\HasValue;

class Board extends Model{
    use HasFactory;
    protected $fillable = [
        'board_cols',
        'board_rows',
    ];

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }
}
