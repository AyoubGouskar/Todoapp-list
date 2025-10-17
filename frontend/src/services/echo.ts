import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher;

// Create Echo instance
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY || 'your-pusher-key',
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
  forceTLS: true,
  encrypted: true,
});

export default echo;
