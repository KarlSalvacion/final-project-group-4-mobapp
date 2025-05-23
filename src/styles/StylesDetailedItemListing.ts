import { StyleSheet } from 'react-native';

export const stylesDetailedItemListing = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
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
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        lineHeight: 24,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        fontSize: 20,
        color: 'rgb(25, 153, 100)',
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
        color: '#333',
    },
    claimButton: {
        backgroundColor: 'rgb(25, 153, 100)',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    claimButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.7,
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: 600,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    claimInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgb(25, 153, 100)',
    },
    submitButton: {
        backgroundColor: 'rgb(25, 153, 100)',
        borderWidth: 1,
        borderColor: 'rgb(25, 153, 100)',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    modalCancelButtonText: {
        color: 'rgb(25, 153, 100)',
        fontSize: 16,
        fontWeight: '500',
    },
    imageUploadContainer: {
        marginBottom: 20,
    },
    imageUploadTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    imageUploadButton: {
        backgroundColor: 'rgb(25, 153, 100)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    imageUploadButtonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    imagePreviewWrapper: {
        width: 100,
        height: 100,
        position: 'relative',
        borderWidth: 2,
        borderColor: 'rgb(83, 83, 83)',
        borderRadius: 5,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    typeText: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        overflow: 'hidden',
    },
    typeFound: {
        backgroundColor: 'rgba(25, 153, 100, 0.1)',
        color: 'rgb(25, 153, 100)',
    },
    typeLost: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        color: 'rgb(255, 59, 48)',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 10,
        marginLeft: 'auto',
    },
    editButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#4a90e2',
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#e74c3c',
    },
    ownerButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    formSubLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
});








