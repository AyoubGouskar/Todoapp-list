<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class TaskDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $taskId;
    public $taskTitle;

    public function __construct(int $taskId, string $taskTitle)
    {
        $this->taskId = $taskId;
        $this->taskTitle = $taskTitle;
    }

    public function broadcastOn()
    {
        return new Channel('tasks');
    }

    public function broadcastAs()
    {
        return 'TaskDeleted';
    }

    public function broadcastWith()
    {
        return [
            'task_id' => $this->taskId,
            'task_title' => $this->taskTitle,
            'message' => 'A task has been deleted!',
            'timestamp' => now()->toISOString()
        ];
    }
}
