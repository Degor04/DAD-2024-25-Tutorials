<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'type' => $this->type,
            //'gender' => $this->gender,
            'password' => $this->password,
            'blocked' => $this->blocked,
            'brain_coins_balance' => $this->brain_coins_balance,
            'photoFileName' => $this->photo_filename ? '/storage/photos/' . $this->photo_filename : null,
            ];
    }
}
