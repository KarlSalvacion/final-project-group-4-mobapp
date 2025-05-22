import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import stylesMyListingsScreen from '../styles/StylesMyListingsScreen';
import { BACKEND_BASE_URL } from '../config/apiConfig';

type RootStackParamList = {
    Home: undefined;
    DetailedItemListing: { listingId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Listing {
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
}

const MyListingsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { token } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchListings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${BACKEND_BASE_URL}/api/listings/my-listings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch listings');
            }

            const data = await response.json();
            setListings(data);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError(err instanceof Error ? err.message : 'Failed to load your listings. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [token]);

    const handleListingPress = (listingId: string) => {
        navigation.navigate('DetailedItemListing', { listingId });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <View style={stylesMyListingsScreen.mainContainer}>
                <View style={stylesMyListingsScreen.headerContainer}>
                    <View style={stylesMyListingsScreen.headerContent}>
                        <Text style={stylesMyListingsScreen.headerTitle}>My Listings</Text>
                    </View>
                </View>
                <View style={stylesMyListingsScreen.loadingContainer}>
                    <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={stylesMyListingsScreen.mainContainer}>
                <View style={stylesMyListingsScreen.headerContainer}>
                    <View style={stylesMyListingsScreen.headerContent}>
                        <Text style={stylesMyListingsScreen.headerTitle}>My Listings</Text>
                    </View>
                </View>
                <View style={stylesMyListingsScreen.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={50} color="#f00" />
                    <Text style={stylesMyListingsScreen.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={stylesMyListingsScreen.mainContainer}>
            <View style={stylesMyListingsScreen.headerContainer}>
                <View style={stylesMyListingsScreen.headerContent}>
                    <Text style={stylesMyListingsScreen.headerTitle}>My Listings</Text>
                </View>
            </View>

            <ScrollView 
                style={stylesMyListingsScreen.scrollView}
                contentContainerStyle={stylesMyListingsScreen.contentContainer}
            >
                <Text style={stylesMyListingsScreen.sectionTitle}>My Listings</Text>

                {listings.length === 0 ? (
                    <View style={stylesMyListingsScreen.emptyContainer}>
                        <Ionicons name="document-text-outline" size={50} color="#666" />
                        <Text style={stylesMyListingsScreen.emptyText}>
                            You haven't created any listings yet.
                        </Text>
                    </View>
                ) : (
                    listings.map((listing) => (
                        <TouchableOpacity
                            key={listing._id}
                            style={stylesMyListingsScreen.listingCard}
                            onPress={() => handleListingPress(listing._id)}
                        >
                            <View style={stylesMyListingsScreen.listingHeader}>
                                <Text style={stylesMyListingsScreen.listingTitle} numberOfLines={1}>
                                    {listing.title}
                                </Text>
                                <Text style={[
                                    stylesMyListingsScreen.listingStatus,
                                    listing.type === 'found' 
                                        ? stylesMyListingsScreen.statusFound 
                                        : stylesMyListingsScreen.statusLost
                                ]}>
                                    {listing.type.toUpperCase()}
                                </Text>
                            </View>

                            <View style={stylesMyListingsScreen.listingDetails}>
                                <View style={stylesMyListingsScreen.detailRow}>
                                    <Ionicons 
                                        name="calendar-outline" 
                                        size={20} 
                                        color="#666"
                                        style={stylesMyListingsScreen.detailIcon}
                                    />
                                    <Text style={stylesMyListingsScreen.detailText}>
                                        {formatDate(listing.date)}
                                    </Text>
                                </View>

                                <View style={stylesMyListingsScreen.detailRow}>
                                    <Ionicons 
                                        name="location-outline" 
                                        size={20} 
                                        color="#666"
                                        style={stylesMyListingsScreen.detailIcon}
                                    />
                                    <Text style={stylesMyListingsScreen.detailText} numberOfLines={1}>
                                        {listing.location}
                                    </Text>
                                </View>

                                <View style={stylesMyListingsScreen.detailRow}>
                                    <Ionicons 
                                        name="pricetag-outline" 
                                        size={20} 
                                        color="#666"
                                        style={stylesMyListingsScreen.detailIcon}
                                    />
                                    <Text style={stylesMyListingsScreen.detailText}>
                                        {listing.category}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default MyListingsScreen; 