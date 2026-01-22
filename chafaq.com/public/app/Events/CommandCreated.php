<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;

class CommandCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $command;

    public function __construct($command)
    {
        $this->command = $command;
    }

    public function broadcastOn()
    {
        return new Channel('agent.' . $this->command->agent_id);
    }

    public function broadcastAs()
    {
        return 'NewCommand';
    }
}
