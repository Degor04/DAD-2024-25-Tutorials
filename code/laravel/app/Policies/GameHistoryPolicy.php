<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Game;

class GameHistoryPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    // verifica se user tem todas as permissoes da policy
    // por isso e executada antes das outras funcoes
    // nunca dar return false
    public function before(User $users, string $ability): bool|null
    {
        if ($users->type == 'A') {
            return true;
        }
        return null;
    }

    public function viewSinglePlayer(User $users, Game $games): bool // created Game in branch models
    {

        return $games->created_user_id === $users->id;
    }

    // todo multiplayer games
}