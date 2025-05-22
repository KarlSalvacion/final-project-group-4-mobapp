import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, RefreshControl, Animated, Pressable } from 'react-native';
import { stylesHomeScreen } from '../styles/StylesHomeScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useListings } from '../context/ListingContext';
import ListingCard from '../components/ListingCard';
import ListingFilter, { FilterType } from '../components/ListingFilter';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
    DetailedItemListing: { listingId: string };
    Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const SEARCH_DEBOUNCE_DELAY = 300; // 300ms delay

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { listings, isLoading, error, fetchListings } = useListings();
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

    const logoWidth = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [180, 100],
        extrapolate: 'clamp',
    });

    const logoHeight = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [100, 40],
        extrapolate: 'clamp',
    });

    const filteredListings = useMemo(() => {
        // First, ensure unique listings by ID
        const uniqueListings = Array.from(
            new Map(listings.map(listing => [listing._id, listing])).values()
        );
        
        let filtered = uniqueListings;
        
        // Apply type filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(listing => listing.type === activeFilter);
        }
        
        // Apply search filter (only on title)
        if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.toLowerCase().trim();
            filtered = filtered.filter(listing => 
                listing.title.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [listings, activeFilter, debouncedSearchQuery]);

    const handleListingPress = (listingId: string) => {
        navigation.navigate('DetailedItemListing', { listingId });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    };

    const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <View style={stylesHomeScreen.mainContainer}>
            <Animated.View style={[
                stylesHomeScreen.headerContainer,
                {
                    height: headerHeight,
                    minHeight: HEADER_MIN_HEIGHT,
                }
            ]}>
                <Animated.View style={stylesHomeScreen.headerContent}>
                    <Animated.Image 
                        source={require('../assets/looke_logo.png')}
                        style={[
                            stylesHomeScreen.headerLogo,
                            {
                                width: logoWidth,
                                height: logoHeight,
                            }
                        ]}
                        resizeMode="contain"
                    />
                </Animated.View>
                <TouchableOpacity 
                    style={stylesHomeScreen.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[
                stylesHomeScreen.contentContainer,
                {
                    marginTop: headerHeight,
                }
            ]}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={handleClearSearch}
                    placeholder="Search by item name..."
                />
                
                <ListingFilter 
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                {isLoading && !refreshing ? (
                    <View style={stylesHomeScreen.loadingContainer}>
                        <ActivityIndicator size="large" color="rgb(25, 153, 100)" />
                    </View>
                ) : error ? (
                    <View style={stylesHomeScreen.errorContainer}>
                        <Text style={stylesHomeScreen.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={stylesHomeScreen.retryButton}
                            onPress={() => fetchListings()}
                        >
                            <Text style={stylesHomeScreen.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Animated.FlatList
                        ref={flatListRef}
                        data={filteredListings}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <ListingCard 
                                listing={item} 
                                onPress={() => handleListingPress(item._id)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={stylesHomeScreen.listContainer}
                        ListEmptyComponent={
                            <View style={stylesHomeScreen.emptyContainer}>
                                <Text style={stylesHomeScreen.emptyText}>
                                    {debouncedSearchQuery.trim() 
                                        ? 'No items match your search'
                                        : activeFilter === 'all' 
                                            ? 'No listings yet' 
                                            : `No ${activeFilter} items`}
                                </Text>
                            </View>
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['rgb(25, 153, 100)']}
                                tintColor="rgb(25, 153, 100)"
                            />
                        }
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    />
                )}

                <TouchableOpacity 
                    style={stylesHomeScreen.addListingButton} 
                    onPress={() => navigation.navigate('AddListing')}
                >
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

export default HomeScreen;
