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
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'rgb(25, 153, 100)',
        paddingHorizontal: 20,
        gap: 10,
    },

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 15,
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

    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 16,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },

    resetButtonText: {
        color: 'rgb(25, 153, 100)',
        fontSize: 16,
        fontWeight: 'bold',
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

    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
        paddingHorizontal: 10,
        textAlign: 'left',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },

    requiredInput: {
        borderColor: 'gray',
    },

    inputText: {
        fontSize: 14,
        color: '#333',
    },
    pickerContainer: {  
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },

    pickerHeader: { 
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },

    pickerButtonContainer: {
        flexDirection: 'row',
        gap: 10,
        
    },

    pickerButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'rgb(25, 153, 100)',
        borderRadius: 8,
    },

    cancelButton: {
        backgroundColor: '#f1f1f1',
    },

    cancelButtonText: {
        color: '#666',
    },

    pickerButtonText: { 
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    
    picker: {
        width: '100%',
        height: 200,
        backgroundColor: '#fff',
        
    },

    imageInput: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        
    },

    imageInputText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },

    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
        marginTop: 10,
    },

    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgb(25, 153, 100)',
        borderRadius: 5,
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },

    submitButtonDisabled: {
        opacity: 0.7,
    },

    submitButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
