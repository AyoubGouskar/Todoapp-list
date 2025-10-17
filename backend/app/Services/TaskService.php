<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Events\TaskCreated;
use App\Events\TaskUpdated;
use App\Events\TaskDeleted;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    protected $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    /**
     * Get all tasks for a user
     */
    public function getUserTasks(int $userId): Collection
    {
        return $this->taskRepository->getByUserId($userId);
    }

    /**
     * Get a specific task for a user
     */
    public function getUserTask(int $taskId, int $userId): ?Task
    {
        return $this->taskRepository->getByIdAndUserId($taskId, $userId);
    }

    /**
     * Create a new task
     */
    public function createTask(int $userId, array $data): Task
    {
        $taskData = array_merge($data, [
            'user_id' => $userId,
            'is_completed' => false,
        ]);

        $task = $this->taskRepository->create($taskData);

        // Fire the task created event for real-time notifications.
        // Do not let broadcasting failures break the API response.
        try {
            event(new TaskCreated($task));
        } catch (\Throwable $e) {
            // Log and continue; the task was created successfully.
            \Log::warning('Broadcast failed for TaskCreated event', [
                'error' => $e->getMessage(),
            ]);
        }

        return $task;
    }

    /**
     * Update a task
     */
    public function updateTask(int $taskId, int $userId, array $data): ?Task
    {
        $task = $this->taskRepository->getByIdAndUserId($taskId, $userId);

        if (!$task) {
            return null;
        }

        // Store original values to track changes
        $originalTask = $task->toArray();
        
        $updatedTask = $this->taskRepository->update($task, $data);

        // Determine what changed
        $changes = [];
        foreach ($data as $key => $value) {
            if (isset($originalTask[$key]) && $originalTask[$key] != $value) {
                $changes[$key] = [
                    'from' => $originalTask[$key],
                    'to' => $value
                ];
            }
        }

        // Fire the task updated event for real-time notifications
        try {
            event(new TaskUpdated($updatedTask, $changes));
        } catch (\Throwable $e) {
            // Log and continue; the task was updated successfully
            \Log::warning('Broadcast failed for TaskUpdated event', [
                'error' => $e->getMessage(),
            ]);
        }

        return $updatedTask;
    }

    /**
     * Delete a task
     */
    public function deleteTask(int $taskId, int $userId): bool
    {
        $task = $this->taskRepository->getByIdAndUserId($taskId, $userId);

        if (!$task) {
            return false;
        }

        // Store task info before deletion
        $taskTitle = $task->title;
        $taskId = $task->id;

        $deleted = $this->taskRepository->delete($task);

        if ($deleted) {
            // Fire the task deleted event for real-time notifications
            try {
                event(new TaskDeleted($taskId, $taskTitle));
            } catch (\Throwable $e) {
                // Log and continue; the task was deleted successfully
                \Log::warning('Broadcast failed for TaskDeleted event', [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $deleted;
    }

    /**
     * Get tasks with pagination
     */
    public function getUserTasksPaginated(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->taskRepository->getByUserIdPaginated($userId, $perPage);
    }

    /**
     * Get completed tasks for a user
     */
    public function getUserCompletedTasks(int $userId): Collection
    {
        return $this->taskRepository->getCompletedByUserId($userId);
    }

    /**
     * Get pending tasks for a user
     */
    public function getUserPendingTasks(int $userId): Collection
    {
        return $this->taskRepository->getPendingByUserId($userId);
    }

    /**
     * Toggle task completion status
     */
    public function toggleTaskCompletion(int $taskId, int $userId): ?Task
    {
        $task = $this->taskRepository->getByIdAndUserId($taskId, $userId);

        if (!$task) {
            return null;
        }

        $oldStatus = $task->is_completed;
        $newStatus = !$task->is_completed;

        $updatedTask = $this->taskRepository->update($task, [
            'is_completed' => $newStatus
        ]);

        // Fire the task updated event for real-time notifications
        try {
            event(new TaskUpdated($updatedTask, [
                'is_completed' => [
                    'from' => $oldStatus,
                    'to' => $newStatus
                ]
            ]));
        } catch (\Throwable $e) {
            // Log and continue; the task was updated successfully
            \Log::warning('Broadcast failed for TaskUpdated event (toggle)', [
                'error' => $e->getMessage(),
            ]);
        }

        return $updatedTask;
    }
}
