<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.($this->user?$this->user->id:null), // verifica se user existe, id se T null se F
            'password'  => 'required|string|min:3|max:255|confirmed',
            'type' => ['required', Rule::in(['A', 'P'])],
            'nickname' => 'required|string|max:20|unique:users,nickname',
            'blocked' => 'required|boolean' ,
            'photo_filename' => 'sometimes|image|max:4096', // maxsize = 4Mb
            'brain_coins_balance' => 'required|int|min:0'
        ];
    }
}
