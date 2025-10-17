<?php

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskRepository implements TaskRepositoryInterface
{
    protected $model;

    public function __construct(Task $model)
    {
        $this->model = $model;
    }

    /**
     * Get all tasks for a specific user
     */
    public function getByUserId(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)->get();
    }

    /**
     * Get a task by ID for a specific user
     */
    public function getByIdAndUserId(int $id, int $userId): ?Task
    {
        return $this->model->where('user_id', $userId)->find($id);
    }

    /**
     * Create a new task
     */
    public function create(array $data): Task
    {
        return $this->model->create($data);
    }

    /**
     * Update a task
     */
    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    /**
     * Delete a task
     */
    public function delete(Task $task): bool
    {
        return $task->delete();
    }

    /**
     * Get tasks with pagination
     */
    public function getByUserIdPaginated(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get completed tasks for a user
     */
    public function getCompletedByUserId(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
            ->where('is_completed', true)
            ->get();
    }

    /**
     * Get pending tasks for a user
     */
    public function getPendingByUserId(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
            ->where('is_completed', false)
            ->get();
    }
}
