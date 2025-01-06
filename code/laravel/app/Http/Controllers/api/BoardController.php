<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\BoardResource;
use App\Models\Board;

class BoardHistoryController extends Controller
{

   public function index() 
    {
     
        $boards = Board::all();

        return BoardResource::collection($boards);
    }

    public function show(Board $boards)
    {
        return new BoardResource($boards);
    }
}
