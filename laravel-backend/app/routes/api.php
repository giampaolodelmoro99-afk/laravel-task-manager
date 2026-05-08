<?php

use App\Http\Controllers\NoteController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum']], function(){
    Route::apiResource('tasks', TaskController::class);
    
    Route::get('tasks/{taskId}/notes', [NoteController::class, 'index']);
    Route::post('tasks/{taskId}/notes', [NoteController::class, 'store']);
    Route::put('notes/{id}', [NoteController::class, 'update']);
    Route::delete('notes/{id}', [NoteController::class, 'destroy']);

    Route::post('logout', [UserController::class, 'logout']);
});