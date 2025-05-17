import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type ListingType = 'lost' | 'found';

export type Listing = {
    id: string;
    listingType: ListingType;
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
            id: uuidv4(),
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