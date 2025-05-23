import { StyleSheet } from 'react-native';

const stylesMyClaimsScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        gap: 15,
    },

    backButton: {
        padding: 5,
    },
    
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    claimsCount: {
        fontSize: 20,
        color: '#fff',
        marginLeft: -10,
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    listContainer: {
        paddingBottom: 20,
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
        color: '#f00',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    claimCard: {
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
    },
    claimHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    claimTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    claimStatus: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    statusPending: {
        backgroundColor: '#FFA000',
        color: '#fff',
    },
    statusApproved: {
        backgroundColor: '#4CAF50',
        color: '#fff',
    },
    statusRejected: {
        backgroundColor: '#f44336',
        color: '#fff',
    },
    claimDetails: {
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailIcon: {
        marginRight: 10,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
});

export default stylesMyClaimsScreen; 