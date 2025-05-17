import { StyleSheet } from 'react-native';

export const stylesListingCard = StyleSheet.create({
    listingCardContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 200,
    },
    listingImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 16,
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },

    typeText: {
        fontSize: 14,
        color: '#666',
    },
    
    locationText: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    dateTimeText: {
        fontSize: 14,
        color: '#666',
    },
    icon: {
        fontSize: 16,
        color: '#666',
    },
}); 


