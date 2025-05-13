import React, { createContext, useContext, useState } from 'react';

export type Listing = {
    id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    location: string;
    images: string[];
};

type ListingContextType = {
    listings: Listing[];
    addListing: (listing: Omit<Listing, 'id'>) => void;
};

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const ListingProvider = ({ children }: { children: React.ReactNode }) => {
    const [listings, setListings] = useState<Listing[]>([]);

    const addListing = (listing: Omit<Listing, 'id'>) => {
        const newListing: Listing = {
            ...listing,
            id: Date.now().toString(), // Simple ID generation
        };
        setListings(prev => [...prev, newListing]);
    };

    return (
        <ListingContext.Provider value={{ listings, addListing }}>
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