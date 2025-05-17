import { StyleSheet } from "react-native";

const stylesAdminListingPage = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#00B04F",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        width: '100%',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default stylesAdminListingPage;


