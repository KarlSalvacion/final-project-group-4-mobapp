import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    RefreshControl,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import stylesMyListingsScreen from '../styles/StylesMyListingsScreen';
import { BACKEND_BASE_URL } from '../config/apiConfig';
import ListingCard from '../components/ListingCard';

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
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchListings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Fetching listings with token:', token.substring(0, 20) + '...');
            console.log('API URL:', `${BACKEND_BASE_URL}/api/listings/user/my-listings`);

            // First check if the server is running
            const healthCheck = await fetch(`${BACKEND_BASE_URL}/api/health`);
            if (!healthCheck.ok) {
                throw new Error('Server is not responding');
            }

            const response = await fetch(`${BACKEND_BASE_URL}/api/listings/user/my-listings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Expected JSON response but got ${contentType}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to fetch listings');
            }

            setListings(data);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError(err instanceof Error ? err.message : 'Failed to load your listings. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    }, []);

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

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
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
            <TouchableOpacity 
                style={stylesMyListingsScreen.headerContainer}
                onPress={scrollToTop}
                activeOpacity={1}
            >
                <View style={stylesMyListingsScreen.headerContent}>
                    <Text style={stylesMyListingsScreen.headerTitle}>My Listings</Text>
                    <Text style={stylesMyListingsScreen.listingCount}>({listings.length})</Text>
                </View>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={listings}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ListingCard
                        listing={item as any}
                        onPress={() => handleListingPress(item._id)}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={stylesMyListingsScreen.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['rgb(25, 153, 100)']}
                        tintColor="rgb(25, 153, 100)"
                    />
                }
                ListEmptyComponent={
                    <View style={stylesMyListingsScreen.emptyContainer}>
                        <Ionicons name="document-text-outline" size={50} color="#666" />
                        <Text style={stylesMyListingsScreen.emptyText}>
                            You haven't created any listings yet.
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default MyListingsScreen; 