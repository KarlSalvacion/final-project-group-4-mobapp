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
    if (!listing) return null;

    return (
        <TouchableOpacity 
            style={stylesListingCard.listingCardContainer}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={stylesListingCard.imageContainer}>
                {listing.images && listing.images.length > 0 ? (
                    <Image 
                        source={{ uri: listing.images[0] }} 
                        style={stylesListingCard.listingImage} 
                    />
                ) : (
                    <View style={[stylesListingCard.listingImage, stylesListingCard.placeholderImage]}>
                        <Ionicons name="image-outline" size={40} color="#ccc" />
                    </View>
                )}
            </View>
            <View style={stylesListingCard.contentContainer}>
                <View style={stylesListingCard.titleContainer}>
                    <Text style={stylesListingCard.title} numberOfLines={1}>
                        {listing.title}
                    </Text>
                    {listing.type && (
                        <Text style={[
                            stylesListingCard.typeText,
                            listing.type === 'found' ? stylesListingCard.typeFound : stylesListingCard.typeLost
                        ]}>
                            {listing.type.toUpperCase()}
                        </Text>
                    )}
                </View>
                <Text style={stylesListingCard.description} numberOfLines={2}>
                    {listing.description}
                </Text>
                <View style={stylesListingCard.detailsContainer}>
                    <Ionicons name="person-outline" style={stylesListingCard.icon} />
                    <Text style={stylesListingCard.userText}>
                        {listing.userId?.name || 'Anonymous'}
                    </Text>
                </View>
                <View style={stylesListingCard.detailsContainer}>
                    <Ionicons name="location" style={stylesListingCard.icon} />
                    <Text style={stylesListingCard.locationText} numberOfLines={1}>
                        {listing.location}
                    </Text>
                </View>
                <View style={stylesListingCard.detailsContainer}>
                    <Ionicons name="calendar" style={stylesListingCard.icon} />
                    <Text style={stylesListingCard.dateTimeText}>
                        {new Date(listing.date).toLocaleDateString()} at {listing.time}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ListingCard;
