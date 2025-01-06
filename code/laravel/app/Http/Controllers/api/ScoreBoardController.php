<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ScoreBordResource;
use App\Models\Game;

class ScoreBoardController extends Controller
{

    public function index() 
    {
        
        $games = Game::with('createdUser')->get();
        //$games = Game::all();

     
        return ScoreBordResource::collection($games);
    }

    public function show(Game $games)
    {
        return new ScoreBordResource($games);
    }

}
