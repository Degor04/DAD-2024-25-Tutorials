<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\GameHistoryController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\ScoreBoardController;
use App\Http\Controllers\api\MultiplayerGamesPlayedController;
use App\Models\Game;
use App\Http\Controllers\api\TransactionsController;
use App\Http\Controllers\api\UserControllerApi;
use App\Http\Controllers\api\RegisteredUserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('/gameHistory', [GameHistoryController::class, 'index']); //->can('viewAny', game::class);
Route::get('/scoreBoard', [ScoreBoardController::class, 'index']);
Route::get('/transactionsHistory',[TransactionsController::class,'index']);
Route::post('/transactionsUpdate', [TransactionsController::class, 'store']);
Route::post('/register', [UserControllerApi::class, 'store']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class, 'showMe']);
    Route::post('/user/update-brain-coins',[UserController::class,'updateBrainCoins']);
    Route::post('/games', [GameHistoryController::class, 'store']);
    Route::post('/user/update-password', [UserController::class, 'updatePassword']);
    Route::patch('/user/update-username', [UserController::class, 'updateUsername'])->name('user.updateUsername');
    Route::delete('/user/delete-account', [UserController::class, 'deleteAccount']);

    Route::post('/multiplayer_games', [MultiplayerGamesPlayedController::class, 'store']);
    Route::patch('/multiplayer_games/{multiplayer}', [MultiplayerGamesPlayedController::class, 'updateStatus']);
    Route::patch('/games/{game}', [GameHistoryController::class, 'updateStatus']);
    Route::get('/user/profile', [UserController::class, 'getUserProfile']);
    Route::get('/users', [UserController::class, 'getUserProfilee']);
    Route::delete('/users/{id}', [UserController::class, 'destroyById']);
    Route::put('/users/{id}/role', [UserController::class, 'toggleUserRole']);
    Route::put('/users/{id}/blocked', [UserController::class, 'toggleUserBlockedStatus']);
    Route::post('/games', [GameHistoryController::class, 'store']);
});

 Route::post('/auth/login', [AuthController::class, 'login']);
