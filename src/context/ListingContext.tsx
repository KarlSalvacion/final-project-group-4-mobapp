import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface Listing {
    _id: string;
    title: string;
    description: string;
    category: string;
    type: 'lost' | 'found';
    date: string;
    time: string;
    location: string;
    images: string[];
    createdAt: string;
    userId: {
        _id: string;
        name: string;
        username: string;
    };
    status: string;
}

interface ListingContextType {
    listings: Listing[];
    addListing: (listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    fetchListings: (page?: number, limit?: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ children }: { children: React.ReactNode }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAuthenticated } = useAuth();

    const fetchListings = async (page = 1, limit = 10) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = await AsyncStorage.getItem('jwtToken');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(
                `${BACKEND_BASE_URL}/api/listings?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }

            const data = await response.json();
            setHasMore(data.length === limit);
            setCurrentPage(page);
            setListings(prev => page === 1 ? data : [...prev, ...data]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching listings');
            console.error('Error fetching listings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addListing = async (listing: Omit<Listing, '_id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setError(null); // Clear any existing errors
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            Object.entries(listing).forEach(([key, value]) => {
                if (key === 'images' && Array.isArray(value)) {
                    value.forEach((image: string) => {
                        const imageUri = image;
                        const filename = imageUri.split('/').pop() || 'image.jpg';
                        const match = /\.(\w+)$/.exec(filename);
                        const type = match ? `image/${match[1]}` : 'image/jpeg';
                        
                        formData.append('images', {
                            uri: imageUri,
                            type,
                            name: filename,
                        } as any);
                    });
                } else if (typeof value === 'string') {
                    formData.append(key, value);
                }
            });

            const response = await fetch(`${BACKEND_BASE_URL}/api/listings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create listing');
            }

            const newListing = await response.json();
            setListings(prev => [newListing, ...prev]);
            setError(null); // Ensure error is cleared on success
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating listing';
            setError(errorMessage);
            console.error('Error creating listing:', err);
            throw err;
        }
    };

    // Fetch listings when the app starts and user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchListings(1);
        } else {
            setListings([]);
            setError(null);
            setCurrentPage(1);
            setHasMore(true);
        }
    }, [isAuthenticated]);

    return (
        <ListingContext.Provider 
            value={{ 
                listings, 
                addListing, 
                fetchListings, 
                isLoading, 
                error,
                hasMore,
                currentPage
            }}
        >
            {children}
        </ListingContext.Provider>
    );
};

export const useListings = () => {
    const context = useContext(ListingContext);
    if (context === undefined) {
        throw new Error('useListings must be used within a ListingProvider');
    }
    return context;
}; 