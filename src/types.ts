export type ListingType = 'lost' | 'found';

export interface Listing {
    _id: string;
    title: string;
    description: string;
    type: ListingType;
    category: string;
    location: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    date: string;
    time: string;
    images: string[];
    userId: {
        _id: string;
        name?: string;
        username?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// ... rest of the types ... 