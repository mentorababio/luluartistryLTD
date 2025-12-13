// Admin authentication utilities

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  token?: string;
}

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_USER_KEY = 'admin_user';

export const adminAuth = {
  // Login - will be replaced with actual API call
  async login(email: string, password: string): Promise<AdminUser> {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/admin/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await response.json();
    
    // For now, simulate login (remove in production)
    if (email && password) {
      const user: AdminUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
        token: 'mock_token_' + Date.now()
      };
      
      localStorage.setItem(ADMIN_TOKEN_KEY, user.token!);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    throw new Error('Invalid credentials');
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

