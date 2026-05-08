<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request){
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255' ],
            'email' => ['required', 'string', 'email','unique:users,email'],
            'password' => ['required', 'string', 'min:8']
        ]);


        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json([
            'message' => 'utente registrato'
        ], 201);
    }

    public function login(Request $request){

        $validated = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string']
        ]);

        $user = User::where('email', $validated['email'])->first();

        if(!$user || !Hash::check($validated['password'], $user->password)){
            return response()->json([
                'message' => 'credenziali errate'
            ], 401);
        }

        $token = $user->createToken('my_token')->plainTextToken;

        return response()->json([
            'message' => 'login effetutato con successo',
            'token' => $token
        ], 200);
    }

    public function logout(Request $request){

        if ($request->user()) {
        $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'logout effettuato con successo'
        ], 200);
    }
}
