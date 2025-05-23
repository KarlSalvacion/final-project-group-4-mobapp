import { StyleSheet } from 'react-native';

export const stylesImagePreview = StyleSheet.create({
    imagePreviewScrollViewContainer: {
        marginTop: 10,
        flexDirection: 'row',
        width: '100%',
        marginRight: 20,
    },

    imagePreviewContainer: {
        height: 120,

        width: '100%',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'rgb(34, 34, 34)',
        marginRight: 10,
    },

    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 0,
        backgroundColor: 'rgb(227, 227, 227)',
        borderRadius: 20,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',   
        borderWidth: 2,
        borderColor: 'rgb(148, 148, 148)',
    },

    deleteButtonIcon: {
        color: 'rgb(34, 34, 34)',
        fontSize: 20,
    },
});
