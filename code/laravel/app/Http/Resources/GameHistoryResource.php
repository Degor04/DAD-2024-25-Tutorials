<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'created_user_id' => $this->created_user_id,
            'winner_user_id'=> $this->winner_user_id,
            'type' => $this->type,
            'status' => $this->status,
            'began_at' => $this->began_at,
            'ended_at' => $this->ended_at,
            'total_time' => $this->total_time,
            'board_size' => $this->board ? "{$this->board->board_cols} x {$this->board->board_rows}" : 'Error',
            'total_turns_winner' => $this->total_turns_winner,
            //'board_id' => $this->board_id,
            ];
    }
}
