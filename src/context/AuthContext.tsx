import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';

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
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'user' | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing auth data on app start
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('jwtToken');
                const storedUserData = await AsyncStorage.getItem('userData');
                const storedUserType = await AsyncStorage.getItem('userType');

                if (storedToken && storedUserData && storedUserType) {
                    // Validate token with backend
                    const response = await fetch(`${BACKEND_BASE_URL}/api/users/check-token`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setToken(storedToken);
                        setUserData(JSON.parse(storedUserData));
                        setUserType(storedUserType as 'admin' | 'user');
                        setIsAuthenticated(true);
                    } else {
                        // Token is invalid, clear stored data
                        await AsyncStorage.multiRemove(['jwtToken', 'userData', 'userType']);
                        setToken(null);
                        setUserData(null);
                        setUserType(null);
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Error loading stored auth data:', error);
                // Clear stored data on error
                await AsyncStorage.multiRemove(['jwtToken', 'userData', 'userType']);
                setToken(null);
                setUserData(null);
                setUserType(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (email: string, userType: 'admin' | 'user', userData: UserData, token: string) => {
        try {
            setIsAuthenticated(true);
            setUserType(userType);
            setUserData(userData);
            setToken(token);
            
            // Store auth data
            await AsyncStorage.setItem('jwtToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('userType', userType);
        } catch (error) {
            console.error('Error storing auth data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setIsAuthenticated(false);
            setUserType(null);
            setUserData(null);
            setToken(null);
            
            // Clear stored auth data
            await AsyncStorage.multiRemove(['jwtToken', 'userData', 'userType']);
        } catch (error) {
            console.error('Error clearing auth data:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, userData, token, login, logout, isLoading }}>
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