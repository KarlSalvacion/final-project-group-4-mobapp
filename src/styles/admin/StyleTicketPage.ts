import { StyleSheet } from "react-native";

const stylesAdminTicketPage = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 120,
        width: '100%',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerLogo: {
        width: 180,
        height: 100,
    },
    headerTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    schoolName: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    logoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 1,
    },
    headerIcon: {
        marginHorizontal: 4,
    },
});

export default stylesAdminTicketPage;

