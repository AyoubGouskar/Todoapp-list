<?php

namespace App\Repositories\Interfaces;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;

interface TaskRepositoryInterface
{
    /**
     * Get all tasks for a specific user
     */
    public function getByUserId(int $userId): Collection;

    /**
     * Get a task by ID for a specific user
     */
    public function getByIdAndUserId(int $id, int $userId): ?Task;

    /**
     * Create a new task
     */
    public function create(array $data): Task;

    /**
     * Update a task
     */
    public function update(Task $task, array $data): Task;

    /**
     * Delete a task
     */
    public function delete(Task $task): bool;

    /**
     * Get tasks with pagination
     */
    public function getByUserIdPaginated(int $userId, int $perPage = 15);

    /**
     * Get completed tasks for a user
     */
    public function getCompletedByUserId(int $userId): Collection;

    /**
     * Get pending tasks for a user
     */
    public function getPendingByUserId(int $userId): Collection;
}
