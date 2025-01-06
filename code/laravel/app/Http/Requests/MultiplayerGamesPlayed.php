<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MultiplayerGamesPlayed extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'game_id' => 'required|exists:games,id',
            'player_won' => 'integer|min:0|max:1',
            'pairs_discovered' => 'integer'
        ];
    }
}
