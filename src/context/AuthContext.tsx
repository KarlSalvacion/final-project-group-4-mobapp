import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'admin' | 'user' | null;
  login: (email: string, userType: 'admin' | 'user') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'user' | null>(null);

  const login = (email: string, type: 'admin' | 'user') => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userType,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 