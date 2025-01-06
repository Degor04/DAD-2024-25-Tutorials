<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'winner_user_id'  => 'nullable|integer|exists:users,id',
            'type'            => 'required|in:S,M',
            'status'          => 'required|in:PE,PL,E,I',
            'began_at'        => 'nullable|date',
            'ended_at'        => 'nullable|date|after_or_equal:began_at',
            'total_time'      => 'nullable|numeric|between:0,999999.99',
            'board_id'        => 'required|integer|exists:boards,id',
            'custom'          => 'nullable|json',
        ];
    }
}
