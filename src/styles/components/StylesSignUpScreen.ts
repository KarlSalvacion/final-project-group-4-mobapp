import { StyleSheet } from 'react-native';

export const stylesSignUpScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1,
    },
    headerContainer: {
        height: 60,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        gap: 10,
    },
    backButton: {
        padding: 5,
    },
    backButtonIcon: {
        fontSize: 24,
        color: '#333',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'rgb(25, 153, 100)',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
    inputIcons: {
        position: 'absolute',
        right: 10,
    },
    passwordToggle: {
        padding: 5,
    },
    submitButton: {
        height: 50,
        backgroundColor: 'rgb(25, 153, 100)',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        alignItems: 'center',
        marginTop: 0,
    },
    loginLinkText: {
        color: 'rgb(25, 153, 100)',
        fontSize: 16,
    },
    domainText: {
        position: 'absolute',
        right: 40,
        color: '#666',
        fontSize: 16,
        alignSelf: 'center',
    },
}); 