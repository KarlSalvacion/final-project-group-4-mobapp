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
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: 20,
    },

    profileIcon: {
        color: 'rgb(25, 153, 100)',
        fontSize: 24,
    },

    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    addListingButton: {
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
