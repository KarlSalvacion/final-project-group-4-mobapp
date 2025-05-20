import { StyleSheet } from "react-native";

const stylesAdminDashboard = StyleSheet.create({
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
    profileButton: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 50,
    },
    statsContainer: {
        padding: 20,
        gap: 15,
    },
    pendingCard: {
        backgroundColor: '#FFA500',
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    smallCardsContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    approvedCard: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rejectedCard: {
        flex: 1,
        backgroundColor: '#FF5252',
        padding: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statContent: {
        flex: 1,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
    iconContainer: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentTicketsContainer: {
        padding: 20,
    },
    recentTicketsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    recentTicketsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllButton: {
        color: 'rgb(25, 153, 100)',
        fontSize: 14,
    },
    ticketList: {
        gap: 10,
    },
    ticketItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    ticketStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default stylesAdminDashboard;
