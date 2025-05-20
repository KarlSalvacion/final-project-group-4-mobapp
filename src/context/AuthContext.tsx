import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    token: string | null;
    login: (email: string, userType: 'admin' | 'user', userData: UserData, token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'user' | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = async (email: string, userType: 'admin' | 'user', userData: UserData, token: string) => {
        setIsAuthenticated(true);
        setUserType(userType);
        setUserData(userData);
        setToken(token);
        await AsyncStorage.setItem('jwtToken', token);
    };

    const logout = async () => {
        setIsAuthenticated(false);
        setUserType(null);
        setUserData(null);
        setToken(null);
        await AsyncStorage.removeItem('jwtToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, userData, token, login, logout }}>
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