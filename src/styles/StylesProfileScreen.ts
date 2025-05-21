import { StyleSheet, Platform } from "react-native";

const stylesProfileScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorHeader: {
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    errorText: {
        color: '#666',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 16 : 48,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'fff',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
        color: '#333',
    },
    profileSection: {
        padding: 20,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },

    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },

    button: {
        backgroundColor: 'rgb(25, 153, 100)',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginTop: 10,
    },

    logoutButton: {
        backgroundColor: '#f44336',
    },  

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    deleteButton: {
        backgroundColor: '#f44336',
    },

    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

});

export default stylesProfileScreen;