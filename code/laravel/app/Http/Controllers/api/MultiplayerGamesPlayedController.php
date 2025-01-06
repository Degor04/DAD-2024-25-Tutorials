<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Multiplayer;
use App\Http\Resources\MultiplayerGamesPlayedResource;
use App\Http\Requests\MultiplayerGamesPlayed;
use App\Http\Requests\UpdateMultiplayerGamesPlayedRequest;
use Illuminate\Support\Facades\Log;

class MultiplayerGamesPlayedController extends Controller
{
    public function store(MultiplayerGamesPlayed $request)
    {
        $multiplayer_game = new Multiplayer();
        $multiplayer_game->user_id = $request->validated()["user_id"];
        $multiplayer_game->game_id = $request->validated()["game_id"];
        
        $multiplayer_game->save();

        return new MultiplayerGamesPlayedResource($multiplayer_game);
    }

    public function updateStatus(UpdateMultiplayerGamesPlayedRequest $request, Multiplayer $multiplayer){
        $data = $request->validated();

        Log::debug('Multiplayer data:', $multiplayer->toArray());

        $multiplayer->player_won = $data["player_won"];
        $multiplayer->pairs_discovered = $data["pairs_discovered"];

        $multiplayer->save();

        return new MultiplayerGamesPlayedResource($multiplayer);

    }
    
    
}
