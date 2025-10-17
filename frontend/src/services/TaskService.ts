import api from './api';

interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  is_completed?: boolean;
}

export default {
  async getAllTasks(): Promise<Task[]> {
    const response = await api.get('/tasks');
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(data: CreateTaskData): Promise<{ message: string; task: Task }> {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskData): Promise<{ message: string; task: Task }> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  async deleteTask(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async toggleTaskCompletion(id: number): Promise<{ message: string; task: Task }> {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  async getCompletedTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/completed');
    return response.data;
  },

  async getPendingTasks(): Promise<Task[]> {
    const response = await api.get('/tasks/pending');
    return response.data;
  }
};
