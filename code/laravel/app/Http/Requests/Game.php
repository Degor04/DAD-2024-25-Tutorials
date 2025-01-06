<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Game extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'created_user_id' => 'required|exists:users,id',
            'winner_user_id' => 'exists:users,id',
            'type' => 'required|in:S,M',
            'status' => 'required|in:PE,PL,E,I',
            'began_at' => 'date_format:Y-m-d H:i:s',
            'ended_at' => 'date_format:Y-m-d H:i:s',
            'total_time' => 'regex:/^\d{1,6}(\.\d{1,2})?$/',
            'board_id' => 'required|exists:boards_id'
            ];
    }
}
