<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;

class TransactionsController extends Controller
{

    public function index() 
    {
        
        $transactions = Transaction::with('user')->get();;
     
        return TransactionResource::collection($transactions);
    }


    public function store(TransactionRequest $request){

        $euros = $request->euros ? number_format((float)$request->euros, 2, '.', '') : null;

        $transaction = new Transaction();
        $transaction->euros = $euros;
        $transaction->fill($request->validated());
        $transaction->user_id = $request->user_id;
    $transaction->game_id = $request->game_id;
        $transaction->save();
        return new TransactionResource($transaction);

    }


}
