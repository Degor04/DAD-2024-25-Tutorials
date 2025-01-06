<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\User;

class BoardPolicy
{
    public function viewAny(User $user): bool
    {
        // Permite visualizar qualquer board se o usuário for administrador ou possui permissão específica
        return $user->type == 'A' || $user->type == 'P';
    }

    public function view(User $user, Board $board): bool
    {
        // Permite visualizar o board específico se o usuário for administrador ou possui permissão específica
        return $user->type == 'A' || $user->type == 'P';
    }

    public function create(User $user): bool
    {
        // Permissão de criação restrita a administradores
        return $user->type == 'A';
    }

    public function update(User $user, Board $board): bool
    {
        // Permissão de atualização restrita a administradores
        return $user->type == 'A';
    }

    public function delete(User $user, Board $board): bool
    {
        // Permissão de exclusão restrita a administradores
        return $user->type == 'A';
    }
}
