import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import stylesMyClaimsScreen from '../styles/StylesMyClaimsScreen';
import { useAuth } from '../context/AuthContext';
import { BACKEND_BASE_URL } from '../config/apiConfig';

type RootStackParamList = {
    Home: undefined;
    DetailedItemListing: { listingId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Claim {
    _id: string;
    listingId: {
        _id: string;
        title: string;
        description: string;
        type: 'lost' | 'found';
        images: string[];
    };
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    proofImages: string[];
    createdAt: string;
    updatedAt: string;
}

const MyClaimsScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { token } = useAuth();
    const [claims, setClaims] = useState<Claim[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const fetchClaims = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${BACKEND_BASE_URL}/api/claims/my-claims`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch claims');
            }

            const data = await response.json();
            setClaims(data);
        } catch (err) {
            console.error('Error fetching claims:', err);
            setError(err instanceof Error ? err.message : 'Failed to load your claims. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchClaims();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchClaims();
    }, [token]);

    const handleClaimPress = (listingId: string) => {
        navigation.navigate('DetailedItemListing', { listingId });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return stylesMyClaimsScreen.statusPending;
            case 'approved':
                return stylesMyClaimsScreen.statusApproved;
            case 'rejected':
                return stylesMyClaimsScreen.statusRejected;
            default:
                return {};
        }
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

    const renderClaimItem = ({ item }: { item: Claim }) => {
        if (!item.listingId) {
            return null;
        }

        return (
            <TouchableOpacity
                style={stylesMyClaimsScreen.claimCard}
                onPress={() => handleClaimPress(item.listingId._id)}
            >
                <View style={stylesMyClaimsScreen.claimHeader}>
                    <Text style={stylesMyClaimsScreen.claimTitle}>
                        {item.listingId.title || 'Untitled Item'}
                    </Text>
                    <Text style={[
                        stylesMyClaimsScreen.claimStatus,
                        getStatusColor(item.status)
                    ]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
                <View style={stylesMyClaimsScreen.claimDetails}>
                    <View style={stylesMyClaimsScreen.detailRow}>
                        <Ionicons 
                            name="time-outline" 
                            size={16} 
                            color="#666"
                            style={stylesMyClaimsScreen.detailIcon}
                        />
                        <Text style={stylesMyClaimsScreen.detailText}>
                            Claimed on {formatDate(item.createdAt)}
                        </Text>
                    </View>
                    {item.description && (
                        <View style={stylesMyClaimsScreen.detailRow}>
                            <Ionicons 
                                name="information-circle-outline" 
                                size={16} 
                                color="#666"
                                style={stylesMyClaimsScreen.detailIcon}
                            />
                            <Text style={stylesMyClaimsScreen.detailText}>
                                {item.description.substring(0, 100)}
                                {item.description.length > 100 ? '...' : ''}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading && !refreshing) {
        return (
            <View style={stylesMyClaimsScreen.mainContainer}>
                <View style={stylesMyClaimsScreen.headerContainer}>
                    <View style={stylesMyClaimsScreen.headerContent}>
                        <Text style={stylesMyClaimsScreen.headerTitle}>My Claims</Text>
                    </View>
                </View>
                <View style={stylesMyClaimsScreen.loadingContainer}>
                    <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
                </View>
            </View>
        );
    }

    return (
        <View style={stylesMyClaimsScreen.mainContainer}>
            <TouchableOpacity 
                style={stylesMyClaimsScreen.headerContainer}
                onPress={scrollToTop}
                activeOpacity={1}
            >
                <View style={stylesMyClaimsScreen.headerContent}>
                    <Text style={stylesMyClaimsScreen.headerTitle}>My Claims</Text>
                    <Text style={stylesMyClaimsScreen.claimsCount}>({claims.length})</Text>
                </View>
            </TouchableOpacity>

            <FlatList
                ref={flatListRef}
                data={claims}
                keyExtractor={(item) => item._id}
                renderItem={renderClaimItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={stylesMyClaimsScreen.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['rgb(25, 153, 100)']}
                        tintColor="rgb(25, 153, 100)"
                    />
                }
                ListEmptyComponent={
                    <View style={stylesMyClaimsScreen.emptyContainer}>
                        <Ionicons name="document-text-outline" size={50} color="#666" />
                        <Text style={stylesMyClaimsScreen.emptyText}>
                            {error ? error : "You haven't made any claims yet."}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default MyClaimsScreen; 