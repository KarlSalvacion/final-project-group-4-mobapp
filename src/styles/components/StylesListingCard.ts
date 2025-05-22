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
    placeholderImage: {
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 16,
        gap: 8,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
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
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    typeFound: {
        backgroundColor: 'rgba(25, 153, 100, 0.1)',
        color: 'rgb(25, 153, 100)',
    },
    typeLost: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        color: 'rgb(255, 59, 48)',
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
    userText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    icon: {
        fontSize: 16,
        color: '#666',
    },
}); 


