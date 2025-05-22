import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { stylesHomeScreen } from '../styles/StylesHomeScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useListings } from '../context/ListingContext';
import ListingCard from '../components/ListingCard';

type RootStackParamList = {
    Home: undefined;
    AddListing: undefined;
    DetailedItemListing: { listingId: string };
    Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { listings, isLoading, error, fetchListings } = useListings();
    const [refreshing, setRefreshing] = useState(false);

    const handleListingPress = (listingId: string) => {
        navigation.navigate('DetailedItemListing', { listingId });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    };

    return (
        <View style={stylesHomeScreen.mainContainer}>
            <View style={stylesHomeScreen.headerContainer}>
                <View style={stylesHomeScreen.headerContent}>
                    <Image 
                        source={require('../assets/looke_logo.png')}
                        style={stylesHomeScreen.headerLogo}
                        resizeMode="contain"
                    />
                </View>
                <TouchableOpacity 
                    style={stylesHomeScreen.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={stylesHomeScreen.contentContainer}>
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
                    <FlatList
                        data={listings}
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
                                <Text style={stylesHomeScreen.emptyText}>No listings yet</Text>
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
                    />
                )}

                <TouchableOpacity 
                    style={stylesHomeScreen.addListingButton} 
                    onPress={() => navigation.navigate('AddListing')}
                >
                    <Ionicons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default HomeScreen;
