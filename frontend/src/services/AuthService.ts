import api from './api';

interface RegisterData {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: any;
  token: string;
}

export default {
  async register(data: RegisterData | FormData): Promise<AuthResponse> {
    // Check if data is FormData (for file uploads) or regular object
    const isFormData = data instanceof FormData;
    
    const response = await api.post('/auth/register', data, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data'
      } : {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
