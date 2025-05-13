import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { stylesListingCard } from '../styles/components/StylesListingCard';
import { Listing } from '../context/ListingContext';
import { Ionicons } from '@expo/vector-icons';

interface ListingCardProps {
    listing: Listing;
    onPress?: () => void;
}



const ListingCard = ({ listing, onPress }: ListingCardProps) => {
    return (
        <TouchableOpacity 
            style={stylesListingCard.listingCardContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={stylesListingCard.imageContainer}>
                <Image 
                    source={{ uri: listing.images[0] }} 
                    style={stylesListingCard.listingImage} 
                />
            </View>
            <View style={stylesListingCard.contentContainer}>
                <Text style={stylesListingCard.title} numberOfLines={1}>
                    {listing.name}
                </Text>
                <Text style={stylesListingCard.description} numberOfLines={2}>
                    {listing.description}
                </Text>
                <View style={stylesListingCard.detailsContainer}>
                    <Ionicons name="location" style={stylesListingCard.icon} />
                    <Text style={stylesListingCard.locationText} numberOfLines={1}>
                        {listing.location}
                    </Text>
                </View>
                <View style={stylesListingCard.detailsContainer}>
                    <Ionicons name="calendar" style={stylesListingCard.icon} />
                    <Text style={stylesListingCard.dateTimeText}>
                        {listing.date} at {listing.time}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ListingCard;
