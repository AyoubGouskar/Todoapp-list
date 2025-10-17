import { createRouter, createWebHistory } from "vue-router";
import TasksView from "../views/TasksView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import HomeView from "../views/HomeView.vue";
import AuthService from "../services/AuthService";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: "/", 
      name: "home", 
      component: HomeView,
      meta: { 
        title: "Home - Todo App",
        description: "Welcome to Todo App"
      }
    },
    { 
      path: "/tasks", 
      name: "tasks", 
      component: TasksView, 
      meta: { 
        requiresAuth: true,
        title: "Tasks - Todo App",
        description: "Manage your tasks"
      }
    },
    { 
      path: "/login", 
      name: "login", 
      component: LoginView,
      meta: { 
        requiresGuest: true,
        title: "Login - Todo App",
        description: "Sign in to your account"
      }
    },
    { 
      path: "/register", 
      name: "register", 
      component: RegisterView,
      meta: { 
        requiresGuest: true,
        title: "Register - Todo App",
        description: "Create your account"
      }
    },
    { 
      path: "/notifications", 
      name: "notifications", 
      component: () => import("../views/NotificationsView.vue"), 
      meta: { 
        requiresAuth: true,
        title: "Notifications - Todo App",
        description: "View your notifications"
      }
    },
    // Catch-all route for 404
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "Page Not Found - Todo App"
      }
    }
  ],
});

// Enhanced route guard with better logic
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const token = AuthService.getToken();
  
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  
  // Set page description
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description as string);
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!token) {
      // No token, redirect to login with return URL
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // Token exists, verify it's still valid
    try {
      // Initialize auth store if not already done
      if (!authStore.isAuthenticated) {
        await authStore.checkAuth();
      }
      
      if (!authStore.isAuthenticated) {
        // Token is invalid, redirect to login
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        });
        return;
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      // Token verification failed, redirect to login
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest) {
    if (token && authStore.isAuthenticated) {
      // User is already authenticated, redirect to tasks
      next('/tasks');
      return;
    }
  }

  // Allow navigation
  next();
});

// Handle navigation errors
router.onError((error) => {
  console.error('Router error:', error);
  // You could redirect to an error page here
});

export default router;
