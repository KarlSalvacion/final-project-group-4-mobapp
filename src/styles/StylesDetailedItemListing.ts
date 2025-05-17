import { StyleSheet } from 'react-native';

export const stylesDetailedItemListing = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        gap: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        fontSize: 20,
        color: 'rgb(25, 153, 100)',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
    }
});








