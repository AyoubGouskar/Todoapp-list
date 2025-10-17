<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you can register all of the event broadcasting channels that your
| application supports. For public channels, simply return true.
|
*/

Broadcast::channel('tasks', function () {
    return true; // ✅ public channel, no login check needed
});
