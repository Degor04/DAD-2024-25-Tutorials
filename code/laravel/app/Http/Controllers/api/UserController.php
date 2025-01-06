<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateBrainCoins;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
//use App\Http\Requests\UserFormRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Http\Requests\RegisterRequest;




class UserController extends Controller
{

    public function store(RegisterRequest $request)
    {
        $validated = $request->validated();

        // Assuming you want to set the type to 'P' by default and blocked to 0
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nickname' => $validated['nickname'],
            'type' => 'P', // Default user type
            'blocked' => 0, // Default blocked status
            'brain_coins_balance' => 10,
        ]);

        // Optionally log the user in after registration (if needed)
        Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
        ]);
    }

    public function showMe(Request $request)
    {
        return new UserResource($request->user());
    }

    public function updateBrainCoins(UpdateBrainCoins $request): JsonResponse
    {
        $validated = $request->validated();

        $user = Auth::user();

        if (!$user) {
            return response()->json(
                [
                    'message' => 'Error, are you logged in ?'
                ],
                401
            );
        }

        $user->brain_coins_balance += $validated['brain_coins_balance'];

        $user->save();

        return response()->json(['message' => 'Brain coins Updated']);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:3|confirmed',
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User was not found.'], 401);
        }

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Wrong password.'], 400);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['message' => 'Password updated with success!']);
    }

    public function updateUsername(Request $request)
    {
        $validated = $request->validate([
            'nickname' => 'required|string|max:255|unique:users,nickname',
        ]);

        $user = auth()->user();

        $user->update([
            'nickname' => $validated['nickname'],
        ]);

        return response()->json(['message' => 'Nickname updated with success!']);
    }

    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();
            $user->delete();

            Auth::logout();

            return response()->json(['message' => 'Account deleted with success.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting account.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getUserProfilee()
    {
        try {
            $users = User::all();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching users', 'error' => $e->getMessage()], 500);
        }
    }

    public function getUserProfile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'nickname' => $user->nickname,
            'type' => $user->type,
        ]);
    }

    public function destroyById($id)
    {
        if (auth()->user()->type !== 'A') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $user->delete();
            return response()->json(['message' => 'User deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting user.', 'error' => $e->getMessage()], 500);
        }
    }

    public function toggleUserRole($id)
    {
        $user = auth()->user();

        if (!$user || $user->type !== 'A') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $userToUpdate = User::find($id);

            if (!$userToUpdate) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $userToUpdate->type = ($userToUpdate->type === 'P') ? 'A' : 'P';
            $userToUpdate->save();

            return response()->json(['message' => 'User role updated successfully.', 'data' => $userToUpdate], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user role.', 'error' => $e->getMessage()], 500);
        }
    }


    public function toggleUserBlockedStatus($id)
    {
        if (auth()->user()->type !== 'A') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            $user->blocked = $user->blocked === 0 ? 1 : 0;
            $user->save();

            return response()->json(['message' => 'User blocked status updated successfully.', 'data' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating user blocked status.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(User $user): \Illuminate\Http\JsonResponse
    {
        try {
            $user->delete();

            return response()->json(['message' => 'Conta excluída com sucesso.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir a conta.', 'error' => $e->getMessage()], 500);
        }
    }


}
