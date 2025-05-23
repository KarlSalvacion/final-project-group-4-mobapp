export interface User {
    _id?: string;
    id?: string;
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    profilePhoto?: string;
    createdAt: string;
}

export type ListingType = 'lost' | 'found';

export interface Listing {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    title: string;
    description: string;
    type: ListingType;
    category: string;
    location: string;
    date: string;
    time: string;
    images: string[];
    status: 'active' | 'claimed' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface Claim {
    _id: string;
    listingId: {
        _id: string;
        title: string;
        description: string;
        type: ListingType;
        images: string[];
    };
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    proofImages: string[];
    notes?: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Ticket {
    _id: string;
    itemName: string;
    status: 'pending' | 'approved' | 'rejected';
    student: {
        _id: string;
        name: string;
        email: string;
    };
    date: string;
    approvedBy?: {
        _id: string;
        name: string;
    };
    notes?: string;
    createdAt: string;
    updatedAt: string;
} 