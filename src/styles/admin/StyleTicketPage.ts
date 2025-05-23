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
        alignItems: 'center',
    },
    headerLogo: {
        width: 120,
        height: 60,
    },
    listContainer: {
        padding: 16,
    },
    claimItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    claimHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    claimTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 8,
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    claimUser: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    claimDate: {
        fontSize: 12,
        color: '#999',
    },
    retryButton: {
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    modalButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#666',
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    imageScrollView: {
        marginVertical: 10,
    },
    proofImage: {
        width: 200,
        height: 200,
        marginRight: 10,
        borderRadius: 8,
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

