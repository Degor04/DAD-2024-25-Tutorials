<?php

namespace App\Policies;

use App\Models\User;

class SinglePlayerPolicy
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

    public function create(?User $users,Board $board): bool // created Board in branch models
    {   
        if($users->type == 'A' || $users->type == 'P'){
            return true;
        }
        else{
            return $board->board_cols === 3 && $board->board_rows === 4; 
        }
        
    }

    public function update(?User $users, Game $games): bool // created Game in branch models
    {
        return $games->created_user_id == $users->id;
    }
}
