import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (email: string, userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    validateToken: (token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const validateToken = async (token: string): Promise<boolean> => {
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/api/users/check-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                console.error('Token validation failed:', await response.text());
                return false;
            }
            
            const data = await response.json();
            return data.userData && data.userData._id;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    };

    // Check for existing auth data on app start
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('jwtToken');
                const storedUserData = await AsyncStorage.getItem('userData');

                if (storedToken && storedUserData) {
                    const isValid = await validateToken(storedToken);
                    const parsedUserData = JSON.parse(storedUserData);
                    
                    if (isValid && parsedUserData && parsedUserData._id) {
                        setToken(storedToken);
                        setUser(parsedUserData);
                        setIsAuthenticated(true);
                    } else {
                        console.log('Invalid stored auth data, logging out');
                        await logout();
                    }
                }
            } catch (error) {
                console.error('Error loading stored auth data:', error);
                await logout();
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    const login = async (email: string, userData: User, token: string) => {
        try {
            if (!userData._id) {
                throw new Error('Invalid user data');
            }
            
            // Validate token before storing
            const isValid = await validateToken(token);
            if (!isValid) {
                throw new Error('Invalid token');
            }
            
            setIsAuthenticated(true);
            setUser(userData);
            setToken(token);
            
            await AsyncStorage.setItem('jwtToken', token);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            
            await AsyncStorage.multiRemove(['jwtToken', 'userData']);
        } catch (error) {
            console.error('Error clearing auth data:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, isLoading, validateToken }}>
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