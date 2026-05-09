<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $taskId)
    {
        $task = $request->user()->tasks()->find($taskId);

        if (!$task) {
            return response()->json(['message' => 'Task non trovato'], 404);
        }

        $validated = $request->validate([
            'description' => ['required', 'string'],
            'is_completed' => ['boolean']
        ]);

        $note = $task->notes()->create($validated);

        return response()->json([
            'message' => 'nota aggiunta con successo'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $note = Note::whereHas('task', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->find($id);

        if (!$note) {
            return response()->json(['message' => 'Nota non trovata'], 404);
        }
        
        $validated = $request->validate([
            'description' => ['required', 'string'],
            'is_completed' => ['boolean']
        ]);

        $note->update($validated);

        return response()->json([
            'message' => 'Nota aggiornata con successo',
        ], 200);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $note = Note::whereHas('task', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->find($id);

        if (!$note) {
            return response()->json(['message' => 'Nota non trovata'], 404);
        }

        $note->delete();

        return response()->json([
            'message' => 'Nota eliminata con successo'
        ], 200);
    }
}
