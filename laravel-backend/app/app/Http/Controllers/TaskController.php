<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->with('notes')->get();

        return response()->json($tasks, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'is_completed' => ['boolean'],
            'date' => ['date'],
            'time' => ['required']

        ]);

        $task = $request->user()->tasks()->create($validated);

        return response()->json([
            'message' => 'task creato con successo'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $task = $request->user()->tasks()->find($id);

        if (!$task) {
            return response()->json(['message' => 'Utente non autorizzato'], 404);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'is_completed' => ['boolean'],
            'date' => ['required','date'],
            'time' => ['required']

        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'task aggiornato con successo'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $task = $request->user()->tasks()->find($id);

        if (!$task) {
            return response()->json(['message' => 'Utente non autorizzato'], 404);
        }

        $task->delete();

        return response()->json([
            'message' => 'task eliminato correttamente'
        ], 200);
    }
}
