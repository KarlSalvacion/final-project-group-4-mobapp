import React, { createContext, useContext, useState } from 'react';

interface UserData {
    name: string;
    username: string;
    role: string;
    email: string;
    createdAt: string;
    profilePhoto?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userType: 'admin' | 'user' | null;
    userData: UserData | null;
    login: (email: string, userType: 'admin' | 'user', userData: UserData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'user' | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);

    const login = async (email: string, userType: 'admin' | 'user', userData: UserData) => {
        setIsAuthenticated(true);
        setUserType(userType);
        setUserData(userData);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserType(null);
        setUserData(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, userData, login, logout }}>
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