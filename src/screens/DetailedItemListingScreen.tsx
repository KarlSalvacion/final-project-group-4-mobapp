import React from 'react';
import { View, Text } from 'react-native';
import { stylesDetailedItemListing } from '../styles/StylesDetailedItemListing';



const DetailedItemListingScreen = () => {
    return (
        <View style={stylesDetailedItemListing.mainContainer}>
            <Text>Detailed Item Listing</Text>
        </View>
    );
};

export default DetailedItemListingScreen;

