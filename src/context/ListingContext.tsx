import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Listing } from '../types';
import { listingService } from '../services/listingService';

interface ListingContextType {
    listings: Listing[];
    addListing: (listing: Listing) => Promise<void>;
    updateListing: (listing: Listing) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    refreshListings: () => Promise<void>;
    fetchListings: (page?: number, limit?: number) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { isAuthenticated, token } = useAuth();

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

    const addListing = async (listing: Listing) => {
        try {
            setError(null); // Clear any existing errors
            // Update the listings state with the new listing
            setListings(prev => [listing, ...prev]);
            setError(null); // Ensure error is cleared on success
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating listings';
            setError(errorMessage);
            console.error('Error updating listings:', err);
            throw err;
        }
    };

    const updateListing = async (listing: Listing) => {
        try {
            setError(null); // Clear any existing errors
            // Update the listings state with the updated listing
            setListings(prev => prev.map(l => l._id === listing._id ? listing : l));
            setError(null); // Ensure error is cleared on success
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating listings';
            setError(errorMessage);
            console.error('Error updating listings:', err);
            throw err;
        }
    };

    const deleteListing = async (id: string) => {
        try {
            setError(null); // Clear any existing errors
            // Update the listings state by removing the listing with the specified id
            setListings(prev => prev.filter(l => l._id !== id));
            setError(null); // Ensure error is cleared on success
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting listings';
            setError(errorMessage);
            console.error('Error deleting listings:', err);
            throw err;
        }
    };

    const refreshListings = async () => {
        try {
            await fetchListings(1);
        } catch (err) {
            console.error('Error refreshing listings:', err);
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
                updateListing,
                deleteListing,
                refreshListings,
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