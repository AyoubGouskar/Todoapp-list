<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class TaskUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;
    public $changes;

    public function __construct(Task $task, array $changes = [])
    {
        $this->task = $task;
        $this->changes = $changes;
    }

    public function broadcastOn()
    {
        return new Channel('tasks');
    }

    public function broadcastAs()
    {
        return 'TaskUpdated';
    }

    public function broadcastWith()
    {
        return [
            'task' => $this->task,
            'changes' => $this->changes,
            'message' => 'A task has been updated!',
            'timestamp' => now()->toISOString()
        ];
    }
}
