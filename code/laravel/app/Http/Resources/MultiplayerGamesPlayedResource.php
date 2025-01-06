<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MultiplayerGamesPlayedResource extends JsonResource
{
    /**
     * Transform the resource into an array. 
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'player1_id' => $this->user_id,
            'player2_id' => $this->game->created_user_id,
            'board_id' => $this->game->board_id,
            'player1_name' => $this->user->name,
            'player2_name' => $this->game->createdUser->name,
            'id' => $this->id,
            'game_id' => $this->game->id,
            ];
    }
}
