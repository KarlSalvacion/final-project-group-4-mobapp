import { StyleSheet } from "react-native";

const stylesAdminUserPage = StyleSheet.create({
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
    userListContainer: {
        flex: 1,
        padding: 20,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    userUsername: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 5,
    },
    adminRole: {
        color: 'rgb(25, 153, 100)',
    },
    userRoleText: {
        color: '#666',
    },
    userDate: {
        fontSize: 12,
        color: '#999',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    searchIcon: {
        marginRight: 10,
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
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10,
    },
    roleButton: {
        flex: 1,
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    promoteButton: {
        backgroundColor: 'rgb(25, 153, 100)',
    },
    demoteButton: {
        backgroundColor: '#666',
    },
    roleButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#ff4444',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default stylesAdminUserPage; 