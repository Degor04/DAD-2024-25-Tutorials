<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Http\Requests\UserRequest;
use App\Http\Requests\RegisterRequest;

class UserControllerApi extends Controller
{
    public function showMe(Request $request)
    {
        return new UserResource($request->user());
    }

    public function create()
    {
        return new UserResource();
    }

    public function store(RegisterRequest $request)
    {
        //$type = 'P';
        //$blocked = 0;
        $brain_coins_balance = 10;

        $user = new User();

        $user->fill($request->validated());

        $user->type = $request->input('type', 'P');
        $user->blocked = $request->input('blocked', 0);
        $user->brain_coins_balance = $brain_coins_balance;

        $user->password = bcrypt($request->password);

        $user->save();

        return new UserResource($user);
    }

}
