import { StyleSheet } from "react-native";

export const stylesHomeScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileButton: {
        padding: 5,
    },
    profileIcon: {
        fontSize: 24,
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    listContainer: {
        padding: 16,
        width: '100%',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    addListingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgb(25, 153, 100)',
        padding: 15,
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addListingText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
