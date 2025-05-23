import { StyleSheet, Platform, StatusBar } from 'react-native';

const stylesProfileScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 120,
        width: '100%',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    headerLogo: {
        width: 180,
        height: 80,
        resizeMode: 'contain',
    },
    scrollView: {
        flex: 1,
    },
    profileSection: {
        padding: 20,
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        padding: 20,
        gap: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    infoTextContainer: {
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
        gap: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    logoutButton: {
        backgroundColor: 'rgb(25, 153, 100)',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#f00',
        fontSize: 16,
        marginTop: 10,
    },
});

export default stylesProfileScreen;