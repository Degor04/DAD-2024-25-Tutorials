<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{

    public function authorize(): bool // verifica se o user tem permissao
    {
        return true;
    }

    public function rules(): array
    {
    
        return [ 
            'transaction_datetime' =>'required|date_format:Y-m-d H:i:s',
            'user_id' => 'required|integer|exists:users,id',
            'game_id' => 'nullable|integer|exists:games,id', // (only for type 'I').
            'type' => 'required|in:B,P,I',
            'euros' => 'nullable', //  (only for type 'P')
            'brain_coins' => 'required|integer',
            'payment_type' => 'nullable|in:MBWAY,PAYPAL,IBAN,MB,VISA', //  (only for type 'P')
            'payment_reference' => 'nullable'  // (only for type 'P').
        ];
    }
}
