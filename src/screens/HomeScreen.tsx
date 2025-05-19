import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
    const { listings } = useListings();

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
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ListingCard 
                            listing={item} 
                            onPress={() => handleListingPress(item.id)}
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

                <TouchableOpacity 
                    style={stylesHomeScreen.addListingButton} 
                    onPress={() => navigation.navigate('AddListing')}
                >
                    <Text style={stylesHomeScreen.addListingText}>Add a Listing</Text>  
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default HomeScreen;
