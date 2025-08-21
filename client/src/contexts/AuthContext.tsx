import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_FROM_STORAGE'; payload: { user: User; token: string } | null };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOAD_FROM_STORAGE':
      if (action.payload) {
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
          isLoading: false,
          isAuthenticated: true,
        };
      }
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, confirmPassword: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Load authentication state from localStorage on app start
    const loadAuthFromStorage = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: { user, token } });
        } else {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: null });
        }
      } catch (error) {
        console.error('Error loading auth from storage:', error);
        // Clear corrupted data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: null });
      }
    };

    loadAuthFromStorage();
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store authentication data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string = 'user'
  ): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store authentication data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User): void => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token: state.token! },
    });
  };

  const value: AuthContextValue = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, requireAdmin = false, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to access this page.</p>
          <a href="/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <a href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}