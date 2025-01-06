<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class Board extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'board_cols' => 'required|integer|min:3', // supondo que o user n pode escolher o tamanho
            'board_rows' => 'required|integer|min:4'
        ];
    }
}
