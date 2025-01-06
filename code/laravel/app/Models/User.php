<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name',
    'email',
    'password',
    'type',
    'nickname',
    'blocked',
    'photo_filename',
    'brain_coins_balance'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getTypeDescriptionAttribute()
    {
        return match ($this->type) {
            'A'       => "Administrator",
            'P'       => "Player",
            default => '?'
        };
    }
    /*public function player(): HasOne
    {
        // Se a chave puder ser apagada temos que conseguir ver o cliente à mesma
        return $this->hasOne(User::class, 'id', 'id')->withTrashed();
    }*/

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    public function multiplayer_games_played():HasMany
    {
        return $this->hasMany(Multiplayer::class, 'id', 'user_id')->withTrashed();
    }

    public function getPhotoFullUrlAttribute()
    {

        if ($this->photo_filename && Storage::exists("public/photos/{$this->photo_filename}")) {
            return asset("storage/photos/{$this->photo_filename}");
        } else {
            return asset("img/anonymous.png");
        }
    }
}
