<?php

namespace App\Policies;

use App\Models\Multiplayer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MultiplayerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->type == 'A';
    }

    public function view(User $user, Multiplayer $multiplayer): bool
    {
        return $user->type == 'A' || $user->type == 'P';
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Multiplayer $multiplayer): bool
    {
        return false;
    }

    public function delete(User $user, Multiplayer $multiplayer): bool
    {
        return false;
    }
}
