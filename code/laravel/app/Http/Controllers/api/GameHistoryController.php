<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\GameHistoryResource;
use App\Models\Game;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use Illuminate\Validation\ValidationException;

class GameHistoryController extends Controller
{

    public function index() 
    {
        
        $games = Game::with('board')->get();
        //$games = Game::all();

     
        return GameHistoryResource::collection($games);
    }

    public function show(Game $games)
    {
        return new GameHistoryResource($games);
    }

    public function store(StoreGameRequest $request)
    {   $game = new Game();
        $game->fill($request->validated());
        $game->created_user_id = $request->user() ? $request->user()->id : null;
        $game->save();
        return new GameHistoryResource($game);
    }

    public function updateStatus(UpdateGameRequest $request, Game $game){
        $data = $request->validated();
        $newStatus = $data["status"];
        
        //Only pending or playing games statuses can be changed
        if($game->status == 'I' || $game->status == 'E'){
            throw ValidationException::withMessages([
                "status" =>
                    "Cannot change game #" .
                    $game->id .
                    " status from '" .
                    $game->status .
                    "' to '$newStatus'!",
            ]);
        }

        if($newStatus == 'E'){
            $game->winner_user_id = $data->winner_user_id ?? null;
            $game->ended_at = $data["ended_at"];
            $game->total_time = $data["total_time"];
        }
        else if($newStatus == 'PL'){
            $game->began_at = $data["began_at"];
        }

        $game->status = $data['status'];

        $game->save();
        return new GameHistoryResource($game);

    }

}
