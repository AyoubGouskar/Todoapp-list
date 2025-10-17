import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Configure Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher
// window.Pusher.logToConsole = true // Disabled for production
class RealtimeService {
  private echo: Echo<any> | null = null
  private isInitialized = false
  private referenceCount = 0

  /**
   * Add a reference to the realtime service
   */
  addReference() {
    this.referenceCount++
  }

  /**
   * Remove a reference from the realtime service
   */
  removeReference() {
    this.referenceCount = Math.max(0, this.referenceCount - 1)
    
    // Only disconnect if no references remain
    if (this.referenceCount === 0) {
      this.disconnect()
    }
  }

  /**
   * Initialize the real-time connection
   */
  initialize() {
    if (this.isInitialized && this.echo) {
      return
    }

    try {
      // Create Echo instance (minimal config for hosted Pusher)
      // TEMP: hard fallback to ensure connection while env loading is flaky
      const key = import.meta.env.VITE_PUSHER_APP_KEY || 'a38c0ed82ae96e5a8f51'
      const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'eu'

      this.echo = new Echo({
        broadcaster: 'pusher',
        key,
        cluster,
        forceTLS: true,
        enableStats: true, // Use enableStats instead of disableStats
        enabledTransports: ['wss', 'ws'],
        wsHost: `ws-${cluster}.pusher.com`,
        wssHost: `ws-${cluster}.pusher.com`,
        wsPort: 443,
        wssPort: 443,
        // Add connection stability options
        activityTimeout: 30000, // 30 seconds
        pongTimeout: 6000, // 6 seconds
        unavailableTimeout: 10000, // 10 seconds
      })

      // Set up event listeners
      this.setupEventListeners()
      
      this.isInitialized = true
      this.updateConnectionStatus(true)
      
    } catch (error) {
      console.error('Failed to initialize real-time connection:', error)
      this.updateConnectionStatus(false, 'Connection failed')
    }
  }

  /**
   * Set up event listeners for real-time events
   */
  private setupEventListeners() {
    if (!this.echo) return

    // Don't set up task listeners here - wait for subscription success

    // Listen for connection events
    this.echo.connector.pusher.connection.bind('connecting', () => {
      this.updateConnectionStatus(false, 'Connecting')
    })

    this.echo.connector.pusher.connection.bind('connected', () => {
      this.updateConnectionStatus(true)
      
      // Ensure we're subscribed to the tasks channel
      const tasksChannel = this.echo?.channel('tasks')
    })

    this.echo.connector.pusher.connection.bind('disconnected', () => {
      this.updateConnectionStatus(false, 'Connection lost')
    })

    this.echo.connector.pusher.connection.bind('error', (error: any) => {
      console.error('❌ Pusher connection error:', error)
      this.updateConnectionStatus(false, `Connection error: ${error.message || error}`)
    })

    this.echo.connector.pusher.connection.bind('unavailable', () => {
      console.error('❌ Pusher unavailable')
      this.updateConnectionStatus(false, 'Service unavailable')
    })

    this.echo.connector.pusher.connection.bind('reconnecting', () => {
      this.updateConnectionStatus(false, 'Reconnecting')
    })

    this.echo.connector.pusher.connection.bind('reconnected', () => {
      this.updateConnectionStatus(true)
    })

        // Set up event listeners immediately when channel is available
        const tasksChannel = this.echo?.channel('tasks')
        if (tasksChannel) {
          
          // Set up all event listeners
          tasksChannel.listen('TaskCreated', (event: any) => {
            this.handleTaskCreated(event)
          })
          
          tasksChannel.listen('TaskUpdated', (event: any) => {
            this.handleTaskUpdated(event)
          })
          
          tasksChannel.listen('TaskDeleted', (event: any) => {
            this.handleTaskDeleted(event)
          })
          
        }

        // Listen for subscription success as backup
        this.echo.connector.pusher.connection.bind('pusher_internal:subscription_succeeded', (data: any) => {
          
          // If this is the tasks channel, ensure event listeners are set up
          if (data.channel === 'tasks') {
            
            // Wait a moment for the channel to be fully ready
            setTimeout(() => {
              const tasksChannel = this.echo?.channel('tasks')
              
              if (tasksChannel) {
                // Re-set up event listeners to ensure they're working
                tasksChannel.listen('TaskCreated', (event: any) => {
                  this.handleTaskCreated(event)
                })
                
                tasksChannel.listen('TaskUpdated', (event: any) => {
                  this.handleTaskUpdated(event)
                })
                
                tasksChannel.listen('TaskDeleted', (event: any) => {
                  this.handleTaskDeleted(event)
                })
                
              }
            }, 100)
          }
        })
  }

  /**
   * Handle task created event
   */
  private handleTaskCreated(event: any) {
    // Dynamically import stores to avoid Pinia initialization issues
    import('@/stores/tasks').then(({ useTasksStore }) => {
      const tasksStore = useTasksStore()
      tasksStore.addTaskFromNotification(event.task)
    }).catch(error => {
      console.error('❌ Error importing tasks store:', error)
    })

    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      notificationsStore.addSuccess(
        'New Task Created',
        `Task "${event.task.title}" has been created successfully!`,
        { task: event.task }
      )
    }).catch(error => {
      console.error('❌ Error importing notifications store:', error)
    })
  }

  /**
   * Handle task updated event
   */
  private handleTaskUpdated(event: any) {
    // Dynamically import stores to avoid Pinia initialization issues
    import('@/stores/tasks').then(({ useTasksStore }) => {
      const tasksStore = useTasksStore()
      
      // Find and update the task in the store
      const taskIndex = tasksStore.tasks.findIndex(t => t.id === event.task.id)
      if (taskIndex !== -1) {
        tasksStore.tasks[taskIndex] = event.task
      }
    }).catch(error => {
      console.error('❌ Error importing tasks store:', error)
    })

    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      
      // Create a more descriptive message based on changes
      let changeMessage = ''
      if (event.changes) {
        const changes = Object.keys(event.changes)
        if (changes.includes('is_completed')) {
          const isCompleted = event.changes.is_completed.to
          changeMessage = `Task "${event.task.title}" has been ${isCompleted ? 'completed' : 'marked as pending'}!`
        } else if (changes.includes('title')) {
          changeMessage = `Task title updated from "${event.changes.title.from}" to "${event.changes.title.to}"!`
        } else {
          changeMessage = `Task "${event.task.title}" has been updated!`
        }
      } else {
        changeMessage = `Task "${event.task.title}" has been updated!`
      }
      
      notificationsStore.addInfo(
        'Task Updated',
        changeMessage,
        { task: event.task, changes: event.changes }
      )
    }).catch(error => {
      console.error('❌ Error importing notifications store:', error)
    })
  }

  /**
   * Handle task deleted event
   */
  private handleTaskDeleted(event: any) {
    // Dynamically import stores to avoid Pinia initialization issues
    import('@/stores/tasks').then(({ useTasksStore }) => {
      const tasksStore = useTasksStore()
      
      // Remove the task from the store
      tasksStore.tasks = tasksStore.tasks.filter(t => t.id !== event.task_id)
    }).catch(error => {
      console.error('❌ Error importing tasks store:', error)
    })

    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      
      notificationsStore.addWarning(
        'Task Deleted',
        `Task "${event.task_title}" has been deleted!`,
        { task_id: event.task_id, task_title: event.task_title }
      )
    }).catch(error => {
      console.error('❌ Error importing notifications store:', error)
    })
  }

  /**
   * Update connection status
   */
  private updateConnectionStatus(connected: boolean, error?: string) {
    // Update the dedicated connection store
    import('@/stores/connection').then(({ useConnectionStore }) => {
      const connectionStore = useConnectionStore()
      const state = error ? 'failed' : (connected ? 'connected' : 'disconnected')
      connectionStore.updateStatus(connected, state)
    })
    
    // Also update notifications store for backward compatibility
    import('@/stores/notifications').then(({ useNotificationsStore }) => {
      const notificationsStore = useNotificationsStore()
      notificationsStore.setConnectionStatus(connected, error)
    })
  }

  /**
   * Disconnect from real-time service
   */
  disconnect() {
    if (this.echo) {
      this.echo.disconnect()
      this.echo = null
      this.isInitialized = false
      this.updateConnectionStatus(false)
    }
  }

  /**
   * Reconnect to real-time service
   */
  reconnect() {
    this.disconnect()
    this.initialize()
  }

  /**
   * Check if real-time is connected
   */
  isConnected(): boolean {
    return this.isInitialized && this.echo?.connector?.pusher?.connection?.state === 'connected'
  }

  /**
   * Get connection state
   */
  getConnectionState(): string {
    if (!this.echo?.connector?.pusher?.connection) {
      return 'disconnected'
    }
    return this.echo.connector.pusher.connection.state
  }

  /**
   * Subscribe to a specific channel
   */
  subscribe(channelName: string) {
    if (!this.echo) {
      console.warn('Echo not initialized. Call initialize() first.')
      return null
    }
    return this.echo.channel(channelName)
  }

  /**
   * Force re-subscribe to tasks channel
   */
  resubscribeToTasks() {
    if (!this.echo) {
      console.warn('Echo not initialized. Call initialize() first.')
      return
    }
    
    // Unsubscribe first to ensure clean state
    this.echo.leave('tasks')
    
    // Wait a moment then re-subscribe
    setTimeout(() => {
      // Just subscribe - the event listener will be set up by the subscription success handler
      this.echo?.channel('tasks')
    }, 100)
  }

  /**
   * Manually set up event listeners (for debugging)
   */
  setupTaskEventListeners() {
    if (!this.echo) {
      console.warn('Echo not initialized. Call initialize() first.')
      return false
    }
    
    const tasksChannel = this.echo.channel('tasks')
    if (tasksChannel) {
      // Set up all event listeners
      tasksChannel.listen('TaskCreated', (event: any) => {
        this.handleTaskCreated(event)
      })
      
      tasksChannel.listen('TaskUpdated', (event: any) => {
        this.handleTaskUpdated(event)
      })
      
      tasksChannel.listen('TaskDeleted', (event: any) => {
        this.handleTaskDeleted(event)
      })
      
      return true
    }
    
    console.warn('[Realtime] Could not get tasks channel for manual setup')
    return false
  }

  /**
   * Subscribe to a private channel (requires authentication)
   */
  subscribePrivate(channelName: string) {
    if (!this.echo) {
      console.warn('Echo not initialized. Call initialize() first.')
      return null
    }
    return this.echo.private(channelName)
  }

  /**
   * Subscribe to a presence channel (requires authentication)
   */
  subscribePresence(channelName: string) {
    if (!this.echo) {
      console.warn('Echo not initialized. Call initialize() first.')
      return null
    }
    return this.echo.join(channelName)
  }
}

// Create singleton instance
const realtimeService = new RealtimeService()

export default realtimeService
