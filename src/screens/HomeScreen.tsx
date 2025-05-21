import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
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

    const handleListingPress = (listingId: string) => {
        navigation.navigate('DetailedItemListing', { listingId });
    };

    return (
        <View style={stylesHomeScreen.mainContainer}>
            <View style={stylesHomeScreen.headerContainer}>
                <Text style={stylesHomeScreen.headerTitle}>DLSL FoundIt</Text>
                <TouchableOpacity 
                    style={stylesHomeScreen.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Ionicons 
                        name="person" 
                        style={stylesHomeScreen.profileIcon}
                    />
                </TouchableOpacity>
            </View>
            <View style={stylesHomeScreen.contentContainer}>
                {isLoading ? (
                    <View style={stylesHomeScreen.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : error ? (
                    <View style={stylesHomeScreen.errorContainer}>
                        <Text style={stylesHomeScreen.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={stylesHomeScreen.retryButton}
                            onPress={fetchListings}
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
