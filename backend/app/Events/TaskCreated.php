<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class TaskCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    public function broadcastOn()
    {
        return new Channel('tasks'); // ✅ public channel
    }

    public function broadcastAs()
    {
        return 'TaskCreated';
    }

    public function broadcastWith()
    {
        return [
            'task' => $this->task,
            'message' => 'A new task has been created!',
            'timestamp' => now()->toISOString()
        ];
    }
}

