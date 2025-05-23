import { StyleSheet, Platform, StatusBar } from 'react-native';

const stylesMyClaimsScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        width: '100%',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    claimsCount: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.9)',
        marginLeft: -10,
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
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
        color: '#dc3545',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 12,
        fontWeight: '500',
    },
    loadingMoreContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    claimCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    claimHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    claimTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        flex: 1,
        letterSpacing: 0.3,
    },
    claimStatus: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.3,
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
        backgroundColor: '#dc3545',
        color: '#fff',
    },
    claimDetails: {
        marginTop: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailIcon: {
        marginRight: 12,
        opacity: 0.7,
    },
    detailText: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
});

export default stylesMyClaimsScreen; 