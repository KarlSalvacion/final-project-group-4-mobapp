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
        alignItems: 'center',
        justifyContent: 'center',
    },

    listContainer: {
        padding: 16,
        gap: 16,
        width: 400,

    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    addListingText: {
        color: 'rgb(255, 255, 255)',
        fontSize: 16,
        fontWeight: 'bold',
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
        backgroundColor: 'rgb(25, 153, 100)',
        padding: 15,
        borderRadius: 20,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    addListingButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

   

});
