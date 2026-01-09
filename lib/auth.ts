// Admin authentication utilities

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  token?: string;
}

const ADMIN_TOKEN_KEY = 'token';
const ADMIN_USER_KEY = 'user';

export const adminAuth = {
  // Login - calls API endpoint
  async login(email: string, password: string): Promise<AdminUser> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    const user: AdminUser = {
      id: data.user.id,
      email: data.user.email,
      name: `${data.user.firstName} ${data.user.lastName}`,
      role: data.user.role || 'admin',
      token: data.token,
    };
    
    this.setUser(user, data.token);
    return user;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  // Get current admin user
  getCurrentUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem(ADMIN_USER_KEY);
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    
    if (!userStr || !token) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if admin is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // Get auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  // Set admin user (after API response)
  setUser(user: AdminUser, token: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
  }
};

