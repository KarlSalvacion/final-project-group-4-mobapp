import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { stylesDetailedItemListing } from '../styles/StylesDetailedItemListing';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useListings } from '../context/ListingContext';

type RootStackParamList = {
    DetailedItemListing: { listingId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DetailedItemListingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { listings } = useListings();
    
    // @ts-ignore - We know listingId exists in params
    const listingId = route.params?.listingId;
    const listing = listings.find(l => l._id === listingId);

    if (!listing) {
        return (
            <View style={stylesDetailedItemListing.mainContainer}>
                <Text>Listing not found</Text>
            </View>
        );
    }

    return (
        <View style={stylesDetailedItemListing.mainContainer}>
            <View style={stylesDetailedItemListing.headerContainer}>
                <TouchableOpacity 
                    style={stylesDetailedItemListing.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={stylesDetailedItemListing.headerTitle}>Item Details</Text>
            </View>
            
            <ScrollView style={stylesDetailedItemListing.scrollContainer}>
                {listing.images.length > 0 && (
                    <View style={stylesDetailedItemListing.imageContainer}>
                        <Image 
                            source={{ uri: listing.images[0] }}
                            style={stylesDetailedItemListing.image}
                        />
                    </View>
                )}
                
                <View style={stylesDetailedItemListing.contentContainer}>
                    <Text style={stylesDetailedItemListing.title}>{listing.title}</Text>
                    <Text style={stylesDetailedItemListing.description}>{listing.description}</Text>
                    
                    <View style={stylesDetailedItemListing.detailsContainer}>
                        <Ionicons name="location" style={stylesDetailedItemListing.icon} />
                        <Text style={stylesDetailedItemListing.detailText}>{listing.location}</Text>
                    </View>
                    
                    <View style={stylesDetailedItemListing.detailsContainer}>
                        <Ionicons name="calendar" style={stylesDetailedItemListing.icon} />
                        <Text style={stylesDetailedItemListing.detailText}>
                            {new Date(listing.date).toLocaleDateString()} at around {listing.time}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default DetailedItemListingScreen;

