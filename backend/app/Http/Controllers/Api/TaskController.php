<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * List all tasks for the authenticated user
     */
    public function index()
    {
        $tasks = $this->taskService->getUserTasks(Auth::id());
        return response()->json($tasks);
    }

    /**
     * Create a new task
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $task = $this->taskService->createTask(Auth::id(), $request->only(['title', 'description']));

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    /**
     * Show a single task
     */
    public function show($id)
    {
        $task = $this->taskService->getUserTask($id, Auth::id());

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    /**
     * Update a task
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_completed' => 'boolean',
        ]);

        $task = $this->taskService->updateTask($id, Auth::id(), $request->all());

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }

    /**
     * Delete a task
     */
    public function destroy($id)
    {
        $deleted = $this->taskService->deleteTask($id, Auth::id());

        if (!$deleted) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json(['message' => 'Task deleted successfully']);
    }

    /**
     * Toggle task completion status
     */
    public function toggle($id)
    {
        $task = $this->taskService->toggleTaskCompletion($id, Auth::id());

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json([
            'message' => 'Task status updated successfully',
            'task' => $task,
        ]);
    }

    /**
     * Get completed tasks
     */
    public function completed()
    {
        $tasks = $this->taskService->getUserCompletedTasks(Auth::id());
        return response()->json($tasks);
    }

    /**
     * Get pending tasks
     */
    public function pending()
    {
        $tasks = $this->taskService->getUserPendingTasks(Auth::id());
        return response()->json($tasks);
    }
}
