import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { trpc } from '../utils/trpc';

// Define types
interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data on initial load
  const { data: me, isLoading: isMeLoading, refetch } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!isMeLoading) {
      setUser(me || null);
      setIsLoading(false);
    }
  }, [me, isMeLoading]);

  const login = (userData: User) => {
    setUser(userData);
    refetch(); // Refetch to ensure session is active
  };

  const logout = async () => {
    try {
      await trpc.auth.logout.mutate();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
