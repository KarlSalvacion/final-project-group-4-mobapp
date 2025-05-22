import { StyleSheet } from "react-native";

const stylesAdminTicketPage = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 80,
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
        width: 120,
        height: 60,
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
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 18,
        marginBottom: 18,
        color: '#222',
        letterSpacing: 0.5,
    },
    headerIcon: {
        marginHorizontal: 4,
    },
    filterContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        gap: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginHorizontal: 4,
    },
    pendingButton: {
        backgroundColor: '#FFA800',
    },
    approvedButton: {
        backgroundColor: '#00B050',
    },
    rejectedButton: {
        backgroundColor: '#FF4B4B',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 24,
        marginBottom: 8,
    },
    filterIcon: {
        marginRight: 4,
    },
    filterLabel: {
        color: '#888',
        fontWeight: '500',
        fontSize: 14,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    sortLabel: {
        marginRight: 10,
        color: '#666',
    },
    sortButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    sortButtonActive: {
        backgroundColor: 'rgb(25, 153, 100)',
        borderColor: 'rgb(25, 153, 100)',
    },
    sortButtonText: {
        color: '#333',
    },
    sortButtonTextActive: {
        color: '#fff',
    },
    ticketList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 4,
    },
    ticketItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3.84,
        elevation: 3,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ticketStatus: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontSize: 12,
        fontWeight: '500',
    },
    statusPending: {
        backgroundColor: '#FFF3E0',
        color: '#FF9800',
    },
    statusApproved: {
        backgroundColor: '#E8F5E9',
        color: '#4CAF50',
    },
    statusRejected: {
        backgroundColor: '#FFEBEE',
        color: '#F44336',
    },
    ticketInfo: {
        marginTop: 5,
    },
    ticketInfoText: {
        color: '#666',
        fontSize: 14,
        marginBottom: 5,
    },
    ticketActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f5f5f5',
    },
    actionButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    approveButton: {
        backgroundColor: '#E8F5E9',
    },
    approveButtonText: {
        color: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#FFEBEE',
    },
    rejectButtonText: {
        color: '#F44336',
    },
});

export default stylesAdminTicketPage;

