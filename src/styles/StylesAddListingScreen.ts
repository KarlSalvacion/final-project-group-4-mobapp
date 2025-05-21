import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

export const stylesAddListingScreen = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
    },
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        gap: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    backButton: {
        gap: 10,
    },
    backButtonIcon: {
        color: '#fff',
        fontSize: 24,
    },

    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        
    },

    scrollContainer: {
        paddingTop: 20,
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
    },

    formContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    
    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },  

    formRow: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 10,
    },

    formRow2: {
        flexDirection: 'row',
        gap: 10,
    },

    dateContainer: {
        flex: 1,
    },

    timeContainer: {
        flex: 1,
    },

    label: {
        fontSize: 16,
        fontWeight: 400,
    },

    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },

    requiredInput: {
        borderColor: 'red',
    },

    inputText: {
        fontSize: 14,
        color: '#333',
    },
    pickerContainer: {  
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
    },

    pickerHeader: { 
        backgroundColor: 'red',
    },

    pickerButton: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
    },

    pickerButtonText: { 
        fontSize: 14,
        color: '#333',
    },
    
    imageInput: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imageInputText: {
        fontSize: 16,
        fontWeight: 400,
    },

    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginTop: 10,
    },

    submitButton: {
        width: '100%',
        height: 40,
        backgroundColor: 'rgb(25, 153, 100)',
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },

    imageScrollView: {
        flexDirection: 'row',
        marginTop: 10,
    },

    typeToggleContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 10,
    },
    typeToggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    typeToggleActive: {
        backgroundColor: 'rgb(25, 153, 100)',
        borderColor: 'rgb(25, 153, 100)',
    },
    typeToggleInactive: {
        backgroundColor: 'transparent',
        borderColor: 'rgb(25, 153, 100)',
    },
    typeToggleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    typeToggleTextActive: {
        color: 'white',
    },
    typeToggleTextInactive: {
        color: 'rgb(25, 153, 100)',
    },
});
